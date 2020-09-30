import format from 'date-fns/format';
import { AugmentedSession, Session } from '../types/session';
import { sortByDate } from './dateHelpers';

export function hasLiveTag(session: Session): boolean {
  return (session.tags || []).map((x) => x.name).includes('type:Live');
}

export function isLive(session: AugmentedSession): boolean {
  const isLive = session.isLiveSession;
  if (isLive) {
    return Date.now() < session.end_date;
  }
  return isLive;
}

export function getLevels(session: Session): string {
  if (!Array.isArray(session.tags)) {
    return '';
  }

  const levels = session.tags
    .map((x) => x.name)
    .filter((x) => x.startsWith('level:'))
    .map((x) => x.replace('level:', ''));
  return levels.join(',');
}

export function isPaid(session: Session): boolean {
  return (session.tags || [])
    .map((x) => x.name)
    .includes('access:Paid (All Access)');
}

export function isSignalTv(session: Session): boolean {
  return !!session.signalTv;
}
function augmentSession(session: Session): AugmentedSession {
  const live = hasLiveTag(session);
  const signalTv = isSignalTv(session);
  return {
    ...session,
    isLiveSession: live,
    canRegister: live,
    isSignalTv: signalTv,
  };
}
type GroupedSessions = {
  [key: string]: AugmentedSession[];
};
export function groupSessionsByTypeOrDate(
  sessions: Session[]
): GroupedSessions {
  const groupedSets: { [key: string]: Set<AugmentedSession> } = {};
  for (const baseSession of sessions) {
    const session = augmentSession(baseSession);
    if (!session.isLiveSession && !session.isSignalTv) {
      if (!groupedSets['On Demand']) {
        groupedSets['On Demand'] = new Set();
      }
      groupedSets['On Demand'].add(session);
      continue;
    }

    const startDate = format(new Date(session.start_date), 'yyyy-MM-dd');

    if (!groupedSets[startDate]) {
      groupedSets[startDate] = new Set();
    }

    groupedSets[startDate].add(session);
  }

  const grouped: GroupedSessions = {};
  for (const date of Object.keys(groupedSets)) {
    if (date === 'On Demand') {
      grouped[date] = [...groupedSets[date]].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    } else {
      grouped[date] = [...groupedSets[date]].sort(sortByDate);
    }
  }

  return grouped;
}
