import figures from 'figures';
import { Box, Text } from 'ink';
import React from 'react';
import { useTerminalInfo } from '../../hooks/useTerminalInfo';
import { Bold } from '../common/Bold';

export function ITermWarning() {
  const { isITerm, isTmux } = useTerminalInfo();

  if (!isITerm || (isITerm && isTmux)) {
    return null;
  }

  return (
    <Box width="100%" justifyContent="center" borderStyle="double">
      <Box flexDirection="column">
        <Box>
          <Text>
            <Bold color="cyan">{figures.info} Important</Bold>
          </Text>
        </Box>
        <Box>
          <Text wrap="wrap">
            You may experience flickering and other rendering issues when using
            this terminal. We will limit animations to improve your experience,
            but you may wish to use another app such as your system Terminal or
            Hyper. Alternatively, try using tmux.
          </Text>
        </Box>
        <Text>More Info: https://github.com/vadimdemedes/ink/issues/359</Text>
      </Box>
    </Box>
  );
}
