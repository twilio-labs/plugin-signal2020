import { Box } from 'ink';
import React from 'react';
import { Bold } from '../common/Bold';
import { Button } from '../common/Button';

export type OpenProjectBoxProps = {
  slim?: boolean;
  onOpen?: () => void;
};

export function OpenProjectBox({ slim = false, onOpen }: OpenProjectBoxProps) {
  const paddingTopBottom = slim ? 0 : 1;
  return (
    <Box
      borderStyle="bold"
      paddingLeft={1}
      paddingRight={1}
      paddingY={paddingTopBottom}
      flexGrow={0}
      flexShrink={0}
      flexDirection="row"
      justifyContent="space-between"
    >
      <Button autoFocus onAction={onOpen}>
        Open Project
      </Button>
      <Bold>We can't wait to see what you build!</Bold>
    </Box>
  );
}
