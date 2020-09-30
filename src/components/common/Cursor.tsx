import { Text } from 'ink';
import React from 'react';
import { Color } from '../../types/text';

export type CursorProps = {
  color?: Color;
  active?: boolean;
};
export function Cursor({ color = 'redBright', active = true }: CursorProps) {
  // using an empty space with background coloring because it renders more consistently than special characters
  return <Text backgroundColor={active ? color : undefined}> </Text>;
}
