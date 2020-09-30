import { Box, Text } from 'ink';
import React from 'react';
import { useVtt } from '../../hooks/useVtt';

type VttLineProps = {
  text: string;
};
function VttLine({ text }: VttLineProps) {
  return <Text>{text}</Text>;
}

export type VttViewerProps = {
  vttString: string;
  time: number;
  slim?: boolean;
};
export function VttViewer({ vttString, time, slim = false }: VttViewerProps) {
  const vtt = useVtt(vttString);

  const entries = vtt.cues.filter((c) => c.start <= time && c.end >= time);

  return (
    <Box
      alignItems="center"
      borderStyle="bold"
      borderColor="red"
      flexDirection="column"
      paddingX={1}
      paddingY={slim ? 0 : 1}
      minHeight={slim ? 4 : 6}
    >
      {entries.map((e) => (
        <VttLine {...e} />
      ))}
    </Box>
  );
}
