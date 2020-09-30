import { Box, Text } from 'ink';
import React, { PropsWithChildren, useRef } from 'react';

export function ScrollText({ children }: PropsWithChildren<{}>) {
  const ref = useRef();

  return (
    <Box flexGrow={1} ref={ref}>
      <Text>{children}</Text>
    </Box>
  );
}
