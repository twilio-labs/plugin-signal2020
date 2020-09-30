import { Box } from 'ink';
import React from 'react';
import { DemoLanguage } from '../../types/demo';
import { Bold } from '../common/Bold';
import { ProgrammingLanguageTags } from './ProgrammingLanguageTags';

export type DemoInfoHeaderProps = {
  name: string;
  languages: DemoLanguage[];
  activeLanguageIdx?: number;
};
export function DemoInfoHeader({
  name,
  languages,
  activeLanguageIdx,
}: DemoInfoHeaderProps) {
  return (
    <Box justifyContent="space-between">
      <Box>
        <Bold>{name}</Bold>
      </Box>
      <ProgrammingLanguageTags
        languages={languages}
        activeIdx={activeLanguageIdx}
      />
    </Box>
  );
}
