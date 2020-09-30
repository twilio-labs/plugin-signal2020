import { Key, useApp, useInput } from 'ink';
import { useEffect, useState } from 'react';
import { ValueOf } from 'type-fest';
import { useMode } from '../context/mode';
import { ModeEvents } from '../machines/modeMachine';

const hotKeyMap: { [key: string]: ValueOf<typeof ModeEvents> } = {
  c: ModeEvents.showClosedCaptioning,
  k: ModeEvents.showClosedCaptioning,
  s: ModeEvents.showSchedule,
  q: ModeEvents.exit,
  r: ModeEvents.showResources,
  d: ModeEvents.showDemos,
  // t: ModeEvents.showTest,
  w: ModeEvents.showWelcome,
  b: ModeEvents.toggleSideBar,
  ['?']: ModeEvents.toggleSideBar,
};

const UP = 'U';
const DOWN = 'D';
const LEFT = 'L';
const RIGHT = 'R';
const SEQUENCE = [UP, UP, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT, 'B', 'A'].join(
  ''
);

function getKey(input: string, key: Key) {
  if (key.upArrow) {
    return UP;
  } else if (key.downArrow) {
    return DOWN;
  } else if (key.leftArrow) {
    return LEFT;
  } else if (key.rightArrow) {
    return RIGHT;
  }
  if (input.toUpperCase() === 'A' || input.toUpperCase() === 'B') {
    return input.toUpperCase();
  }
  return null;
}

export function ModeSwitcher() {
  const { exit } = useApp();
  const { state, dispatch } = useMode();
  const [currentCodeInput, setCurrentCodeInput] = useState('');

  useInput((input, key) => {
    const currentKey = getKey(input, key);
    const nextValidKey = SEQUENCE[currentCodeInput.length];
    if (
      SEQUENCE.startsWith(currentCodeInput) &&
      currentKey !== null &&
      nextValidKey === currentKey
    ) {
      const newCurrentCode = `${currentCodeInput}${currentKey}`;
      if (SEQUENCE === newCurrentCode) {
        dispatch({ type: ModeEvents.showCheatMode });
        return;
      } else {
        setCurrentCodeInput(newCurrentCode);
        if (newCurrentCode.endsWith('B')) {
          // don't toggle the sidebar
          return;
        }
      }
    } else {
      setCurrentCodeInput('');
    }

    if (state.matches('captureInput.on')) {
      if (hotKeyMap[input]) {
        dispatch({ type: hotKeyMap[input] });
      }
    }
  });

  useEffect(() => {
    if (state.matches('mainPane.exit')) {
      exit();
    }
  }, [state.value]);

  return null;
}
