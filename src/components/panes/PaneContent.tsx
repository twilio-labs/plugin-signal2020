import { Box, BoxProps, Text } from 'ink';
import React, { PropsWithChildren } from 'react';
import { Merge } from 'type-fest';
import { useBreakpointForElement } from '../../hooks/useResize';
import { Breakpoint } from '../../utils/breakpoints';
import { Key } from '../common/Key';

const fallbackTooSmall = (
  <Text>
    Your terminal is too small to support the best experience of Developer Mode.
    Try hiding the sidebar using <Key>b</Key> or increase the size of your
    terminal until this message disappears.
  </Text>
);

export type PaneContentProps = PropsWithChildren<
  Merge<
    BoxProps,
    {
      breakpoint?: Partial<Breakpoint>;
      fallback?: JSX.Element;
    }
  >
>;

export function PaneContent({
  children,
  breakpoint = {},
  fallback = undefined,
  ...props
}: PaneContentProps) {
  const { ref, shouldRender } = useBreakpointForElement(breakpoint);
  return (
    <Box
      ref={ref}
      flexDirection="column"
      flexGrow={1}
      paddingLeft={2}
      paddingRight={2}
      {...props}
    >
      <Box
        flexDirection="column"
        flexGrow={1}
        display={shouldRender ? 'flex' : 'none'}
      >
        {children}
      </Box>
      {!shouldRender ? fallback || fallbackTooSmall : null}
    </Box>
  );
}
