import React from 'react';
import { DemoLanguage } from '../../types/demo';
import { Inverse, InverseProps } from './Inverse';

export type LanguageTagLanguageOption = DemoLanguage | 'Default';

export const ColorCombinations: {
  [key in LanguageTagLanguageOption]: {
    default: InverseProps;
    active: InverseProps;
  };
} = {
  JavaScript: {
    default: {
      color: 'whiteBright',
      backgroundColor: 'red',
    },
    active: {
      color: 'black',
      backgroundColor: 'yellowBright',
    },
  },
  'C#': {
    default: {
      color: 'whiteBright',
      backgroundColor: 'red',
    },
    active: {
      color: 'whiteBright',
      backgroundColor: 'green',
    },
  },
  Ruby: {
    default: {
      color: 'whiteBright',
      backgroundColor: 'red',
    },
    active: {
      color: 'whiteBright',
      backgroundColor: 'redBright',
    },
  },
  Python: {
    default: {
      color: 'whiteBright',
      backgroundColor: 'red',
    },
    active: {
      color: 'yellowBright',
      backgroundColor: 'blue',
    },
  },
  Swift: {
    default: {
      color: 'whiteBright',
      backgroundColor: 'red',
    },
    active: {
      color: 'black',
      backgroundColor: 'whiteBright',
    },
  },
  Java: {
    default: {
      color: 'whiteBright',
      backgroundColor: 'red',
    },
    active: {
      color: 'red',
      backgroundColor: 'whiteBright',
    },
  },
  PHP: {
    default: {
      color: 'whiteBright',
      backgroundColor: 'red',
    },
    active: {
      color: 'whiteBright',
      backgroundColor: 'magenta',
    },
  },
  Android: {
    default: {
      color: 'whiteBright',
      backgroundColor: 'red',
    },
    active: {
      color: 'whiteBright',
      backgroundColor: 'green',
    },
  },
  'C++': {
    default: {
      color: 'whiteBright',
      backgroundColor: 'red',
    },
    active: {
      color: 'whiteBright',
      backgroundColor: 'green',
    },
  },
  '.NET': {
    default: {
      color: 'whiteBright',
      backgroundColor: 'red',
    },
    active: {
      color: 'whiteBright',
      backgroundColor: 'magenta',
    },
  },
  TypeScript: {
    default: {
      color: 'whiteBright',
      backgroundColor: 'red',
    },
    active: {
      color: 'whiteBright',
      backgroundColor: 'blue',
    },
  },
  Default: {
    default: {},
    active: {},
  },
};

export type ProgrammingLanguageTagProps = {
  language: DemoLanguage;
  active?: boolean;
};
export function ProgrammingLanguageTag({
  language,
  active = false,
}: ProgrammingLanguageTagProps) {
  const colorScheme = ColorCombinations[language];

  return (
    <Inverse {...colorScheme[active ? 'active' : 'default']}>
      {language}
    </Inverse>
  );
}
