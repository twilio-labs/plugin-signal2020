import React from 'react';
import { InstallDispatcher } from '../../../machines/installerMachine';
import { Form, FormQuestion } from '../../form/Form';

export type GetAndCreateDirectoryQuestionsProps = {
  dispatch: InstallDispatcher;
};

export function GetAndCreateDirectoryQuestions({
  dispatch,
}: GetAndCreateDirectoryQuestionsProps) {
  const questions = [
    {
      type: 'text',
      name: 'directory',
      message: 'Enter a directory',
      details: `This directory is relative from ${process.cwd()}`,
    } as FormQuestion,
  ];

  return (
    <Form
      questions={questions}
      onSubmit={(data) => dispatch({ type: 'PROVIDE_DIRECTORY', data })}
    />
  );
}
