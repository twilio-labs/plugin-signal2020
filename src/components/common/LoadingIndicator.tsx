import { Text } from 'ink';
import Spinner from 'ink-spinner';
import React from 'react';
import { useAnimation } from '../../hooks/useAnimation';
import { useTerminalInfo } from '../../hooks/useTerminalInfo';

export type LoadingIndicatorProps = {
  text: string;
};
export function LoadingIndicator({ text }: LoadingIndicatorProps) {
  const { shouldAnimate } = useAnimation();
  const { isWindows } = useTerminalInfo();
  const spinnerType = isWindows ? 'line' : 'dots';
  return (
    <Text>
      <Text color="green">
        {shouldAnimate && (
          <>
            <Spinner type={spinnerType} />{' '}
          </>
        )}
      </Text>
      {text}
    </Text>
  );
}
