import { Text, TextProps } from 'ink';
import React from 'react';
import { Merge } from 'type-fest';
import { Bold } from './Bold';

export type KeyProps = Merge<
  TextProps,
  {
    bold?: boolean;
  }
>;
export function Key({ children, bold = true, ...props }: KeyProps) {
  const Component = bold ? Bold : Text;
  return (
    <Text>
      <Text dimColor>&lt;</Text>
      <Component color="redBright" {...props}>
        {children}
      </Component>
      <Text dimColor>&gt;</Text>
    </Text>
  );
}
