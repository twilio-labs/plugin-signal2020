import isCi from 'is-ci';
import { useResponsiveWindowSize } from './useResize';
import { useTerminalInfo } from './useTerminalInfo';

export function useAnimation() {
  const termInfo = useTerminalInfo();
  const { height } = useResponsiveWindowSize();
  let shouldAnimate = true;
  if (process.env.NODE_ENV === 'test') {
    shouldAnimate = false;
  } else if (isCi) {
    shouldAnimate = false;
  } else if (termInfo.isITerm || termInfo.isGitBash) {
    shouldAnimate = false;
  } else if (termInfo.isWindows && (height || 0) > 40) {
    shouldAnimate = false;
  } else if (termInfo.terminalName === 'Windows Terminal') {
    shouldAnimate = false;
  }

  if (process.env.FORCE_ANIMATION === '1') {
    shouldAnimate = true;
  } else if (process.env.FORCE_ANIMATION === '0') {
    shouldAnimate = false;
  }

  return { shouldAnimate };
}
