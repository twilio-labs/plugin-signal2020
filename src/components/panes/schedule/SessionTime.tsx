import format from 'date-fns/format';
import { Text } from 'ink';
import React from 'react';
import { AugmentedSession } from '../../../types/session';
import { hasLiveTag, isSignalTv } from '../../../utils/scheduleUtils';

export type SessionTimeProps = {
  session: AugmentedSession;
};
export function SessionTime({ session }: SessionTimeProps) {
  const isLive = hasLiveTag(session);
  const signalTv = isSignalTv(session);
  if (!isLive && !signalTv) {
    return null;
  }

  const startTime = format(new Date(session.start_date), 'HH:mm');
  const endTime = format(new Date(session.end_date), 'HH:mm');

  return (
    <>
      {startTime} <Text dimColor>- {endTime}</Text>
      {' │ '}
    </>
  );
}
