import { Newline, Text } from 'ink';
import React, { PropsWithChildren } from 'react';

export type ListItemProps = PropsWithChildren<{}>;
export function ListItem({ children }: ListItemProps) {
  return (
    <Text>
      {children}
      <Newline />
    </Text>
  );
}
