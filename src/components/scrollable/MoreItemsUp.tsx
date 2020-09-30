import figures from 'figures';
import { Box, Text } from 'ink';
import React from 'react';

export function MoreItemsUp({ text = 'press up for more' }) {
  return (
    <Box alignSelf="center">
      <Text dimColor>
        {figures.arrowUp} {text} {figures.arrowUp}
      </Text>
    </Box>
  );
}
