import { Box } from 'ink';
import React from 'react';
import { ChatMessage } from '../../types/chatMessages';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';

export type ChatWindowProps = {
  messages: ChatMessage[];
  footer?: JSX.Element;
  prompt: string;
  onSend?: (msg: string) => any;
  placeholder?: string;
  active?: boolean;
};
export function ChatWindow({
  messages,
  footer,
  prompt,
  onSend,
  placeholder,
  active,
}: ChatWindowProps) {
  return (
    <Box width="100%" flexGrow={1} flexDirection="column">
      <ChatMessages messages={messages} />
      <ChatInput
        placeholder={placeholder}
        prompt={prompt}
        onSend={onSend}
        active={active}
      />
      {footer ? footer : null}
    </Box>
  );
}
