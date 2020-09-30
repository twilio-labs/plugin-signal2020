import { Box } from 'ink';
import React, { useReducer } from 'react';
import { Merge } from 'type-fest';
import { VariableQuestion } from '../../utils/installer';
import { ScrollableItemList } from '../scrollable/ScrollableItemList';
import { Input, InputProps } from './Input';

export type FormQuestion = Merge<InputProps, VariableQuestion>;

export type FormData = {
  [key: string]: any;
};

type FormState = {
  activeIndex: number;
  answers: FormData;
};

type FormAction = {
  type: 'new-entry';
  data: FormData;
};

export type FormProps = {
  questions: FormQuestion[];
  onUpdate?: (data: FormData) => any;
  onSubmit?: (data: FormData) => any;
  scrollable?: boolean;
  showScrollIndicators?: boolean;
};

export function Form({
  questions,
  onUpdate = undefined,
  onSubmit,
  scrollable = false,
  showScrollIndicators = false,
}: FormProps) {
  const reducer = (state: FormState, action: FormAction): FormState => {
    if (action.type === 'new-entry') {
      const newState = {
        ...state,
        answers: { ...state.answers, ...action.data },
        activeIndex: state.activeIndex + 1,
      };
      const hasAnsweredAllQuestions = questions.every(
        (q) => typeof newState.answers[q.name] !== 'undefined'
      );

      const nameOfAnsweredQuestion = Object.keys(action.data)[0];
      const answeredQuestion = questions.find(
        (q) => q.name === nameOfAnsweredQuestion
      );
      const hasAnsweredQuestionWithEarlyExit =
        typeof answeredQuestion?.earlyExitIfValue === 'function' &&
        answeredQuestion.earlyExitIfValue() ===
          action.data[nameOfAnsweredQuestion];

      if (
        (hasAnsweredAllQuestions || hasAnsweredQuestionWithEarlyExit) &&
        typeof onSubmit === 'function'
      ) {
        onSubmit(newState.answers);
      } else if (typeof onUpdate === 'function') {
        onUpdate(action.data);
      }
      return newState;
    }
    return state;
  };

  const [state, dispatch] = useReducer(reducer, {
    activeIndex: 0,
    answers: {},
  });

  let Wrapper: typeof Box | typeof ScrollableItemList = Box;
  let additionalProps: any = {};
  if (scrollable) {
    Wrapper = ScrollableItemList;
    additionalProps = {
      activeIdx: state.activeIndex,
      showScrollIndicator: showScrollIndicators,
      rowsPerLine: 2,
      borderStyle: null,
      moreAboveText: `${state.activeIndex} questions done`,
      moreBelowText: `${questions.length - state.activeIndex} questions to do`,
    };
  }

  return (
    <Wrapper flexDirection="column" {...additionalProps}>
      {questions.map((q, idx) => (
        <>
          {/* @ts-ignore */}
          <Input
            {...q}
            key={q.name}
            onSubmit={(partialAnswer: FormData) =>
              // @ts-ignore
              dispatch({ type: 'new-entry', data: partialAnswer })
            }
            active={idx === state.activeIndex}
            done={typeof state.answers[q.name] !== 'undefined'}
          />
        </>
      ))}
    </Wrapper>
  );
}
