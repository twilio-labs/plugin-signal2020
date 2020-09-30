import { Text } from 'ink';
import React from 'react';
import { useKeynoteInfo } from '../../hooks/useKeynoteInfo';
import { useKeynoteTime } from '../../hooks/useKeynoteTime';
import { LoadingIndicator } from '../common/LoadingIndicator';
import { ActiveKeynoteView } from '../keynote/ActiveKeynoteView';
import { InactiveKeynotePane } from '../keynote/InactiveKeynotePane';
import { PaneContent } from './PaneContent';

export const ClosedCaptioningPane = () => {
  const keynoteInfo = useKeynoteInfo();
  const keynoteTime = useKeynoteTime(keynoteInfo);

  const time =
    keynoteTime && keynoteTime.active && typeof keynoteTime.seconds === 'number'
      ? keynoteTime.seconds * 1000
      : null;

  if (keynoteInfo.status === 'success') {
    if (keynoteTime?.active && typeof keynoteTime?.seconds === 'number') {
      return (
        <ActiveKeynoteView
          inspectorData={keynoteInfo.data}
          time={time}
          vttString={keynoteInfo.vttFileContent}
        />
      );
    } else {
      return (
        <InactiveKeynotePane
          keynoteSessionIds={keynoteInfo.data.xray.keynoteSessionIds}
        />
      );
    }
  } else if (keynoteInfo.status === 'error') {
    return (
      <PaneContent>
        <Text>{keynoteInfo.error.message}</Text>
      </PaneContent>
    );
  }

  return (
    <PaneContent>
      <LoadingIndicator text="Loading keynote..." />
    </PaneContent>
  );
};
