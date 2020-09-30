import { Text } from 'ink';
import React, { PropsWithChildren } from 'react';

export type CodeProps = PropsWithChildren<{}>;
export function Code({ children }: CodeProps) {
  return <Text color="redBright">{children}</Text>;
}
