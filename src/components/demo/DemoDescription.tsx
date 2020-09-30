import { Text } from 'ink';
import React, { PropsWithChildren } from 'react';

export type DemoDescriptionProps = PropsWithChildren<{}>;
export function DemoDescription({ children }: DemoDescriptionProps) {
  return <Text wrap="truncate-end">{children}</Text>;
}
