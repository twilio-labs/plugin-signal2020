import figures from 'figures';
import { Text } from 'ink';
import React from 'react';

export type InfoProps = {
  text?: string;
};
export function Info({ text }: InfoProps) {
  return (
    <Text color="cyan">
      {figures.info} {text || 'Info'}
    </Text>
  );
}
