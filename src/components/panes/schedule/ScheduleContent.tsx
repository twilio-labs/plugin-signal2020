import React from 'react';
import { AugmentedSession } from '../../../types/session';
import { ScrollableItemList } from '../../scrollable/ScrollableItemList';
import { SessionEntry } from './SessionEntry';

export type ScheduleContent = {
  sessions: AugmentedSession[];
  activeSessionIdx: number;
  registeredSessions?: Set<string>;
};
export function ScheduleContent({
  sessions,
  activeSessionIdx,
  registeredSessions = new Set(),
}: ScheduleContent) {
  const selectedId = (sessions[activeSessionIdx] || {}).id;

  return (
    <ScrollableItemList activeIdx={activeSessionIdx}>
      {sessions.map((s) => (
        <SessionEntry
          session={s}
          key={s.id}
          active={s.id === selectedId}
          registered={registeredSessions.has(s.id)}
        />
      ))}
    </ScrollableItemList>
  );
}
