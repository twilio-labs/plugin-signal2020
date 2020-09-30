import { Box, Text } from 'ink';
import React from 'react';

export const TestPane = () => {
  return (
    <Box flexDirection="column" flexGrow={1}>
      <Text>
        Welcome! If you found this place, you are clearly exploring the
        possibilies of the SIGNAL Developer Mode. Or you are reading the code.
        In any way we'd love to reward you. If you are the frist person to
        email:{' '}
        {[
          'd',
          'k',
          'u',
          'n',
          'd',
          'e',
          'l',
          '@',
          't',
          'w',
          'i',
          'l',
          'i',
          'o',
          '.com',
        ].join('')}{' '}
        to tell him that you found this message, we will send you something
        special.
      </Text>
    </Box>
  );
};
