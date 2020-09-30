import { useEffect, useState } from 'react';
import { useAnimation } from '../../hooks/useAnimation';

export type AnimationProps = {
  frames: string[];
  intervalSpeed: number;
  onDone?: () => any;
  children: (frame: string) => JSX.Element;
};
export const Animation = ({
  frames,
  intervalSpeed,
  onDone,
  children,
}: AnimationProps) => {
  const { shouldAnimate } = useAnimation();

  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isDone, setIsDone] = useState(!shouldAnimate);

  useEffect(() => {
    if (currentFrameIdx === frames.length) {
      setIsDone(true);
    }
  }, [currentFrameIdx]);

  useEffect(() => {
    if (isDone) {
      if (typeof onDone === 'function') {
        onDone();
      }
    }
  }, []);

  useEffect(() => {
    if (isDone) {
      if (typeof onDone === 'function') {
        onDone();
      }
    }
  }, [isDone]);

  useEffect(() => {
    let intervalTimer: NodeJS.Timeout | undefined = undefined;

    if (typeof intervalTimer !== 'undefined') {
      clearInterval(intervalTimer);
    }

    if (!shouldAnimate) {
      setIsDone(true);
      return;
    }

    intervalTimer = setInterval(() => {
      setCurrentFrameIdx((currentIdx) => {
        const result = currentIdx + 1;
        if (currentIdx === frames.length) {
          if (intervalTimer) {
            clearInterval(intervalTimer);
          }
        }
        return result;
      });
    }, intervalSpeed);
    return () => {
      if (intervalTimer) {
        clearInterval(intervalTimer);
      }
    };
  }, [intervalSpeed, frames, shouldAnimate]);

  if (isDone) {
    const lastFrame = frames[frames.length - 1];
    return children(lastFrame);
  }

  return children(frames[currentFrameIdx]);
};
