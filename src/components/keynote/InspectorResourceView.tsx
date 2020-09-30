import { formatDistance } from 'date-fns';
import { Box, Text } from 'ink';
import React, { PropsWithChildren, useCallback } from 'react';
import { Merge } from 'type-fest';
import { useMode } from '../../context/mode';
import { DemoEntryOptions } from '../../machines/demoEntryMachine';
import { ModeEvents, ShowInstallerEvent } from '../../machines/modeMachine';
import { Demo } from '../../types/demo';
import { InspectorApi, XrayResource } from '../../types/inspector';
import { openBrowserUrl } from '../../utils/openLink';
import { InteractiveDemoEntry } from '../demo/InteractiveDemoEntry';
import { ResourceLinkBox } from './ResourceLinkBox';

export type KeynoteInfo = Merge<
  XrayResource,
  {
    demo?: Demo;
  }
>;

function getInfoForTime(
  inspectorData: InspectorApi,
  time: number
): KeynoteInfo | null {
  const resource = inspectorData.xray.resources.find(
    (r) => r.startTime <= time && r.endTime >= time
  );
  if (!resource) {
    return null;
  }

  let demo: Demo | undefined = undefined;
  if (resource.demo.length > 0) {
    const demoData = inspectorData.demos.demos[resource.demo[0]];
    if (demoData) {
      demo = { ...demoData, key: resource.demo[0] };
    }
  }

  return { ...resource, demo };
}

export type InspectorResourceViewWrapperProps = PropsWithChildren<{
  time: number;
  endTime: number;
}>;
function InspectorResourceViewWrapper({
  time,
  endTime,
  children,
}: InspectorResourceViewWrapperProps) {
  const relativeTime =
    endTime > time
      ? formatDistance(endTime, time, {
          includeSeconds: true,
          addSuffix: true,
        })
      : 'soon';
  return (
    <Box flexDirection="column">
      <Box paddingX={2}>
        <Text dimColor>Next resource {relativeTime}</Text>
      </Box>
      {children}
    </Box>
  );
}

export type InspectorResourceViewProps = {
  inspectorData: InspectorApi;
  time: number;
  slim?: boolean;
};

export function InspectorResourceView({
  inspectorData,
  time,
  slim = false,
}: InspectorResourceViewProps) {
  const { dispatch } = useMode();
  const resource = getInfoForTime(inspectorData, time);

  const onDemoOptionSelect = useCallback(
    (chosenOption: DemoEntryOptions, languageIdx: number) => {
      const selectedDemo = resource?.demo;
      if (!selectedDemo) {
        return;
      }

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
        const codeLink =
          selectedDemo.options[languageIdx].repo_link ||
          selectedDemo.options[languageIdx].functions_link;
        if (codeLink) {
          openBrowserUrl(codeLink);
        }
      } else if (
        chosenOption === DemoEntryOptions.QUICK_DEPLOY &&
        selectedDemo?.quick_deploy_link
      ) {
        openBrowserUrl(selectedDemo?.quick_deploy_link);
      }
    },
    [resource?.demo]
  );

  if (!resource) {
    return null;
  }

  if (resource.demo) {
    return (
      <InspectorResourceViewWrapper time={time} endTime={resource.endTime}>
        <InteractiveDemoEntry
          demo={resource.demo}
          onSelect={onDemoOptionSelect}
          slim={slim}
        />
      </InspectorResourceViewWrapper>
    );
  }

  if (resource.links[0]) {
    return (
      <InspectorResourceViewWrapper time={time} endTime={resource.endTime}>
        <ResourceLinkBox link={resource.links[0]} slim={slim} />
      </InspectorResourceViewWrapper>
    );
  }

  return (
    <InspectorResourceViewWrapper time={time} endTime={resource.endTime} />
  );
}
