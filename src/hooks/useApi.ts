import { useMachine } from '@xstate/react';
import got from 'got';
import { useCallback, useEffect } from 'react';
import { Merge } from 'type-fest';
import { assign, Machine } from 'xstate';
import { DemosData } from '../types/inspector';
import config from '../utils/config';
import { getUserAgent } from '../utils/diagnostics';

export interface FetchMachineSchema {
  states: {
    idle: {};
    loading: {};
    resolved: {};
    rejected: {};
  };
}

export type FetchMachineEvent =
  | {
      type: 'FETCH';
    }
  | { type: 'CANCEL' };

export type FetchMachineContext<TData> = {
  error?: Error;
  data?: TData;
};

const fetchMachine = Machine<
  FetchMachineContext<any>,
  FetchMachineSchema,
  FetchMachineEvent
>({
  id: 'fetchMachine',
  initial: 'idle',
  context: {
    data: undefined,
    error: undefined,
  },
  states: {
    idle: {
      on: {
        FETCH: 'loading',
      },
    },
    loading: {
      invoke: {
        id: 'fetch',
        src: 'fetch',
        onDone: {
          target: 'resolved',
          actions: assign({
            data: (_, event) => event.data,
          }),
        },
        onError: {
          target: 'rejected',
          actions: assign({
            error: (_, event) => event.data,
          }),
        },
      },
      on: {
        CANCEL: 'idle',
        FETCH: 'loading',
      },
    },
    resolved: {
      type: 'final',
    },
    rejected: {
      on: {
        FETCH: 'loading',
      },
    },
  },
});

export function useGot<TResponseData = any>(
  url: string,
  gotOptions = undefined
) {
  const fetch = useCallback(() => {
    return got(url, {
      ...gotOptions,
      headers: {
        'user-agent': getUserAgent(),
      },
    }).json();
  }, [url, gotOptions]);
  const [state, dispatch] = useMachine<
    FetchMachineContext<TResponseData>,
    FetchMachineEvent
  >(fetchMachine, {
    services: {
      fetch,
    },
  });

  useEffect(() => {
    dispatch('FETCH');

    return () => {
      if (state.matches('loading')) {
        dispatch('CANCEL');
      }
    };
  }, [url, gotOptions]);

  return {
    data: state.matches('resolved') ? state.context.data : undefined,
    loading: state.matches('loading'),
    error: state.matches('rejected') ? state.context.error : undefined,
  };
}

export function useApi<TResponseData>(endpoint: string) {
  const url = `${config.developerModeApi}${endpoint}`;

  return useGot<TResponseData>(url);
}

function convertObjectToArray<T = any>(obj?: {
  [key: string]: T;
}): Merge<T, { key: string }>[] | undefined {
  if (typeof obj === 'undefined') {
    return undefined;
  }

  return Object.keys(obj).map<Merge<T, { key: string }>>((key) => {
    return {
      key,
      ...obj[key],
    };
  });
}

export function useDemos() {
  const apiResponse = useApi<DemosData>('/demos.json');
  const demosObject = apiResponse.data ? apiResponse.data.demos : undefined;
  const demos = convertObjectToArray(demosObject);
  return { ...apiResponse, demos };
}
