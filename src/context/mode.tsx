import { useMachine } from '@xstate/react';
import React from 'react';
import { Interpreter, State } from 'xstate';
import { useLogValueChange } from '../hooks/useLogValueChange';
import {
  modeMachine,
  ModeMachineContext,
  ModeMachineEvent,
  ModeMachineSchema,
} from '../machines/modeMachine';

type ModeContextType = {
  state: State<ModeMachineContext, ModeMachineEvent>;
  dispatch: Interpreter<
    ModeMachineContext,
    ModeMachineSchema,
    ModeMachineEvent
  >['send'];
};

const ModeContext = React.createContext(({} as unknown) as ModeContextType);

export const useMode = () => React.useContext(ModeContext);

export const ModeProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useMachine(modeMachine);
  useLogValueChange('mode', state.value);

  return (
    <ModeContext.Provider value={{ state, dispatch }}>
      {children}
    </ModeContext.Provider>
  );
};
