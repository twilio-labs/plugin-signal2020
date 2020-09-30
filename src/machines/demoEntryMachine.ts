import { assign, Machine } from 'xstate';
import { Demo } from '../types/demo';
import {
  nextIdxWithRollover,
  prevIdxWithRollover,
} from '../utils/arrayHelpers';

export enum DemoEntryOptions {
  VIEW_CODE = 'view-code',
  LEARN_MORE = 'learn-more',
  DOWNLOAD = 'download',
  QUICK_DEPLOY = 'quick-deploy',
}

export interface DemoEntryMachineSchema {
  states: {
    'view-code': {};
    'learn-more': {};
    download: {};
    'quick-deploy': {};
  };
}

export interface DemoEntryMachineContext {
  demo?: Demo;
  activeLanguageIdx: number;
  hasGit: boolean;
}

type DemoEntryResetEvent = { type: 'RESET'; data: Demo };

export type DemoEntryEvent =
  | {
      type: 'NEXT_LANGUAGE';
    }
  | { type: 'PREV_LANGUAGE' }
  | { type: 'NEXT_OPTION' }
  | { type: 'PREV_OPTION' }
  | DemoEntryResetEvent;

export function hasQuickDeploy(context: DemoEntryMachineContext): boolean {
  return (
    typeof context.demo !== 'undefined' && !!context.demo.quick_deploy_link
  );
}

export function hasDownload(context: DemoEntryMachineContext): boolean {
  if (!context.hasGit) {
    return false;
  }

  return (
    !!context.demo &&
    typeof context.activeLanguageIdx !== 'undefined' &&
    !context.demo.is_community &&
    context.demo.options[context.activeLanguageIdx] &&
    context.demo.options[context.activeLanguageIdx].repo_link !== null
  );
}

export function hasViewCode(context: DemoEntryMachineContext): boolean {
  return (
    !!context.demo &&
    typeof context.activeLanguageIdx !== 'undefined' &&
    context.demo.options[context.activeLanguageIdx] &&
    (context.demo.options[context.activeLanguageIdx].repo_link !== null ||
      !!context.demo.options[context.activeLanguageIdx].functions_link)
  );
}

export const demoEntryStateMachine = Machine<
  DemoEntryMachineContext,
  DemoEntryMachineSchema,
  DemoEntryEvent
>({
  id: 'demoEntry',
  initial: DemoEntryOptions.LEARN_MORE,
  context: {
    demo: undefined,
    activeLanguageIdx: 0,
    hasGit: true,
  },
  on: {
    NEXT_LANGUAGE: {
      actions: [
        assign({
          activeLanguageIdx: (context) =>
            nextIdxWithRollover(
              context.activeLanguageIdx,
              context.demo?.options
            ),
        }),
      ],
    },
    PREV_LANGUAGE: {
      actions: [
        assign({
          activeLanguageIdx: (context) =>
            prevIdxWithRollover(
              context.activeLanguageIdx,
              context.demo?.options
            ),
        }),
      ],
    },
    RESET: {
      target: DemoEntryOptions.LEARN_MORE,
      actions: [
        assign<DemoEntryMachineContext, DemoEntryResetEvent>({
          activeLanguageIdx: 0,
          demo: (_, event) => event.data,
        }),
      ],
    },
  },
  states: {
    [DemoEntryOptions.LEARN_MORE]: {
      on: {
        NEXT_OPTION: [
          { target: DemoEntryOptions.VIEW_CODE, cond: hasViewCode },
          { target: DemoEntryOptions.DOWNLOAD, cond: hasDownload },
          { target: DemoEntryOptions.QUICK_DEPLOY, cond: hasQuickDeploy },
          { target: DemoEntryOptions.LEARN_MORE },
        ],
        PREV_OPTION: [
          { target: DemoEntryOptions.QUICK_DEPLOY, cond: hasQuickDeploy },
          { target: DemoEntryOptions.DOWNLOAD, cond: hasDownload },
          { target: DemoEntryOptions.VIEW_CODE, cond: hasViewCode },
          { target: DemoEntryOptions.LEARN_MORE },
        ],
      },
    },
    [DemoEntryOptions.VIEW_CODE]: {
      on: {
        NEXT_OPTION: [
          { target: DemoEntryOptions.DOWNLOAD, cond: hasDownload },
          { target: DemoEntryOptions.QUICK_DEPLOY, cond: hasQuickDeploy },
          { target: DemoEntryOptions.LEARN_MORE },
        ],
        PREV_OPTION: DemoEntryOptions.LEARN_MORE,
      },
    },
    [DemoEntryOptions.DOWNLOAD]: {
      on: {
        NEXT_OPTION: [
          {
            target: DemoEntryOptions.QUICK_DEPLOY,
            cond: hasQuickDeploy,
          },
          {
            target: DemoEntryOptions.LEARN_MORE,
          },
        ],
        PREV_OPTION: [
          { target: DemoEntryOptions.VIEW_CODE, cond: hasViewCode },
          { target: DemoEntryOptions.LEARN_MORE },
        ],
      },
    },
    [DemoEntryOptions.QUICK_DEPLOY]: {
      on: {
        NEXT_OPTION: DemoEntryOptions.LEARN_MORE,
        PREV_OPTION: [
          { target: DemoEntryOptions.DOWNLOAD, cond: hasDownload },
          { target: DemoEntryOptions.VIEW_CODE, cond: hasViewCode },
          { target: DemoEntryOptions.LEARN_MORE },
        ],
      },
    },
  },
});
