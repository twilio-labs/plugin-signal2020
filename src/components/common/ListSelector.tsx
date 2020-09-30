import figures from 'figures';
import { Text, TextProps } from 'ink';
import React from 'react';
import { Merge } from 'type-fest';

export type ListSelectorProps = Merge<
  TextProps,
  {
    active?: boolean;
  }
>;
export function ListSelector({ active = false, ...props }: ListSelectorProps) {
  const character = active ? figures.pointer : ' ';
  return (
    <Text color="redBright" {...props}>
      {character}{' '}
    </Text>
  );
}
