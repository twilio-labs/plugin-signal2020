import { Box, BoxProps } from 'ink';
import React, { PropsWithChildren } from 'react';
import { Merge } from 'type-fest';
import { useBreakpointForWindow } from '../../hooks/useResize';
import Breakpoints from '../../utils/breakpoints';
import { Headline } from '../common/Headline';

export type PaneProps = Merge<
  BoxProps,
  {
    headline: string;
  }
>;
export const Pane = ({
  headline,
  children,
  ...props
}: PropsWithChildren<PaneProps>) => {
  const { shouldRender, width, height } = useBreakpointForWindow(
    Breakpoints.SHOW_REGULAR_HEADLINE
  );
  let headlineElement = null;
  if (headline) {
    headlineElement = (
      <Box justifyContent="center">
        <Headline
          text={headline}
          shouldRenderLargeHeadline={shouldRender}
          windowWidth={width}
          windowHeight={height}
        />
      </Box>
    );
  }
  return (
    <Box flexDirection="column" flexGrow={1} {...props}>
      {headlineElement}
      {children}
    </Box>
  );
};

export * from './PaneContent';
