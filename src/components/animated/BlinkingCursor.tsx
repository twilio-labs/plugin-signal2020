import React, { useEffect, useState } from 'react';
import { Merge } from 'type-fest';
import { useAnimation } from '../../hooks/useAnimation';
import { Cursor, CursorProps } from '../common/Cursor';

export type BlinkingCursorProps = Merge<
  CursorProps,
  {
    speed?: number;
  }
>;
export const BlinkingCursor = ({
  speed = 1000,
  ...props
}: BlinkingCursorProps) => {
  const { shouldAnimate } = useAnimation();

  const [showBlock, toggleBlock] = useState(false);
  useEffect(() => {
    const intervalTimer = setInterval(() => {
      toggleBlock((current) => !current);
    }, speed);

    return () => {
      if (intervalTimer) {
        clearInterval(intervalTimer);
      }
    };
  }, [speed]);

  if (!shouldAnimate) {
    return null;
  }

  return <Cursor active={showBlock} {...props} />;
};
