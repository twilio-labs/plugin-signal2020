import { VariableDeclaration } from 'configure-env/dist/parser';
import { assign, DoneInvokeEvent, EventObject, Machine } from 'xstate';
import { DemoLanguage } from '../types/demo';
import defaultLogger from '../utils/logger';

const logger = defaultLogger.child({ stateMachine: 'installerMachine' });

export interface InstallerMachineSchema {
  states: {
    idle: {};
    askingForDirectory: {};
    creatingDirectory: {};
    confirmingDownload: {};
    downloading: {};
    confirmInstallingDependencies: {};
    installingDependencies: {};
    confirmConfiguring: {};
    configuring: {};
    success: {};
    failure: {
      states: {
        error: {};
        cancelled: {};
      };
    };
    finishedWithoutSuccess: {};
  };
}

export interface InstallerMachineContext {
  directory?: string;
  repoUrl?: string;
  language?: DemoLanguage;
  isEmptyDirectory?: boolean;
  results: { [key: string]: any };
  error: string[];
}

type InstallerMachineProvideDirEvent = {
  type: 'PROVIDE_DIRECTORY';
  data: { directory: string };
};

type InstallerMachineParsedResultEvent = {
  type: 'CONFIRM_CONFIGURING';
  data?: {
    questions: any;
    variables: VariableDeclaration[];
    outputTemplate: string;
    answers: { [key: string]: any };
  };
};

export type InstallerMachineEvent =
  | { type: 'START' }
  | { type: 'CONFIRM' }
  | { type: 'DENY' }
  | { type: 'RESTART' }
  | { type: 'FINISH' }
  | InstallerMachineProvideDirEvent
  | InstallerMachineParsedResultEvent
  | DoneInvokeEvent<any>;

export type InstallDispatcher = Function; /* Interpreter<
  InstallerMachineContext,
  any,
  InstallerMachineEvent
>['send'];*/

function assignResult(name: string) {
  return assign<InstallerMachineContext, DoneInvokeEvent<any>>({
    results: (context, event) => {
      return { ...context.results, [name]: event.data };
    },
  });
}

function assignResultAsSkipped(name: string, reason: string) {
  return assign<InstallerMachineContext>({
    results: (context: InstallerMachineContext) => {
      return {
        ...context.results,
        [name]: { output: [`Skipped ${reason}`], skipped: true },
      };
    },
  });
}

const log = (context: InstallerMachineContext, event: EventObject) => {
  logger.trace({ msg: 'action triggered', context, event });
};

const assignParsedResult = assign<
  InstallerMachineContext,
  InstallerMachineEvent
>({
  results: (context, event) => {
    if (event.type === 'CONFIRM_CONFIGURING' && event.data) {
      return { ...context.results, parsedResult: event.data };
    }
  },
});

const assignDirectory = assign<InstallerMachineContext, InstallerMachineEvent>({
  directory: (context, event) =>
    event.type === 'PROVIDE_DIRECTORY'
      ? event.data.directory
      : context.directory,
});

const handleError = assign<InstallerMachineContext, DoneInvokeEvent<any>>({
  error: (context, event) => {
    logger.error({
      msg: 'Failure in installerMachine',
      event,
    });
    return [...context.error, event.data.message];
  },
});

export const updateDirectory = assign<
  InstallerMachineContext,
  DoneInvokeEvent<{ fullPath: string; isEmpty: boolean }>
>({
  directory: (context, event) => event.data.fullPath,
  isEmptyDirectory: (context, event) => event.data.isEmpty,
});

export function hasSetupStep(
  context: InstallerMachineContext,
  event: { type: string; data?: { hasExampleEnvFile: boolean } }
): boolean {
  return (
    event?.data?.hasExampleEnvFile ||
    context?.results?.download?.hasExampleEnvFile
  );
}

export function hasInstallStep(
  context: InstallerMachineContext,
  event: {
    type: string;
    data?: { hasMakeFile: boolean; hasPackageJson: boolean };
  }
) {
  const hasMakeFile =
    event?.data?.hasMakeFile || context?.results?.download?.hasMakeFile;
  const hasPackageJson =
    event?.data?.hasPackageJson || context?.results?.download?.hasPackageJson;
  return (
    context.language === 'TypeScript' ||
    context.language === 'JavaScript' ||
    hasMakeFile ||
    hasPackageJson
  );
}

// eslint-disable-next-line new-cap
export const installerMachine = Machine<
  InstallerMachineContext,
  any,
  InstallerMachineEvent
>({
  id: 'installer',
  initial: 'askingForDirectory',
  context: {
    directory: undefined,
    repoUrl: undefined,
    language: undefined,
    isEmptyDirectory: undefined,
    results: {},
    error: [],
  },
  states: {
    idle: {
      on: {
        START: 'askingForDirectory',
      },
    },
    askingForDirectory: {
      on: {
        PROVIDE_DIRECTORY: {
          actions: [assignDirectory],
          target: 'creatingDirectory',
        },
      },
    },
    creatingDirectory: {
      invoke: {
        id: 'createDirectory',
        src: 'createDirectory',
        onDone: {
          target: 'confirmingDownload',
          actions: [updateDirectory, assignResult('createDirectory')],
        },
        onError: {
          target: 'failure',
          actions: [handleError],
        },
      },
    },
    confirmingDownload: {
      on: {
        CONFIRM: 'downloading',
        DENY: {
          target: 'failure.cancelled',
        },
      },
    },
    downloading: {
      invoke: {
        id: 'download',
        src: 'download',
        onDone: [
          {
            target: 'confirmInstallingDependencies',
            cond: hasInstallStep,
            actions: [assignResult('download')],
          },
          {
            target: 'confirmConfiguring',
            cond: hasSetupStep,
            actions: [
              assignResult('download'),
              assignResultAsSkipped(
                'installDependencies',
                'automatically. No installation for this project possible.'
              ),
            ],
          },
          {
            target: 'success',
            actions: [
              log,
              assignResult('download'),
              assignResultAsSkipped(
                'installDependencies',
                'automatically. No installation for this project possible.'
              ),
              assignResultAsSkipped(
                'configure',
                'automatically. No automatic setup for this project possible.'
              ),
            ],
          },
        ],
        onError: {
          target: 'failure',
          actions: [handleError],
        },
      },
    },
    confirmInstallingDependencies: {
      on: {
        CONFIRM: 'installingDependencies',
        DENY: {
          target: 'confirmConfiguring',
          actions: [assignResultAsSkipped('installDependencies', 'by user.')],
        },
      },
    },
    installingDependencies: {
      invoke: {
        id: 'installDependencies',
        src: 'installDependencies',
        onDone: [
          {
            cond: hasSetupStep,
            target: 'confirmConfiguring',
            actions: [assignResult('installDependencies')],
          },
          {
            target: 'success',
            actions: [
              assignResult('installDependencies'),
              assignResultAsSkipped(
                'configure',
                'automatically. No automatic setup for this project possible.'
              ),
            ],
          },
        ],
        onError: {
          target: 'failure',
          actions: [handleError],
        },
      },
    },
    confirmConfiguring: {
      on: {
        CONFIRM_CONFIGURING: {
          target: 'configuring',
          actions: [assignParsedResult],
        },
        DENY: {
          target: 'success',
          actions: [assignResultAsSkipped('configure', 'by user.')],
        },
      },
    },
    configuring: {
      invoke: {
        id: 'configure',
        src: 'configure',
        onDone: {
          target: 'success',
          actions: [assignResult('configure')],
        },
        onError: {
          target: 'failure',
          actions: [handleError],
        },
      },
    },
    success: {
      type: 'final',
      data: {
        directory: (context: InstallerMachineContext) => context.directory,
        successful: true,
      },
      meta: { message: 'Your sample has been installed. Enjoy!' },
    },
    failure: {
      initial: 'error',
      states: {
        error: {
          meta: { message: 'Something went wrong.' },
          type: 'final',
        },
        cancelled: {
          meta: { message: 'Feel free to start again.' },
          on: {
            RESTART: {
              target: '#installer.askingForDirectory',
              actions: assign<InstallerMachineContext>({
                directory: undefined,
                isEmptyDirectory: undefined,
                results: {},
                error: [],
              }),
            },
            FINISH: '#installer.finishedWithoutSuccess',
          },
        },
      },
      meta: { message: 'Did not finish creating sample.' },
    },
    finishedWithoutSuccess: {
      type: 'final',
      meta: { message: 'Finished' },
      data: {
        directory: null,
        successful: false,
      },
    },
  },
});
