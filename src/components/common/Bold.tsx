import { Text, TextProps } from 'ink';
import React, { PropsWithChildren } from 'react';

export type BoldProps = TextProps;
export function Bold({ children, ...props }: PropsWithChildren<BoldProps>) {
  return (
    <Text bold color="redBright" {...props}>
      {children}
    </Text>
  );
}
