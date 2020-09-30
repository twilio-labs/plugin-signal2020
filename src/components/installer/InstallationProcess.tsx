import { useMachine } from '@xstate/react';
import { Box, Text, useInput } from 'ink';
import React, { useEffect, useMemo } from 'react';
import { State } from 'xstate';
import { useUser } from '../../context/user';
import {
  installerMachine,
  InstallerMachineContext,
  InstallerMachineEvent,
  InstallerMachineSchema,
} from '../../machines/installerMachine';
import { DemoLanguage } from '../../types/demo';
import {
  download,
  getAndCreateDirectory,
  installDependencies,
  setupProject,
} from '../../utils/installer';
import { Key } from '../common/Key';
import { Selectable } from '../common/Selectable';
import { InstallationSummary } from './InstallationSummary';
import { DownloadProjectQuestions } from './questions/DownloadProjectQuestions';
import { GetAndCreateDirectoryQuestions } from './questions/GetAndCreateDirectoryQuestions';
import { InstallDependenciesQuestions } from './questions/InstallDependenciesQuestions';
import { SetupProjectQuestions } from './questions/SetupProjectQuestions';
import { ResultOutput } from './ResultOutput';
import { StepIndicator, StepStatus } from './StepIndicator';

export function wrappedPromise(promise: Promise<any>) {
  return promise.catch((err) => {
    throw err;
  });
}

export function useDefaultValues() {
  const user = useUser();
  const defaultValues: { [key: string]: any } = {
    TWILIO_ACCOUNT_SID: user.accountSid,
    ACCOUNT_SID: user.accountSid,
  };

  const twilioUsername = user.twilioUsername;
  if (twilioUsername !== null && twilioUsername?.startsWith('AC')) {
    defaultValues['TWILIO_AUTH_TOKEN'] = user.twilioPassword;
    defaultValues['AUTH_TOKEN'] = user.twilioPassword;
  } else {
    defaultValues['TWILIO_API_KEY'] = user.twilioUsername;
    defaultValues['TWILIO_API_SECRET'] = user.twilioPassword;
  }

  return defaultValues;
}

type StepStatusMap = {
  createDirectory: StepStatus;
  download: StepStatus;
  installDependencies: StepStatus;
  configure: StepStatus;
};
function getStepStatuses(
  currentState: State<
    InstallerMachineContext,
    InstallerMachineEvent,
    InstallerMachineSchema
  >
): StepStatusMap {
  const { results } = currentState.context;
  const statusMap: StepStatusMap = {
    createDirectory: 'todo',
    download: 'todo',
    installDependencies: 'todo',
    configure: 'todo',
  };

  if (currentState.matches('askingForDirectory')) {
    statusMap.createDirectory = 'active';
    return statusMap;
  }

  if (currentState.matches('creatingDirectory')) {
    statusMap.createDirectory = 'running';
    return statusMap;
  }

  statusMap.createDirectory =
    !!results.createDirectory && results.createDirectory.skipped
      ? 'skipped'
      : results.createDirectory
      ? 'success'
      : 'error';

  if (currentState.matches('confirmingDownload')) {
    statusMap.download = 'active';
    return statusMap;
  }

  if (currentState.matches('downloading')) {
    statusMap.download = 'running';
    return statusMap;
  }

  statusMap.download =
    !!results.download && results.download.skipped
      ? 'skipped'
      : results.download
      ? 'success'
      : 'error';

  if (currentState.matches('confirmInstallingDependencies')) {
    statusMap.installDependencies = 'active';
    return statusMap;
  }

  if (currentState.matches('installingDependencies')) {
    statusMap.installDependencies = 'running';
    return statusMap;
  }

  statusMap.installDependencies =
    !!results.installDependencies && results.installDependencies.skipped
      ? 'skipped'
      : results.installDependencies
      ? 'success'
      : 'error';

  if (currentState.matches('confirmConfiguring')) {
    statusMap.configure = 'active';
    return statusMap;
  }

  if (currentState.matches('configuring')) {
    statusMap.configure = 'running';
    return statusMap;
  }

  statusMap.configure =
    !!results.configure && results.configure.skipped
      ? 'skipped'
      : results.configure
      ? 'success'
      : 'error';

  return statusMap;
}

export type InstallationProcessProps = {
  repoUrl: string;
  language: DemoLanguage;
  onDone: Function;
  slim?: boolean;
  shouldRenderDetails?: boolean;
};
export function InstallationProcess({
  repoUrl,
  language,
  onDone,
  slim,
  shouldRenderDetails = true,
}: InstallationProcessProps) {
  const defaultConfigValues = useDefaultValues();
  const [currentState, send, service] = useMachine(installerMachine, {
    services: {
      createDirectory: (context) =>
        context.directory
          ? wrappedPromise(getAndCreateDirectory(context.directory))
          : Promise.reject(new Error('Something went wrong')),
      download: (context) =>
        context.repoUrl && context.directory
          ? wrappedPromise(
              download(context.repoUrl, context.directory, { force: true })
            )
          : Promise.reject(new Error('Something went wrong')),
      installDependencies: (context) =>
        context.directory && context.language
          ? wrappedPromise(
              installDependencies(
                context.directory,
                context.language,
                context.results?.download?.hasPackageJson,
                context.results?.download?.hasMakeFile
              )
            )
          : Promise.reject(new Error('Something went wrong')),
      configure: (context) =>
        context.directory && context.results.parsedResult
          ? wrappedPromise(
              setupProject(
                context.directory,
                context.results.parsedResult,
                context.results.parsedResult.answers
              )
            )
          : Promise.reject(new Error('Something went wrong')),
    },
    context: {
      repoUrl,
      language,
      isEmptyDirectory: undefined,
      directory: undefined,
    },
  });

  useEffect(() => {
    service.onDone(({ data }) => {
      onDone(data);
    });
  }, [service]);

  useEffect(() => {
    if (currentState.matches('failure.error')) {
      onDone({ successful: false });
    }
  }, [currentState.value]);

  useInput(
    (_, key) => {
      if (key.return) {
        send('RESTART');
      } else if (key.escape) {
        send('FINISH');
      }
    },
    { isActive: currentState.matches('failure.cancelled') }
  );

  const stepStatusMap = useMemo(() => getStepStatuses(currentState), [
    currentState,
  ]);

  return (
    <Box flexDirection="column" flexGrow={1} width="100%">
      <StepIndicator
        slim={slim}
        title="1. Specify installation location"
        status={stepStatusMap.createDirectory}
        shouldRenderDetails={shouldRenderDetails}
      >
        {currentState.matches('askingForDirectory') && (
          <GetAndCreateDirectoryQuestions dispatch={send} />
        )}
        {currentState.context.results.createDirectory && (
          <ResultOutput result={currentState.context.results.createDirectory} />
        )}
      </StepIndicator>
      <StepIndicator
        slim={slim}
        title="2. Downloading sample"
        status={stepStatusMap.download}
        shouldRenderDetails={shouldRenderDetails}
      >
        {currentState.matches('confirmingDownload') && (
          <DownloadProjectQuestions
            dispatch={send}
            context={currentState.context}
          />
        )}
        {currentState.context.results.download && (
          <ResultOutput result={currentState.context.results.download} />
        )}
      </StepIndicator>
      <StepIndicator
        slim={slim}
        title="3. Installing dependencies"
        status={stepStatusMap.installDependencies}
        shouldRenderDetails={shouldRenderDetails}
      >
        {currentState.matches('confirmInstallingDependencies') && (
          <InstallDependenciesQuestions dispatch={send} />
        )}
        {currentState.context.results.installDependencies && (
          <ResultOutput
            result={currentState.context.results.installDependencies}
          />
        )}
      </StepIndicator>
      <StepIndicator
        slim={slim}
        title="4. Setting up project"
        status={stepStatusMap.configure}
        shouldRenderDetails={shouldRenderDetails}
      >
        {currentState.matches('confirmConfiguring') &&
          currentState.context.directory && (
            <SetupProjectQuestions
              directory={currentState.context.directory}
              dispatch={send}
              defaultValues={defaultConfigValues}
            />
          )}
        {currentState.context.results.configure && (
          <ResultOutput result={currentState.context.results.configure} />
        )}
      </StepIndicator>
      {currentState.matches('success') && currentState.context.directory && (
        <StepIndicator slim={slim} title="5. Project Ready">
          <InstallationSummary directory={currentState.context.directory} />
        </StepIndicator>
      )}
      {currentState.matches('failure') && (
        <StepIndicator slim={slim} title="Failed to setup project">
          <Box flexDirection="column">
            <Box flexDirection="column">
              {currentState.matches('failure') && (
                <Text>{currentState.meta['installer.failure'].message}</Text>
              )}
              {currentState.matches('failure.error') && (
                <Text>{currentState.context.error.join('\n')}</Text>
              )}
            </Box>
            {currentState.matches('failure.cancelled') && (
              <Box flexDirection="column">
                <Text>
                  Do you want to try again? Press <Key>Esc</Key> otherwise.
                </Text>
                <Selectable active>Retry</Selectable>
              </Box>
            )}
          </Box>
        </StepIndicator>
      )}
    </Box>
  );
}
