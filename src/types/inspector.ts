import { Except, Merge } from 'type-fest';
import { Demo } from './demo';

export type XrayLink = {
  name: string;
  url: string;
};

export type XrayLinkWithProduct = Merge<
  XrayLink,
  {
    product?: string;
  }
>;

export type XrayResource = {
  startTime: number;
  endTime: number;
  title: string | null;
  description: string | null;
  demo: string[];
  links: XrayLinkWithProduct[];
  docs_links: XrayLink[];
};

export type XrayData = {
  closedCaptions: string;
  // first session is NAMER, second is APJ, third is EMEA
  keynoteSessionIds: [string, string, string];
  resources: XrayResource[];
};

export type DemosData = { demos: { [key: string]: Except<Demo, 'key'> } };

export type InspectorApi = {
  demos: DemosData;
  xray: XrayData;
};
