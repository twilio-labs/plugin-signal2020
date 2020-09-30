import { Box, Text } from 'ink';
import InkTextInput from 'ink-text-input';
import React, { useCallback, useState } from 'react';
import { Button } from '../common/Button';

export type ChatInputProps = {
  prompt: string;
  onSend?: (msg: string) => any;
  placeholder?: string;
  clearOnSend?: boolean;
  active?: boolean;
};
export function ChatInput({
  prompt,
  onSend,
  placeholder = undefined,
  clearOnSend = true,
  active = true,
}: ChatInputProps) {
  const [content, setContent] = useState('');
  const onAction = useCallback(() => {
    if (!active) {
      return;
    }

    const trimmedContent = content.trim();

    if (trimmedContent) {
      if (typeof onSend === 'function') {
        onSend(trimmedContent);
      }
      if (clearOnSend) {
        setContent('');
      }
    }
  }, [active, content]);

  return (
    <Box
      width="100%"
      borderStyle="single"
      paddingLeft={1}
      paddingRight={1}
      height={3}
      minHeight={3}
    >
      <Box marginRight={1}>
        <Text>{prompt}</Text>
      </Box>
      <Box flexGrow={1}>
        <InkTextInput
          focus={active}
          placeholder={placeholder}
          onChange={setContent}
          value={content}
        />
      </Box>
      <Box>
        <Button autoFocus onAction={onAction} dimColor={!active}>
          Send Request
        </Button>
      </Box>
    </Box>
  );
}
