import isCi from 'is-ci';
import { getTerminalInfo } from '../hooks/useTerminalInfo';
import { loggerPath } from './logger';

type Diagnostics = {
  pluginVersion: string;
  twilioCliVersion: string;
  terminal: string;
  shell: string;
  nodeVersion: string;
  resolution: string;
  ci: boolean;
  hasGit: boolean;
  interactive: boolean;
  logFilePath: string;
};

let _diagnostics: Diagnostics | null;

export function computeDiagnostics(cli) {
  /// @ts-ignore
  const pkgJson = require('../../package.json');
  const terminalInfo = getTerminalInfo();

  _diagnostics = {
    pluginVersion: pkgJson.version,
    twilioCliVersion: cli.config.userAgent,
    terminal: terminalInfo.terminalName,
    shell: terminalInfo.shell + (terminalInfo.isTmux ? ' tmux' : ''),
    nodeVersion: process.versions.node,
    resolution: `${process.stdout.columns}x${process.stdout.rows}`,
    interactive: process.stdout.isTTY,
    ci: isCi,
    hasGit: terminalInfo.hasGit,
    logFilePath: loggerPath,
  };

  return _diagnostics;
}

export function getDiagnostics() {
  return _diagnostics;
}

export function getUserAgent() {
  if (!_diagnostics || Boolean(process.env.SIGNAL_NO_DIAGNOSTICS)) {
    return `plugin-signal2020`;
  }

  return `plugin-signal2020/${_diagnostics.pluginVersion} ${_diagnostics.twilioCliVersion}`;
}
