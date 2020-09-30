// this is largely useful for debugging.
// it shouldn't be used in production

import fs, { WriteStream } from 'fs';
import { EOL } from 'os';

let writeStream: WriteStream | undefined;

export function debug(msg: string) {
  if (typeof writeStream === 'undefined') {
    writeStream = fs.createWriteStream(
      process.cwd() + '/signal-dev-mode-debug.log'
    );
  }

  writeStream.write(msg + EOL);
}
