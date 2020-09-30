export type Breakpoint = {
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  minArea?: number;
  maxArea?: number;
};

export const SHOW_REGULAR_HEADLINE: Breakpoint = {
  minWidth: 140,
  minHeight: 40,
};

export const SHOW_AVATAR: Breakpoint = {
  minHeight: 45,
};

export const SHOW_DEMO_SECTION: Breakpoint = {
  minWidth: 68,
  minHeight: 16,
};

export const SHOW_SCHEDULE_SECTION: Breakpoint = {
  minWidth: 68,
  minHeight: 16,
};

export const SHOW_INSTALLER: Breakpoint = {
  minWidth: 68,
};

export const SHOW_CHEATMODE: Breakpoint = {
  minWidth: 79,
};

export const SHOW_SHORT_WELCOME_DESCRIPTION: Breakpoint = {
  minArea: 65 * 20,
};

export const SHOW_MEDIUM_WELCOME_DESCRIPTION: Breakpoint = {
  minArea: 68 * 30,
};

export const SHOW_FULL_WELCOME_DESCRIPTION: Breakpoint = {
  minArea: 68 * 39,
};

export const SHOW_APP: Breakpoint = {
  minHeight: 20,
};

export const breakpoints = {
  SHOW_AVATAR,
  SHOW_REGULAR_HEADLINE,
  SHOW_INSTALLER,
  SHOW_DEMO_SECTION,
  SHOW_CHEATMODE,
};

export default breakpoints;
