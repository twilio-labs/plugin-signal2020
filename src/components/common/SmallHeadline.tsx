import { Box } from 'ink';
import React from 'react';
import { Divider } from './Divider';

export type SmallHeadlineProps = {
  text: string;
};
export function SmallHeadline({ text }: SmallHeadlineProps) {
  return (
    <Box padding={1}>
      <Box flexGrow={1}>
        <Divider title={text} />
      </Box>
    </Box>
  );
}
