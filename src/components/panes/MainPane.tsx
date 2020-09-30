import React from 'react';
import { useMode } from '../../context/mode';
import { CheatModePane } from './CheatModePane';
import { ClosedCaptioningPane } from './ClosedCaptioningPane';
import { DemoPane } from './DemoPane';
import { InstallerPane } from './InstallerPane';
import { ResourcePane } from './ResourcePane';
import { SchedulePane } from './SchedulePane';
import { TestPane } from './TestPane';
import { WelcomePane } from './WelcomePane';

export function MainPane() {
  const { state } = useMode();
  switch (true) {
    case state.matches('mainPane.resources'):
      return <ResourcePane />;
    case state.matches('mainPane.closedCaptioning'):
      return <ClosedCaptioningPane />;
    case state.matches('mainPane.demos'):
      return <DemoPane />;
    case state.matches('mainPane.test'):
      return <TestPane />;
    case state.matches('mainPane.schedule'):
      return <SchedulePane />;
    case state.matches('mainPane.installer'):
      return <InstallerPane />;
    case state.matches('mainPane.cheatMode'):
      return <CheatModePane />;
    case state.matches('mainPane.welcome'):
    default:
      return <WelcomePane />;
  }
}
