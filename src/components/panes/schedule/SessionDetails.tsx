import { commaListsAnd } from 'common-tags';
import figures from 'figures';
import { Box, Spacer, Text } from 'ink';
import React from 'react';
import { AugmentedSession } from '../../../types/session';
import { getLevels } from '../../../utils/scheduleUtils';
import { Bold } from '../../common/Bold';
import { Inverse } from '../../common/Inverse';
import { Key } from '../../common/Key';

export type SessionDetailsProps = {
  session: AugmentedSession;
  registered: boolean;
  updating?: { id: string; type: 'registering' | 'unregistering' };
};
export function SessionDetails({
  session,
  registered,
  updating,
}: SessionDetailsProps) {
  if (!session) {
    return null;
  }

  const showDescription = !!session.description;
  const formattedDescription = session.description
    ?.split('\n')
    .join(' ')
    .split('\r')
    .join('');
  const levels = getLevels(session);

  return (
    <Box
      padding={1}
      flexDirection="column"
      borderStyle="single"
      flexShrink={1}
      flexGrow={1}
    >
      <Box>
        <Box marginRight={2}>
          <Bold wrap="truncate-end">{session.title} </Bold>
        </Box>
        <Spacer />
        <Box>
          {levels.length > 0 && (
            <Inverse wrap="truncate-middle">Level {levels}</Inverse>
          )}
        </Box>
      </Box>
      <Box>
        {Array.isArray(session.speakers) && session.speakers.length > 0 && (
          <Text wrap="truncate-end">{commaListsAnd`Speakers: ${session.speakers.map(
            (x) => x.name
          )}`}</Text>
        )}
      </Box>
      <Box>
        {showDescription && (
          <Text wrap="truncate-end">{formattedDescription}</Text>
        )}
      </Box>
      <Box>
        {updating && updating.type && (
          <Text color="yellow">{updating.type}</Text>
        )}
        {!updating && registered ? (
          <Text color="green">{figures.tick} registered</Text>
        ) : null}
      </Box>
      <Spacer />
      <Box justifyContent="space-around">
        {session.canRegister && (
          <Text>
            Press <Key>Space</Key> to {registered ? 'unregister' : 'register'}.
          </Text>
        )}
        <Text>
          Press <Key>Enter</Key> to open session in browser.
        </Text>
      </Box>
    </Box>
  );
}
