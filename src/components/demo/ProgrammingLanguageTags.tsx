import { Box } from 'ink';
import React from 'react';
import { DemoLanguage } from '../../types/demo';
import { ProgrammingLanguageTag } from '../common/ProgrammingLanguageTag';

export type ProgrammingLanguageTagsProps = {
  languages: DemoLanguage[];
  activeIdx?: number;
};
export function ProgrammingLanguageTags({
  languages,
  activeIdx,
}: ProgrammingLanguageTagsProps) {
  return (
    <Box>
      {languages.map((l, idx) => {
        const active = activeIdx === idx;
        const isLastItem = idx === languages.length - 1;
        return (
          <Box marginRight={!isLastItem ? 1 : 0} key={l}>
            <ProgrammingLanguageTag language={l} active={active} />
          </Box>
        );
      })}
    </Box>
  );
}
