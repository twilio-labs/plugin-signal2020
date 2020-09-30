export function nextIdxWithRollover(current: number, array: any[]): number {
  return (current + 1) % array.length;
}

export function prevIdxWithRollover(current: number, array: any[]): number {
  return (current + array.length - 1) % array.length;
}

export function nextIdxWithoutRollover(current: number, array: any[]): number {
  return Math.min(array.length - 1, current + 1);
}

export function prevIdxWithoutRollover(current: number): number {
  return Math.max(0, current - 1);
}
