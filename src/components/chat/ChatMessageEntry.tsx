import figures from 'figures';
import { Box, Text } from 'ink';
import React from 'react';

export type ChatMessageEntryProps = {
  author: string | null;
  content: string | JSX.Element;
  active?: boolean;
};
export function ChatMessageEntry({
  author,
  content,
  active,
}: ChatMessageEntryProps) {
  return (
    <Box marginLeft={1}>
      {!!author && (
        <Box marginRight={1}>
          <Text bold>
            {author}{' '}
            <Text color={active ? 'redBright' : undefined}>
              {figures.pointer}
            </Text>
          </Text>
        </Box>
      )}
      <Text wrap="truncate-end">{content}</Text>
    </Box>
  );
}
