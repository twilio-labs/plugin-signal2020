import { Box, Spacer, Text } from 'ink';
import Link from 'ink-link';
import React from 'react';
import { useResponsiveWindowSize } from '../../hooks/useResize';
import { InspectorApi } from '../../types/inspector';
import config from '../../utils/config';
import { timeToText } from '../../utils/dateHelpers';
import { Bold } from '../common/Bold';
import { Key } from '../common/Key';
import { InspectorResourceView } from './InspectorResourceView';
import { VttViewer } from './VttViewer';

export type ActiveKeynoteViewProps = {
  time: number;
  vttString: string;
  inspectorData: InspectorApi;
};
export function ActiveKeynoteView({
  time,
  vttString,
  inspectorData,
}: ActiveKeynoteViewProps) {
  const { height } = useResponsiveWindowSize();
  const slim = (height || 0) < 26;

  return (
    <Box flexDirection="column" flexGrow={1} flexShrink={1} padding={1}>
      <Text>
        <Bold>Live Closed Captioning.</Bold> Time {timeToText(time)}
      </Text>
      <VttViewer vttString={vttString} time={time} slim={slim} />
      <InspectorResourceView
        inspectorData={inspectorData}
        time={time}
        slim={slim}
      />
      <Spacer />
      <Box alignItems="center" flexDirection="column">
        <Bold>
          The contents of this screen update live as you are watching the
          keynote in your browser.
        </Bold>
        <Text>
          All demos can also be found in the demos section. Press <Key>d</Key>{' '}
          to enter the demo section.
        </Text>
        <Text>
          To watch the video footage.{' '}
          <Link url={config.signalWebsite}>
            <Text>Head over to the SIGNAL website.</Text>
          </Link>
        </Text>
      </Box>
    </Box>
  );
}
