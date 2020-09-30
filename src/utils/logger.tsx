import { LoggingLevel } from '@twilio/cli-core/src/services/messaging/logging';
import fs from 'fs';
import isWsl from 'is-wsl';
import os from 'os';
import path from 'path';
import pino from 'pino';

export const loggerPath = path.join(os.tmpdir(), 'twilio-signal-dev-mode.log');

// clearing the logs from a previous execution on load.
if (!process.env.SIGNAL_PRESERVE_LOGS) {
  try {
    fs.unlinkSync(loggerPath);
  } catch (err) {
    // no such file
  }
}

export var logger: pino.Logger;
logger = pino(
  {
    base: null,
  },
  pino.destination({ dest: loggerPath, sync: isWsl ? true : false })
);

setInterval(function () {
  logger.flush();
}, 10000).unref();

export function cliLogLevelToPinoLogLevel(logLevel: number): string {
  switch (logLevel) {
    case LoggingLevel.debug:
      return 'debug';
    case LoggingLevel.info:
      return 'info';
    case LoggingLevel.warn:
      return 'warn';
    case LoggingLevel.error:
      return 'error';
    default:
      return 'info';
  }
}

export const pinoFinalHandler = pino.final(
  logger,
  (err, finalLogger, evt, noExit = false) => {
    finalLogger.info(`${evt} caught`);
    if (err) finalLogger.error(err, 'error caused exit');
    if (!noExit) process.exit(err ? 1 : 0);
  }
);

export default logger;
