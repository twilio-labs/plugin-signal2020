import React, { useCallback } from 'react';
import { InstallDispatcher } from '../../../machines/installerMachine';
import { Form, FormQuestion } from '../../form/Form';

export type InstallDependenciesQuestionsProps = {
  dispatch: InstallDispatcher;
};

export function InstallDependenciesQuestions({
  dispatch,
}: InstallDependenciesQuestionsProps) {
  const questions: FormQuestion[] = [
    {
      type: 'confirm',
      name: 'install',
      message: 'Do you want to install dependencies?',
      details: `If you continue, this might take a bit. You can enjoy the conference in the meantime or skip to check out the code.`,
    },
  ];

  const onSubmit = useCallback((data) => {
    if (!data.install) {
      dispatch({ type: 'DENY' });
    } else {
      dispatch({ type: 'CONFIRM' });
    }
  }, []);

  return <Form questions={questions} onSubmit={onSubmit} />;
}
