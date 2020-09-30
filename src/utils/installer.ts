import { createOutput } from 'configure-env/dist/output';
import { parseFile, VariableDeclaration } from 'configure-env/dist/parser';
import degit, { Info } from 'degit';
import execa from 'execa';
import fsFull from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import { projectInstall } from 'pkg-install';
import { InputTypes } from '../components/form/Input';
import { getTerminalInfo } from '../hooks/useTerminalInfo';
import { DemoLanguage } from '../types/demo';
import { exists } from './fsHelpers';
import defaultLogger from './logger';

const fs = fsFull.promises;

export type CreateDirectoryResult = {
  fullPath: string;
  isEmpty: boolean;
  output: [string];
};
export async function getAndCreateDirectory(
  relativePath: string
): Promise<CreateDirectoryResult> {
  const fullPath = path.resolve(process.cwd(), relativePath);
  await mkdirp(fullPath);
  const files = await fs.readdir(fullPath);
  const output =
    files.length > 0
      ? `Found existing directory with files in it at ${fullPath}`
      : `Created empty directory at ${fullPath}`;
  return { fullPath, isEmpty: files.length === 0, output: [output] };
}

export type DownloadOptions = {
  force?: boolean;
  updateFunction?: (msg: Info) => any;
};
export type DownloadResult = {
  output: [string];
  hasExampleEnvFile: boolean;
  hasMakeFile: boolean;
  hasPackageJson: boolean;
};
export async function download(
  repoUrl: string,
  outputPath: string,
  options: DownloadOptions = {}
): Promise<DownloadResult> {
  const logger = defaultLogger.child({ module: 'installer/download' });
  let { updateFunction, force } = options || {};
  force = typeof force === 'undefined' ? false : force;

  logger.info({ msg: 'cloning project', repoUrl, outputPath });

  const output: Info[] = [];
  updateFunction =
    updateFunction ||
    ((msg: Info) => {
      logger.debug({ msg: 'cloning update', info: msg });
      output.push(msg);
    });
  const emitter = degit(repoUrl, {
    cache: false,
    force: force,
    verbose: false,
  });

  emitter.on('info', updateFunction);

  await emitter.clone(outputPath);
  emitter.off('info', updateFunction);
  const fullOutput = output.map((x) => x.message);
  const envExampleFilePath = path.join(outputPath, '.env.example');
  const hasExampleEnvFile = await exists(envExampleFilePath);
  const hasPackageJson = await exists(path.join(outputPath, 'package.json'));

  const terminalInfo = getTerminalInfo();
  const hasMakeFile =
    terminalInfo.hasMake && (await exists(path.join(outputPath, 'Makefile')));

  const result: DownloadResult = {
    output: [fullOutput[fullOutput.length - 1]],
    hasExampleEnvFile,
    hasMakeFile,
    hasPackageJson,
  };
  logger.info({ msg: 'finished cloning' });
  logger.debug({ msg: 'download result', result });
  return result;
}

export type InstallResult = {
  output: [string];
};
export async function installDependencies(
  projectPath: string,
  language?: DemoLanguage,
  hasPackageJson?: boolean,
  hasMakeFile?: boolean
): Promise<InstallResult> {
  switch (language) {
    case 'JavaScript':
    case 'TypeScript':
      return installNodeDependencies(projectPath);
  }

  if (hasMakeFile) {
    return installDependenciesWithMake(projectPath);
  }

  if (hasPackageJson) {
    return installNodeDependencies(projectPath);
  }

  return Promise.reject(new Error('Invalid language'));
}

export async function installDependenciesWithMake(
  projectPath: string
): Promise<InstallResult> {
  const logger = defaultLogger.child({ module: 'installer/install' });
  try {
    logger.debug({ msg: 'Running make install', projectPath });
    const { failed, stdout, stderr } = await execa.command('make install', {
      shell: true,
      cwd: projectPath,
    });

    logger.debug({ failed, stdout, stderr, msg: 'make install result' });

    let summaryLine = 'Successfully installed dependencies';
    if (failed) {
      summaryLine =
        'Failed to automatically install dependencies. Please try again manually.';
    }

    return { output: [summaryLine] };
  } catch (err) {
    logger.error({
      msg: 'failed to install dependencies with make',
      error: err,
    });
    logger.info('carrying on without dependency installation');
    return {
      output: [
        'Failed to automatically install dependencies. Please try again manually.',
      ],
    };
  }
}

export async function installNodeDependencies(
  projectPath: string
): Promise<InstallResult> {
  const logger = defaultLogger.child({ module: 'installer/install' });
  try {
    logger.debug({ msg: 'Running pkg-install.projectInstall', projectPath });
    const { failed, stdout, stderr } = await projectInstall({
      cwd: projectPath,
    });

    logger.debug({ failed, stdout, stderr, msg: 'make install result' });

    let summaryLine = 'Successfully installed dependencies';
    if (failed) {
      summaryLine =
        'Failed to automatically install dependencies. Please try again manually.';
    }

    return { output: [summaryLine] };
  } catch (err) {
    logger.error({
      msg: 'failed to install dependencies with pkgInstall.projectInstall',
      error: err,
    });
    logger.info('carrying on without dependency installation');
    return {
      output: [
        'Failed to automatically install dependencies. Please try again manually.',
      ],
    };
  }
}

const ALWAYS_SECRET_VALUES = [
  'TWILIO_AUTH_TOKEN',
  'AUTH_TOKEN',
  'TWILIO_API_SECRET',
  'API_SECRET',
];

export type VariableQuestion = {
  type: InputTypes;
  name: string;
  message: string;
  details?: string | null;
  defaultValue?: any;
  earlyExitIfValue?: () => any;
};

function isVariableQuestion(
  value: VariableQuestion | undefined
): value is VariableQuestion {
  return typeof value !== 'undefined';
}

function createQuestionsFromVariableDeclarations(
  variableDeclarations: VariableDeclaration[],
  defaultValues: { [key: string]: any }
): VariableQuestion[] {
  return variableDeclarations
    .map<VariableQuestion | undefined>((declaration) => {
      if (!declaration.configurable) {
        return undefined;
      }

      let type: InputTypes = 'text';
      if (
        declaration.format === 'secret' ||
        ALWAYS_SECRET_VALUES.includes(declaration.key)
      ) {
        type = 'secret';
      }

      return {
        type,
        name: declaration.key,
        message: declaration.key,
        details: declaration.description,
        defaultValue:
          defaultValues[declaration.key] || declaration.default || undefined,
        earlyExitIfValue: undefined,
      };
    })
    .filter<VariableQuestion>(isVariableQuestion);
}

export async function getEnvSetupQuestions(
  projectPath: string,
  defaultValues: { [key: string]: any }
): Promise<ParsedExample | null> {
  const logger = defaultLogger.child({
    module: 'installer/getEnvSetupQuestions',
  });
  const envExampleFilePath = path.join(projectPath, '.env.example');
  if (await exists(envExampleFilePath)) {
    try {
      const result = await parseFile(envExampleFilePath);
      const questions = createQuestionsFromVariableDeclarations(
        result.variables,
        defaultValues
      );
      return { ...result, questions };
    } catch (err) {
      logger.error({ msg: 'failed to parse env file', error: err });
      logger.info('carrying on without setup questions');
      return null;
    }
  }
  return null;
}

export type ParsedExample = {
  questions: VariableQuestion[];
  variables: VariableDeclaration[];
  outputTemplate: string;
};

export async function setupProject(
  projectPath: string,
  parsedExample: ParsedExample,
  answers: { [key: string]: any }
) {
  const logger = defaultLogger.child({ module: 'installer/setupProject' });
  const outputEnvFile = path.join(projectPath, '.env');
  if (await exists(outputEnvFile)) {
    return {
      output: [
        `Existing .env file found at ${outputEnvFile}. Please configure manually.`,
      ],
    };
  }

  const output = createOutput(parsedExample, answers);

  try {
    await fs.writeFile(outputEnvFile, output, 'utf8');
    return {
      output: [`Created config file at ${outputEnvFile}`],
    };
  } catch (err) {
    logger.error({ msg: 'failed to write new .env file', error: err });
    logger.info('carrying on without creating file');
    return {
      output: [`Failed to create .env file. Manual configuration necessary.`],
    };
  }
}
