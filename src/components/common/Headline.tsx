import CFonts from 'cfonts';
import { Text } from 'ink';
import React, { useMemo } from 'react';
import { SmallHeadline } from './SmallHeadline';

function renderBigHeadline(
  text: string,
  size?: { width: number; height: number }
) {
  return CFonts.render(
    text,
    {
      maxLength: size.width,
    },
    false,
    2,
    {
      width: size.width,
      height: size.height,
    }
  ).string;
}

export type HeadlinePops = {
  text: string;
  shouldRenderLargeHeadline?: boolean;
  windowWidth?: number;
  windowHeight?: number;
};

export function Headline({
  text,
  shouldRenderLargeHeadline = true,
  windowWidth,
  windowHeight,
}: HeadlinePops) {
  const size =
    windowWidth && windowHeight
      ? { width: windowWidth, height: windowHeight }
      : undefined;
  const headline = useMemo(() => renderBigHeadline(text, size), [
    text,
    windowWidth,
    windowHeight,
  ]);

  if (!shouldRenderLargeHeadline) {
    return <SmallHeadline text={text} />;
  }
  return <Text>{headline}</Text>;
}
