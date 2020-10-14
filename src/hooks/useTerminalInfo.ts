import execa from 'execa';
import isWsl from 'is-wsl';
import os from 'os';
import { useMemo } from 'react';
import { TerminalInfo } from '../types/terminalInfo';

function getTerminalName(shell: string, isWindows: boolean): string {
  if (process.env.TERM_PROGRAM) {
    let name = process.env.TERM_PROGRAM;
    if (process.env.TERM_PROGRAM_VERSION) {
      name = `${name} (${process.env.TERM_PROGRAM_VERSION})`;
    }
    return name;
  }

  if (process.env.WT_SESSION) {
    return 'Windows Terminal';
  }

  return isWindows ? shell : `Unknown (${shell})`;
}

function getShell(isWindows: boolean): string {
  if (!isWindows) {
    return isWsl ? 'wsl' : process.env.SHELL ? process.env.SHELL : 'unknown';
  } else {
    return 'windows';
  }
}

function isWindowsOs(): boolean {
  return os.type() === 'Windows_NT';
}

function isTmuxSession(): boolean {
  return typeof process.env.TMUX === 'string' && process.env.TMUX.length > 0;
}

function hasGitSupport(): boolean {
  try {
    const { failed } = execa.sync('git --version', { shell: true });
    return !failed;
  } catch (err) {
    return false;
  }
}

function hasMakeSupport(): boolean {
  try {
    const { failed } = execa.sync('make --version', { shell: true });
    return !failed;
  } catch (err) {
    return false;
  }
}

let _terminalInfo: TerminalInfo;

export function getTerminalInfo(): TerminalInfo {
  if (_terminalInfo) {
    return _terminalInfo;
  }

  const isWindows = isWindowsOs();
  const shell = getShell(isWindows);
  const terminalName = getTerminalName(shell, isWindows);
  const isITerm = terminalName.startsWith('iTerm.app');
  const isGitBash = terminalName === 'mintty' && isWindows;
  const hasGit = hasGitSupport();
  const isTmux = isTmuxSession();
  const hasMake = hasMakeSupport();

  _terminalInfo = {
    terminalName,
    shell,
    isITerm,
    isWindows,
    hasGit,
    isGitBash,
    isTmux,
    hasMake,
  };
  return _terminalInfo;
}

export function useTerminalInfo(): TerminalInfo {
  return useMemo(() => {
    return getTerminalInfo();
  }, []);
}
