import { Text } from 'ink';
import React from 'react';
import { AugmentedSession } from '../../../../types/session';
import { isLive, isPaid, isSignalTv } from '../../../../utils/scheduleUtils';
import { LiveOrOnDemandTag } from './LiveOrOnDemandTag';
import { PaidTag } from './PaidTag';
import { SignalTvTag } from './SignalTvTag';

export type SessionTags = {
  session: AugmentedSession;
};
export function SessionTags({ session }: SessionTags) {
  const live = isLive(session);
  const paid = isPaid(session);
  const signalTv = isSignalTv(session);

  return (
    <Text>
      {paid && <PaidTag />}
      {!signalTv && <LiveOrOnDemandTag live={live} />}
      {signalTv && <SignalTvTag />}
    </Text>
  );
}
