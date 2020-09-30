import { Box, Text } from 'ink';
import React from 'react';
import { useVersionCheck } from '../../hooks/useVersionCheck';
import { Code } from '../common/Code';
import { Info } from '../common/Info';

export function UpdateNotice() {
  return (
    <Box flexDirection="column">
      <Info text="New Version" />
      <Text>
        Please exit, run <Code>twilio plugins:update</Code> and restart
        Developer Mode with <Code>twilio signal2020</Code>.
      </Text>
    </Box>
  );
}

export function CheckUpdateAvailable() {
  const versionInfo = useVersionCheck();
  return versionInfo.updateAvailable ? <UpdateNotice /> : null;
}
