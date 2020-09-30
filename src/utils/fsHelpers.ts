import fsFull from 'fs';

const fs = fsFull.promises;

export function exists(path: string): Promise<boolean> {
  return fs
    .access(path, fsFull.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}
