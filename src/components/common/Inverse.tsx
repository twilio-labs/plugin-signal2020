import { Text } from 'ink';
import React from 'react';

export type InverseProps = React.ComponentProps<typeof Text>;
export function Inverse({
  children,
  dimColor = false,
  ...props
}: InverseProps) {
  return (
    <Text
      backgroundColor={dimColor ? 'gray' : 'red'}
      color={dimColor ? 'black' : 'whiteBright'}
      {...props}
    >
      <Text> </Text>
      {children}
      <Text> </Text>
    </Text>
  );
}
