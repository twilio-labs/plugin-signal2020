import { Box, Text } from 'ink';
import React, { useCallback, useEffect, useState } from 'react';
import { InstallDispatcher } from '../../../machines/installerMachine';
import { getEnvSetupQuestions, ParsedExample } from '../../../utils/installer';
import { Form } from '../../form/Form';

export type SetupProjectQuestionsProps = {
  dispatch: InstallDispatcher;
  directory: string;
  defaultValues: { [key: string]: any };
};

export function SetupProjectQuestions({
  directory,
  dispatch,
  defaultValues,
}: SetupProjectQuestionsProps) {
  const [parsedResult, setParsedResult] = useState<
    ParsedExample | undefined | null
  >(undefined);

  useEffect(() => {
    (async () => {
      const parsedEnvResult = await getEnvSetupQuestions(
        directory,
        defaultValues
      );
      if (parsedEnvResult) {
        parsedEnvResult.questions = [
          {
            type: 'confirm',
            name: 'setup',
            message: `Do you want to setup project?`,
            details: `We'll ask you for a couple of configuration values. Alternatively you can manually follow the instructions in the project.`,
            earlyExitIfValue: () => false,
          },
          ...parsedEnvResult.questions,
        ];
      }
      setParsedResult(parsedEnvResult);
    })();
  }, []);

  const onSubmit = useCallback(
    (data) => {
      if (!data.setup) {
        dispatch({ type: 'DENY' });
      } else {
        dispatch({
          type: 'CONFIRM_CONFIGURING',
          data: { ...parsedResult, answers: data },
        });
      }
    },
    [parsedResult]
  );

  useEffect(() => {
    if (parsedResult === null) {
      dispatch({ type: 'DENY' });
    }
  }, [parsedResult]);

  if (!parsedResult) {
    return <Text>Loading configuration values...</Text>;
  }

  return (
    <Box minHeight={6} flexGrow={1} flexShrink={0}>
      <Form
        questions={parsedResult?.questions}
        onSubmit={onSubmit}
        scrollable={true}
        showScrollIndicators={true}
      />
    </Box>
  );
}
