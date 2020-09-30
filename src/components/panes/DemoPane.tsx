import { Box, Text } from 'ink';
import React, { useCallback, useMemo } from 'react';
import { useMode } from '../../context/mode';
import { useDemos } from '../../hooks/useApi';
import { useScrollableList } from '../../hooks/useScrollableList';
import { ModeEvents, ShowInstallerEvent } from '../../machines/modeMachine';
import { Demo } from '../../types/demo';
import { SHOW_DEMO_SECTION } from '../../utils/breakpoints';
import { openBrowserUrl } from '../../utils/openLink';
import { Bold } from '../common/Bold';
import { Key } from '../common/Key';
import { ListSelector } from '../common/ListSelector';
import { LoadingIndicator } from '../common/LoadingIndicator';
import { DemoEntryOptions } from '../demo/DemoEntryBox';
import { InteractiveDemoEntry } from '../demo/InteractiveDemoEntry';
import { ScrollableItemList } from '../scrollable/ScrollableItemList';
import { Pane } from './Pane';
import { PaneContent } from './PaneContent';

export type DemoRowProps = {
  demo: Demo;
  active?: boolean;
};
const DemoRow: React.FC<DemoRowProps> = ({ demo, active }) => {
  return (
    <Box>
      <ListSelector active={active} />
      <Text wrap="truncate-end">{demo.name}</Text>
      {demo.products.length > 0 && (
        <Text dimColor> | {demo.products.join(', ')}</Text>
      )}
    </Box>
  );
};

export type DemoListProps = {
  activeIdx: number;
  demos: Demo[];
};
const DemoList: React.FC<DemoListProps> = ({ demos, activeIdx }) => {
  const activeKey = demos[activeIdx].key;
  return (
    <ScrollableItemList activeIdx={activeIdx}>
      {demos.map((demo) => {
        return (
          <DemoRow demo={demo} active={activeKey === demo.key} key={demo.key} />
        );
      })}
    </ScrollableItemList>
  );
};

export type DemoSelectionProps = {
  demos: Demo[];
};
export const DemoSelection: React.FC<DemoSelectionProps> = ({ demos }) => {
  const { dispatch } = useMode();
  const [selectedDemoIdx] = useScrollableList(0, demos, Array.isArray(demos));
  const selectedDemo = Array.isArray(demos)
    ? demos[selectedDemoIdx]
    : undefined;

  const handleSelect = useCallback(
    (chosenOption, languageIdx) => {
      if (chosenOption === DemoEntryOptions.DOWNLOAD) {
        dispatch({
          type: ModeEvents.showInstaller,
          data: {
            ...selectedDemo,
            ...selectedDemo?.options[languageIdx],
          },
        } as ShowInstallerEvent);
      } else if (chosenOption === DemoEntryOptions.LEARN_MORE) {
        openBrowserUrl(selectedDemo?.codeexchange_link);
      } else if (chosenOption === DemoEntryOptions.VIEW_CODE) {
        if (selectedDemo?.options[languageIdx]) {
          openBrowserUrl(
            selectedDemo.options[languageIdx].repo_link ||
              selectedDemo.options[languageIdx].functions_link
          );
        }
      } else if (chosenOption === DemoEntryOptions.QUICK_DEPLOY) {
        openBrowserUrl(selectedDemo?.quick_deploy_link);
      }
    },
    [selectedDemo]
  );

  return (
    <>
      <Text>
        Use arrow keys to navigate and hit <Key>Return</Key>/<Key>Enter</Key> to
        select an option. Press <Key>Tab</Key> to cycle between programming
        languages.
      </Text>
      <DemoList demos={demos} activeIdx={selectedDemoIdx} />
      {selectedDemo && (
        <InteractiveDemoEntry demo={selectedDemo} onSelect={handleSelect} />
      )}
    </>
  );
};

export const DemoPane = () => {
  const {
    demos,
    loading,
    error,
  }: { demos?: Demo[]; loading: boolean; error?: Error } = useDemos();

  const sortedDemos = useMemo(
    (): Demo[] | undefined =>
      demos?.sort((a: Demo, b: Demo) => a.name.localeCompare(b.name)),
    [demos]
  );

  return (
    <Pane headline="Demos">
      <PaneContent breakpoint={SHOW_DEMO_SECTION}>
        <Bold>Explore what's possible with Twilio</Bold>
        {loading && <LoadingIndicator text="Loading demos..." />}
        {error && <Text>{error?.message}</Text>}
        {!loading && sortedDemos && <DemoSelection demos={sortedDemos} />}
      </PaneContent>
    </Pane>
  );
};
