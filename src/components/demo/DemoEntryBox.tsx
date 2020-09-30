import { Box, BoxProps } from 'ink';
import React, { PropsWithChildren, useMemo } from 'react';
import { Merge } from 'type-fest';
import { Demo, DemoLanguage } from '../../types/demo';
import { DemoDescription } from './DemoDescription';
import { DemoInfoHeader } from './DemoInfoHeader';

export type DemoEntryBoxProps = Merge<
  BoxProps,
  {
    demo: Demo;
    language?: DemoLanguage;
    showDescription?: boolean;
    activeLanguageIdx?: number;
    slim?: boolean;
  }
>;
export function DemoEntryBox({
  demo,
  language = undefined,
  showDescription = true,
  activeLanguageIdx = 0,
  children = undefined,
  slim = false,
  ...props
}: PropsWithChildren<DemoEntryBoxProps>) {
  const languages = useMemo(
    () => (language ? [language] : demo.options.map((o) => o.language)),
    [demo, language]
  );

  return (
    <Box
      borderStyle="single"
      flexDirection="column"
      paddingX={1}
      paddingY={slim ? 0 : 1}
      height={slim ? 6 : 8}
      minHeight={slim ? 6 : 8}
      {...props}
    >
      <DemoInfoHeader
        name={demo.name}
        languages={languages}
        activeLanguageIdx={activeLanguageIdx}
      />
      {showDescription ? (
        <DemoDescription>{demo.description}</DemoDescription>
      ) : null}
      {children}
    </Box>
  );
}

export { DemoEntryOptions } from '../../machines/demoEntryMachine';
