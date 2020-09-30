import { Text, useInput } from 'ink';
import open from 'open';
import React, { useCallback, useState } from 'react';
import { useMode } from '../../context/mode';
import { useResponsiveWindowSize } from '../../hooks/useResize';
import { useTerminalInfo } from '../../hooks/useTerminalInfo';
import { ModeEvents } from '../../machines/modeMachine';
import { SHOW_INSTALLER } from '../../utils/breakpoints';
import { Info } from '../common/Info';
import { Key } from '../common/Key';
import { DemoEntryBox } from '../demo/DemoEntryBox';
import { InstallationProcess } from '../installer/InstallationProcess';
import { OpenProjectBox } from '../installer/OpenProjectBox';
import { PaneContent } from './PaneContent';

const fallbackInstaller = (
  <Text>
    Your terminal is too small to support the best experience for the demo
    installer. Try hiding the sidebar using <Key>Ctrl</Key>+<Key>b</Key> or
    increase the size of your terminal until this message disappears.
  </Text>
);

function HasNoGit({ url }: { url: string }) {
  return (
    <Text>
      We are sorry, we could not find git installed on your system. This is
      required for the installer to work. Please either install git and restart
      Developer Mode or download the code manually from {url}
    </Text>
  );
}

function InstallerInfo() {
  return (
    <Text>
      <Info text="Info" /> You can exit the installer at any point by pressing{' '}
      <Key>Ctrl</Key> + <Key>D</Key>
    </Text>
  );
}

export const InstallerPane = () => {
  const [projectDir, setProjectDir] = useState<string | undefined>(undefined);
  const [installationDone, setInstallationDone] = useState(false);
  const [installationSuccessful, setInstallationSuccessful] = useState(false);
  const { state, dispatch } = useMode();
  const { hasGit } = useTerminalInfo();

  const { height } = useResponsiveWindowSize();
  const slim = (height || 0) < 51;
  const noDetails = (height || 0) < 30;

  const openProject = useCallback(() => {
    if (installationDone && projectDir) {
      open(projectDir);
    }
  }, [installationDone, projectDir]);

  useInput((input, key) => {
    if (key.ctrl && input === 'd') {
      dispatch({ type: ModeEvents.exitInstaller });
    }

    if (key.ctrl && input === 'b') {
      dispatch({ type: ModeEvents.toggleSideBar });
    }
  });

  const selectedDemo = state.context.selectedDemo;
  if (!selectedDemo) {
    return null;
  }

  const onDone = ({
    directory,
    successful,
  }: {
    directory: string;
    successful: boolean;
  }) => {
    setInstallationDone(true);
    setInstallationSuccessful(successful);
    setProjectDir(directory);
    dispatch({ type: ModeEvents.finished });
  };

  if (selectedDemo.repo_link === null) {
    return null;
  }

  return (
    <PaneContent
      width="100%"
      fallback={fallbackInstaller}
      breakpoint={SHOW_INSTALLER}
    >
      {!hasGit && <HasNoGit url={selectedDemo.repo_link} />}
      {hasGit && (
        <>
          <DemoEntryBox
            demo={selectedDemo}
            language={selectedDemo.language}
            minHeight={5}
            height={5}
            borderStyle={undefined}
          >
            <InstallerInfo />
          </DemoEntryBox>
          <InstallationProcess
            slim={slim}
            language={selectedDemo.language}
            repoUrl={selectedDemo.repo_link}
            onDone={onDone}
            shouldRenderDetails={!noDetails}
          />
          {installationDone && installationSuccessful && (
            <OpenProjectBox slim={slim} onOpen={openProject} />
          )}
        </>
      )}
    </PaneContent>
  );
};
