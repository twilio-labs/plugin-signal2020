import figures from 'figures';
import { Box, Text } from 'ink';
import React from 'react';
import { AugmentedSession } from '../../../types/session';
import { ListSelector } from '../../common/ListSelector';
import { SessionTime } from './SessionTime';
import { SessionTags } from './tags/SessionTags';

export type SessionEntryProps = {
  session: AugmentedSession;
  active: boolean;
  registered?: boolean;
};

export function SessionEntry({
  session,
  active,
  registered,
}: SessionEntryProps) {
  return (
    <Box width="100%">
      <Box flexGrow={1} flexShrink={1}>
        <Box flexShrink={0}>
          <Text>
            <ListSelector active={active} />
            <SessionTime session={session} />
            {registered && <Text color="green">{figures.tick} </Text>}
          </Text>
        </Box>
        <Box flexGrow={1}>
          <Text wrap="truncate-end">{session.title}</Text>
        </Box>
        <Box marginLeft={2} flexShrink={0}>
          <SessionTags session={session} />
        </Box>
      </Box>
    </Box>
  );
}
