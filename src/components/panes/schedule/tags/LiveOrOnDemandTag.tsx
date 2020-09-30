import { Text } from 'ink';
import React from 'react';

export type LiveOrOnDemandTagProps = {
  live: boolean;
};
export function LiveOrOnDemandTag({ live }: LiveOrOnDemandTagProps) {
  const liveColor = live ? 'red' : 'green';
  const liveText = live ? 'Live' : 'On Demand';
  return (
    <Text backgroundColor={liveColor} color="whiteBright">
      [{liveText}]
    </Text>
  );
}
