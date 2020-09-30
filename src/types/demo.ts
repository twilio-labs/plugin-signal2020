export type DemoLanguage =
  | 'Swift'
  | 'JavaScript'
  | 'Android'
  | 'Java'
  | 'Ruby'
  | 'TypeScript'
  | 'Python'
  | 'PHP'
  | 'C#'
  | '.NET'
  | 'C++';

export type DemoOption = {
  language: DemoLanguage;
  repo_link: string | null;
  functions_link?: string;
};

export type Demo = {
  key: string;
  name: string;
  products: string[];
  description: string;
  options: DemoOption[];
  codeexchange_link: string;
  quick_deploy_link: string | null;
  is_community: boolean;
};
