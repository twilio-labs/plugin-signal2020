import { useInput } from 'ink';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  nextIdxWithoutRollover,
  prevIdxWithoutRollover,
} from '../utils/arrayHelpers';

export function useScrollableList(
  initialIdx: number,
  list: any[],
  active = true
): [number, Dispatch<SetStateAction<number>>] {
  const [currentIdx, setCurrentIdx] = useState(initialIdx);
  useInput(
    (input, key) => {
      if (key.upArrow) {
        setCurrentIdx((idx) => prevIdxWithoutRollover(idx));
      } else if (key.downArrow) {
        setCurrentIdx((idx) => nextIdxWithoutRollover(idx, list));
      }
    },
    {
      isActive: active,
    }
  );
  return [currentIdx, setCurrentIdx];
}
