import { Box, Text } from 'ink';
import React, { useEffect, useState } from 'react';
import { useResponsiveMeasureElement } from '../../hooks/useResize';

function computeString(text: string, width: number, symbol: string) {
  if (symbol.length > 1) {
    throw new Error('Symbol can only be one character');
  }

  const paddingTotal = width - text.length - 2;
  const paddingSide = Math.floor(paddingTotal / 2);
  return `${symbol.repeat(paddingSide)} ${text} ${symbol.repeat(paddingSide)}`;
}

export type DividerProps = {
  title: string;
  symbol?: string;
};
export const Divider = ({ title, symbol = '-' }: DividerProps) => {
  const [text, setText] = useState(title);
  const { width, ref } = useResponsiveMeasureElement();

  useEffect(() => {
    if (!isNaN(width) && width > 0) {
      setText(computeString(title, width, symbol));
    }
  }, [title, width]);

  return (
    <Box ref={ref} width="100%">
      <Text>{text}</Text>
    </Box>
  );
};
