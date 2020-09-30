import { Box, Text } from 'ink';
import React from 'react';
import { Divider } from '../common/Divider';
import { Key } from '../common/Key';

export function Controls() {
  const keys = [
    { key: 'b', description: 'Toggle Sidebar' },
    { key: 'w', description: 'Welcome' },
    { key: 'k', description: 'Keynote' },
    { key: 's', description: 'Schedule' },
    { key: 'd', description: 'Demos' },
    { key: 'r', description: 'Useful Resources ' },
    { key: 'q', description: 'Exit' },
  ];
  return (
    <Box flexDirection="column" padding={1} flexShrink={0}>
      <Divider title={'Controls'} />
      <Text>Press any of the keys to switch</Text>
      {keys.map((item) => (
        <Text key={item.key}>
          <Key>{item.key}</Key> for {item.description}
        </Text>
      ))}
    </Box>
  );
}
