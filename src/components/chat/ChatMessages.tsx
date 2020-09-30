import { Box } from 'ink';
import React, { useEffect } from 'react';
import { Merge } from 'type-fest';
import { useScrollableList } from '../../hooks/useScrollableList';
import { ChatMessage } from '../../types/chatMessages';
import {
  ScrollableItemList,
  ScrollableItemListProps,
} from '../scrollable/ScrollableItemList';
import { ChatMessageEntry } from './ChatMessageEntry';

export type ChatMessagesProps = Merge<
  ScrollableItemListProps,
  {
    messages: ChatMessage[];
  }
>;
export function ChatMessages({ messages, ...props }: ChatMessagesProps) {
  const [activeChatIdx, setCurrentIdx] = useScrollableList(
    Math.max(0, messages.length - 1),
    messages
  );
  const activeId = messages[activeChatIdx]?.id;

  useEffect(() => {
    setCurrentIdx(Math.max(0, messages.length - 1));
  }, [messages.length]);

  return (
    <Box width="100%" flexGrow={1}>
      <ScrollableItemList width="100%" activeIdx={activeChatIdx} {...props}>
        {messages.map((msg) => {
          return (
            <ChatMessageEntry
              key={msg.id}
              {...msg}
              active={msg.id === activeId}
            />
          );
        })}
      </ScrollableItemList>
    </Box>
  );
}
