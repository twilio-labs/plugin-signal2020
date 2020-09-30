import { useMachine } from '@xstate/react';
import { useInput } from 'ink';
import React, { useEffect } from 'react';
import { Merge } from 'type-fest';
import { useTerminalInfo } from '../../hooks/useTerminalInfo';
import {
  demoEntryStateMachine,
  hasDownload,
  hasQuickDeploy,
  hasViewCode,
} from '../../machines/demoEntryMachine';
import { DemoEntryBox, DemoEntryBoxProps } from './DemoEntryBox';
import { DemoOptions } from './DemoOptions';

export type InteractiveDemoEntryProps = Merge<
  DemoEntryBoxProps,
  {
    initialActiveLanguageIdx?: number;
    active?: boolean;
    onSelect?: (option: string, languageIdx?: number) => any;
  }
>;
export function InteractiveDemoEntry({
  demo,
  initialActiveLanguageIdx = 0,
  active = true,
  onSelect,
  ...props
}: InteractiveDemoEntryProps) {
  const { hasGit } = useTerminalInfo();
  const [state, dispatch] = useMachine(demoEntryStateMachine, {
    context: {
      demo,
      hasGit,
      activeLanguageIdx: initialActiveLanguageIdx,
    },
  });

  useEffect(() => {
    if (state.context?.demo?.key !== demo.key) {
      dispatch({ type: 'RESET', data: demo });
    }
  }, [demo]);

  useInput(
    (input, key) => {
      if (key.tab) {
        if (key.shift) {
          dispatch('PREV_LANGUAGE');
          return;
        }
        dispatch('NEXT_LANGUAGE');
        return;
      }

      if (key.leftArrow) {
        dispatch('PREV_OPTION');
        return;
      }

      if (key.rightArrow) {
        dispatch('NEXT_OPTION');
        return;
      }

      if (key.return) {
        if (typeof onSelect === 'function') {
          onSelect(state.value.toString(), state.context.activeLanguageIdx);
        }
      }
    },
    {
      isActive: active,
    }
  );

  return (
    <DemoEntryBox
      demo={demo}
      activeLanguageIdx={state.context.activeLanguageIdx}
      {...props}
    >
      <DemoOptions
        hasQuickDeploy={hasQuickDeploy(state.context)}
        hasDownloadOption={hasDownload(state.context)}
        hasViewCodeOption={hasViewCode(state.context)}
        selectedOption={state.value.toString()}
      />
    </DemoEntryBox>
  );
}
