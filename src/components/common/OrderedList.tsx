import { Text } from 'ink';
import React, { PropsWithChildren } from 'react';
import { Color } from '../../types/text';

export type OrderedListProps = PropsWithChildren<{
  listIndicatorColor?: Color;
  symbol?: string;
}>;
export function OrderedList({
  symbol = undefined,
  children = undefined,
  listIndicatorColor = undefined,
}: OrderedListProps) {
  return (
    <Text>
      {React.Children.map(children, (child, idx) => {
        const listSymbol =
          typeof symbol === 'undefined' ? `${idx + 1}.` : symbol;
        return (
          <Text>
            <Text color={listIndicatorColor || 'redBright'}>{listSymbol} </Text>
            {child}
          </Text>
        );
      })}
    </Text>
  );
}
