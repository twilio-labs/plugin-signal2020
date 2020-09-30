import { Text, TextProps } from 'ink';
import React, { PropsWithChildren } from 'react';
import { Merge } from 'type-fest';
import { Inverse, InverseProps } from './Inverse';

export type SelectableProps = PropsWithChildren<
  Merge<
    InverseProps | TextProps,
    {
      active?: boolean;
    }
  >
>;
export function Selectable({
  children,
  active = false,
  ...props
}: SelectableProps) {
  const Component = active ? Inverse : Text;
  return <Component {...props}>{children}</Component>;
}
