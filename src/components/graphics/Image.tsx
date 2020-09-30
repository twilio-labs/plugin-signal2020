import { Box, DOMElement, Text } from 'ink';
import React from 'react';

export type ImageProps = {
  imageString: string | null;
  color?: string;
  height?: number;
};

export const Image = React.forwardRef<DOMElement, ImageProps>(
  ({ imageString, color, height }, ref) => {
    let renderedString: string | JSX.Element | null = imageString;

    if (
      typeof imageString === 'string' &&
      typeof height === 'number' &&
      imageString.split('\n').length > height
    ) {
      renderedString = (
        <>
          <Text dimColor>Increase size to show avatar</Text>
        </>
      );
    }

    return (
      <Box ref={ref} flexGrow={1} flexShrink={1} justifyContent="center">
        <Text color={color}>{renderedString}</Text>
      </Box>
    );
  }
);
