import { Box } from 'ink';
import React from 'react';
import { DemoEntryOptions } from '../../machines/demoEntryMachine';
import { Selectable } from '../common/Selectable';
import { VerticalSpacer } from '../common/VerticalSpacer';

export type DemoOptionsProps = {
  hasQuickDeploy: boolean;
  selectedOption: string;
  hasDownloadOption: boolean;
  hasViewCodeOption: boolean;
};
export function DemoOptions({
  hasQuickDeploy,
  selectedOption,
  hasDownloadOption,
  hasViewCodeOption,
}: DemoOptionsProps) {
  return (
    <Box justifyContent="flex-start" marginTop={1}>
      <Box>
        <Selectable active={selectedOption === DemoEntryOptions.LEARN_MORE}>
          Learn More
        </Selectable>
      </Box>
      {hasViewCodeOption && (
        <>
          <VerticalSpacer />
          <Box>
            <Selectable active={selectedOption === DemoEntryOptions.VIEW_CODE}>
              View Code
            </Selectable>
          </Box>
        </>
      )}
      {hasDownloadOption && (
        <>
          <VerticalSpacer />
          <Box>
            <Selectable active={selectedOption === DemoEntryOptions.DOWNLOAD}>
              Download &amp; Setup
            </Selectable>
          </Box>
        </>
      )}
      {hasQuickDeploy && (
        <>
          <VerticalSpacer />
          <Box>
            <Selectable
              active={selectedOption === DemoEntryOptions.QUICK_DEPLOY}
            >
              Quick Deploy
            </Selectable>
          </Box>
        </>
      )}
    </Box>
  );
}
