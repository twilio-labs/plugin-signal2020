import { Box, Text } from 'ink';
import React from 'react';

export type ResultOutputProps = {
  result: { output?: string[] };
};

export function ResultOutput({ result }: ResultOutputProps) {
  return (
    <Box>
      <Text dimColor>{(result.output || []).join('\n')}</Text>
    </Box>
  );
}
