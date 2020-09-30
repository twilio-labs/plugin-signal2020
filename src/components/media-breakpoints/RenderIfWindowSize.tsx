import { Box } from 'ink';
import React, { PropsWithChildren } from 'react';
import { Merge } from 'type-fest';
import {
  shouldRenderBasedOnBreakpoint,
  useResponsiveWindowSize,
} from '../../hooks/useResize';
import { Breakpoint } from '../../utils/breakpoints';

export type RenderIfWindowSizeProps = Merge<
  Breakpoint,
  {
    fallback?: JSX.Element | null;
  }
>;
export function RenderIfWindowSize({
  children,
  fallback = null,
  ...breakpoint
}: PropsWithChildren<RenderIfWindowSizeProps>) {
  const { width: totalWidth, height: totalHeight } = useResponsiveWindowSize();
  const shouldRender = shouldRenderBasedOnBreakpoint(
    breakpoint,
    totalWidth || 0,
    totalHeight || 0
  );

  return (
    <>
      <Box display={shouldRender ? 'flex' : 'none'}>{children}</Box>
      {!shouldRender && fallback ? fallback : null}
    </>
  );
}
