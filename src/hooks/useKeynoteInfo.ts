import got from 'got';
import { useEffect } from 'react';
import {
  EffectFunction,
  EffectReducer,
  useEffectReducer,
} from 'use-effect-reducer';
import { InspectorApi } from '../types/inspector';
import config from '../utils/config';
import { getUserAgent } from '../utils/diagnostics';

export type KeynoteInfo =
  | {
      status: 'idle';
      data: undefined;
      vttFileContent: undefined;
      error: undefined;
    }
  | {
      status: 'loading-inspector-data';
      data: undefined;
      vttFileContent: undefined;
      error: undefined;
    }
  | {
      status: 'loading-vtt';
      data: InspectorApi;
      vttFileContent: undefined;
      error: null;
    }
  | {
      status: 'success';
      data: InspectorApi;
      vttFileContent: string;
      error: null;
    }
  | {
      status: 'error';
      data: undefined;
      vttFileContent: undefined;
      error: Error;
    };

type KeynoteInfoEvent =
  | { type: 'FETCH' }
  | { type: 'RECEIVED_INFO'; data: InspectorApi }
  | { type: 'RECEIVED_VTT'; data: string }
  | { type: 'ERROR'; error: Error };

type KeynoteInfoEffect =
  | { type: 'fetchInspectorApi' }
  | { type: 'fetchVttInfo' };

const keynoteInfoEffectReducer: EffectReducer<
  KeynoteInfo,
  KeynoteInfoEvent,
  KeynoteInfoEffect
> = (state, event, exec) => {
  if (event.type === 'FETCH') {
    exec({ type: 'fetchInspectorApi' });
    return {
      status: 'loading-inspector-data',
      data: undefined,
      error: undefined,
      vttFileContent: undefined,
    };
  } else if (
    event.type === 'RECEIVED_INFO' &&
    state.status === 'loading-inspector-data'
  ) {
    exec({ type: 'fetchVttInfo' });
    return {
      status: 'loading-vtt',
      data: event.data,
      error: null,
      vttFileContent: undefined,
    };
  } else if (event.type === 'RECEIVED_VTT' && state.status === 'loading-vtt') {
    return {
      status: 'success',
      data: state.data,
      error: null,
      vttFileContent: event.data,
    };
  } else if (event.type === 'ERROR') {
    return {
      status: 'error',
      data: undefined,
      error: event.error,
      vttFileContent: undefined,
    };
  }

  return state;
};

const fetchInspectorApi: EffectFunction<
  KeynoteInfo,
  KeynoteInfoEvent,
  KeynoteInfoEffect
> = (state, effect, dispatch) => {
  got(`${config.developerModeApi}/inspector`, {
    headers: {
      'user-agent': getUserAgent(),
    },
  })
    .json<InspectorApi>()
    .then((data) => dispatch({ type: 'RECEIVED_INFO', data }))
    .catch((err) => dispatch({ type: 'ERROR', error: err }));
};

const fetchVttInfo: EffectFunction<
  KeynoteInfo,
  KeynoteInfoEvent,
  KeynoteInfoEffect
> = (state, effect, dispatch) => {
  if (state.data) {
    got(state.data.xray.closedCaptions, {
      headers: {
        'user-agent': getUserAgent(),
      },
    })
      .text()
      .then((data) => {
        dispatch({ type: 'RECEIVED_VTT', data: data });
      })
      .catch((err) => {
        dispatch({ type: 'ERROR', error: err });
      });
  } else {
    dispatch({ type: 'ERROR', error: new Error('Something went wrong') });
  }
};

export function useKeynoteInfo(): KeynoteInfo {
  const [state, dispatch] = useEffectReducer(
    keynoteInfoEffectReducer,
    {
      status: 'idle',
      data: undefined,
      vttFileContent: undefined,
      error: undefined,
    },
    {
      fetchInspectorApi: fetchInspectorApi,
      fetchVttInfo: fetchVttInfo,
    }
  );

  useEffect(() => {
    dispatch({ type: 'FETCH' });
  }, []);

  return { ...state };
}
