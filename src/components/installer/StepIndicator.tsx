import figures from 'figures';
import { Box, Text } from 'ink';
import React, { PropsWithChildren } from 'react';
import { Bold } from '../common/Bold';
import { LoadingIndicator } from '../common/LoadingIndicator';

export type StepStatus =
  | 'active'
  | 'success'
  | 'error'
  | 'skipped'
  | 'running'
  | 'todo';

export type StatusIndicatorProps = PropsWithChildren<{
  status: StepStatus;
}>;

export function StatusIndicator({ status, children }: StatusIndicatorProps) {
  switch (status) {
    case 'skipped':
      return (
        <Bold>
          <Text color="yellow">{figures.arrowDown}</Text> {children}{' '}
          <Text dimColor>[skipped]</Text>
        </Bold>
      );
    case 'error':
      return (
        <Bold>
          <Text color="redBright">{figures.cross}</Text> {children}{' '}
          <Text dimColor>[error]</Text>
        </Bold>
      );
    case 'success':
      return (
        <Bold>
          <Text color="greenBright">{figures.tick}</Text> {children}{' '}
          <Text dimColor>[done]</Text>
        </Bold>
      );
    case 'running':
      return (
        <Bold>
          {children} <Text dimColor>[in progress{figures.ellipsis}]</Text>
        </Bold>
      );
    case 'todo':
      return (
        <Bold dimColor>
          <Text color="gray">{figures.nodejs}</Text>
          {'  '}
          {children}
        </Bold>
      );
  }
  return <Bold>{children}</Bold>;
}

export type StepIndicatorProps = PropsWithChildren<{
  title: string;
  slim?: boolean;
  shouldRenderDetails?: boolean;
  status?: StepStatus;
}>;

export function StepIndicator({
  title,
  children,
  status = 'active',
  slim = true,
  shouldRenderDetails = true,
}: StepIndicatorProps) {
  const active = status === 'active' || status === 'running';
  const running = status === 'running';
  const borderStyle = active ? 'single' : slim ? undefined : 'single';
  const paddingY = slim ? 0 : 1;

  const renderDetails = status === 'active' ? true : shouldRenderDetails;

  return (
    <Box
      width="100%"
      flexDirection="column"
      borderStyle={borderStyle}
      borderColor={active ? undefined : 'gray'}
      marginBottom={renderDetails ? 1 : 0}
      paddingY={paddingY}
      paddingX={1}
    >
      <Box>
        <StatusIndicator status={status}>{title}</StatusIndicator>
      </Box>
      {renderDetails && (
        <>
          {running && <LoadingIndicator text="Loading..." />}
          {children}
        </>
      )}
    </Box>
  );
}
