import { Text } from 'ink';
import React, { useCallback, useMemo, useState } from 'react';
import { Except, Merge } from 'type-fest';
import { Color } from '../../types/text';
import { Cursor } from '../common/Cursor';
import { Animation, AnimationProps } from './Animation';
import { BlinkingCursor } from './BlinkingCursor';

export function getTextFrames(text: string): string[] {
  const frames = [];
  for (let currentLength = 0; currentLength <= text.length; currentLength++) {
    frames.push(text.substr(0, currentLength));
  }
  return frames;
}

type LimitedAnimationProps = Except<
  AnimationProps,
  'frames' | 'intervalSpeed' | 'onDone' | 'children'
>;
export type TypeTextProps = Merge<
  LimitedAnimationProps,
  {
    text: string;
    cursorColor?: Color;
    showCursor?: boolean | 'blinking';
    TextComponent?: typeof Text;
    intervalSpeed?: number;
    onDone?: () => any;
  }
>;
export const TypeText = ({
  text,
  cursorColor = undefined,
  showCursor = undefined,
  TextComponent = Text,
  intervalSpeed = 50,
  onDone = undefined,
  ...props
}: TypeTextProps) => {
  if (typeof text !== 'string') {
    throw new Error('only excepts a string as text');
  }

  const [animationDone, setAnimationDone] = useState(false);
  const frames = useMemo(() => getTextFrames(text), [text]);

  const animationCallback = useCallback(() => {
    setAnimationDone(true);
    if (typeof onDone === 'function') {
      onDone();
    }
  }, [onDone]);

  let cursor = showCursor ? (
    <Cursor color={cursorColor} active={!animationDone} />
  ) : (
    ''
  );
  if (showCursor === 'blinking' && animationDone) {
    cursor = <BlinkingCursor color={cursorColor} />;
  }

  return (
    <Animation
      {...props}
      frames={frames}
      onDone={animationCallback}
      intervalSpeed={intervalSpeed}
    >
      {(frame) => (
        <TextComponent>
          {frame}
          {cursor}
        </TextComponent>
      )}
    </Animation>
  );
};
