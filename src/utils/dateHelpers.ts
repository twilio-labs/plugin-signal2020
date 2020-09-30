import ms from 'ms';
import { Session } from '../types/session';

export function sortByDate(a: Session, b: Session): number {
  const timeSorted = a.start_date - b.start_date;
  if (timeSorted === 0) {
    return a.title.localeCompare(b.title);
  }
  return timeSorted;
}

export function timeToText(time: number): string {
  let rest = time;
  const hours = Math.floor(rest / ms('1h'));
  rest = rest % ms('1h');
  const minutes = Math.floor(rest / ms('1m'));
  rest = rest % ms('1m');
  const seconds = Math.floor(rest / 1000);
  return `${hours}:${minutes > 9 ? '' : '0'}${minutes}:${
    seconds > 9 ? '' : '0'
  }${seconds}`;
}
