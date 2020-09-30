import figures from 'figures';
import { Box, Text } from 'ink';
import React from 'react';

export function MoreItemsDown({ text = 'press down for more' }) {
  return (
    <Box alignSelf="center">
      <Text dimColor>
        {figures.arrowDown} {text} {figures.arrowDown}
      </Text>
    </Box>
  );
}
