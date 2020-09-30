import { useFocus, useInput } from 'ink';
import React from 'react';
import { Merge } from 'type-fest';
import { Selectable, SelectableProps } from './Selectable';

export type ButtonProps = Merge<
  SelectableProps,
  {
    focusable?: boolean;
    autoFocus?: boolean;
    onAction?: () => void;
  }
>;
export function Button({
  children,
  focusable = true,
  autoFocus = true,
  onAction,
  ...props
}: ButtonProps) {
  const { isFocused } = useFocus({ isActive: focusable, autoFocus });
  useInput(
    (_, key) => {
      if (key.return && isFocused) {
        if (typeof onAction === 'function') {
          onAction();
        }
      }
    },
    {
      isActive: isFocused,
    }
  );
  return (
    <Selectable active={isFocused} {...props}>
      {children}
    </Selectable>
  );
}
