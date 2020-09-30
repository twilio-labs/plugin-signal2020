import { Box, Text } from 'ink';
import React from 'react';
import { Bold } from '../common/Bold';

export type InstallationProcessProps = {
  directory: string;
};

export function InstallationSummary({ directory }: InstallationProcessProps) {
  return (
    <Box flexDirection="column">
      <Text>
        Your new project has been created at: <Bold>{directory}</Bold>. Open the
        README.md file for further instructions.
      </Text>
    </Box>
  );
}
