import { DeployResult } from '@twilio-labs/serverless-api';
import { Machine } from 'xstate';
import { ChatMessage } from '../types/chatMessages';

export enum CheatModeEvents {
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  REQUEST = 'REQUEST',
  DEPLOY = 'DEPLOY',
  UPDATE = 'UPDATE',
}

export type CheatModeEventType = keyof typeof CheatModeEvents;

export interface CheatModeMachineSchema {
  states: {
    loading: {};
    off: {};
    idle: {};
    requesting: {};
    deploying: {};
  };
}

export interface CheatModeMachineContext {
  latestDeploymentInfo?: DeployResult;
  currentRequest?: string;
  latestTwiml?: string;
  messages: ChatMessage[];
  errors: Error[];
  username?: string | null;
  password?: string | null;
}

export type CheatModeMachineRequestEvent = {
  type: 'REQUEST';
  data: string;
};
export type CheatModeMachineUpdateEvent = {
  type: 'UPDATE';
  data: string;
};
export type CheatModeMachineDeployEvent = {
  type: 'DEPLOY';
  dispatch: Function;
};

export type CheatModeMachineEvent =
  | { type: 'ACTIVATE' }
  | { type: 'DEACTIVATE' }
  | CheatModeMachineDeployEvent
  | CheatModeMachineRequestEvent
  | CheatModeMachineUpdateEvent;

// eslint-disable-next-line new-cap
export const cheatModeMachine = Machine<
  CheatModeMachineContext,
  CheatModeMachineSchema,
  any
>({
  id: 'cheatMode',
  initial: 'loading',
  context: {
    latestDeploymentInfo: undefined,
    currentRequest: undefined,
    latestTwiml: undefined,
    messages: [],
    errors: [],
    username: undefined,
    password: undefined,
  },
  states: {
    loading: {
      on: {
        DEACTIVATE: 'off',
        ACTIVATE: 'idle',
      },
    },
    off: {
      on: {
        ACTIVATE: 'idle',
      },
    },
    idle: {
      on: {
        REQUEST: {
          target: 'requesting',
          actions: ['addRequestMessage'],
        },
        DEPLOY: {
          cond: 'canDeploy',
          target: 'deploying',
        },
      },
    },
    requesting: {
      invoke: {
        id: 'fetchingResult',
        src: 'fetchResult',
        onDone: {
          target: 'idle',
          actions: ['addTwimlResult'],
        },
        onError: {
          target: 'idle',
          actions: ['addErrorMessage'],
        },
      },
    },
    deploying: {
      invoke: {
        id: 'deployingResult',
        src: 'deployResult',
        onDone: {
          target: 'idle',
          actions: ['addDeployResult'],
        },
        onError: {
          target: 'idle',
          actions: ['addErrorMessage'],
        },
      },
      on: {
        UPDATE: {
          actions: ['handleUpdateMessage'],
        },
      },
    },
  },
});
