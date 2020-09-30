import { useEffect, useState } from 'react';
import terminalImage from 'terminal-image';

function cropImageString(imageString: string) {
  return imageString
    .split('\n')
    .filter((line) => line.trim().length !== 0)
    .join('\n');
}

export function useImage(imageBuffer: Buffer | null, width: number) {
  const [imageString, setImageString] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const backup = process.env.TERM_PROGRAM;
      process.env.TERM_PROGRAM = 'INVALID';
      if (width <= 0 || imageBuffer === null) {
        return;
      }
      const newImageString = await terminalImage.buffer(imageBuffer, {
        width,
      });
      process.env.TERM_PROGRAM = backup;
      setImageString(cropImageString(newImageString));
    })();
  }, [imageBuffer, width]);

  return imageString;
}
