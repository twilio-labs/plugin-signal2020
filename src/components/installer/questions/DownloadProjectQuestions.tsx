import { Box } from 'ink';
import React, { useCallback, useMemo } from 'react';
import {
  InstallDispatcher,
  InstallerMachineContext,
} from '../../../machines/installerMachine';
import { Form, FormQuestion } from '../../form/Form';

export function getDownloadQuestions(
  context: InstallerMachineContext
): FormQuestion[] {
  const questions: FormQuestion[] = [
    {
      type: 'confirm',
      name: 'shouldDownload',
      message: `Do you want to download the project?`,
      details: `Download from ${context.repoUrl} into ${context.directory}?`,
      earlyExitIfValue: () => false,
    },
  ];

  if (!context.isEmptyDirectory) {
    questions.push({
      type: 'confirm',
      name: 'force',
      message: `Do you want to continue?`,
      details:
        'The folder is not empty. Do you want to proceed anyways? This will override the project.',
    });
  }

  return questions;
}

export type DownloadProjectQuestionsProps = {
  dispatch: InstallDispatcher;
  context: InstallerMachineContext;
};

export function DownloadProjectQuestions({
  dispatch,
  context,
}: DownloadProjectQuestionsProps) {
  const questions = useMemo(() => getDownloadQuestions(context), [context]);

  const onSubmit = useCallback((data) => {
    if (!data.shouldDownload) {
      dispatch({ type: 'DENY' });
    } else {
      if (data.force || typeof data.force === 'undefined') {
        dispatch({ type: 'CONFIRM' });
      } else {
        dispatch({ type: 'DENY' });
      }
    }
  }, []);

  return (
    <Box height={2} minHeight={2} flexGrow={1} flexShrink={0}>
      <Form questions={questions} onSubmit={onSubmit} scrollable={true} />
    </Box>
  );
}
