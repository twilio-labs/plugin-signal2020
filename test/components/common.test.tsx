import { render } from 'ink-testing-library';
import React from 'react';
import { Bold, ListSelector } from '../../src/components/common';

describe('<Bold />', () => {
  it('should match snapshot', () => {
    const actual = render(<Bold>Hello</Bold>);
    expect(actual.lastFrame()).toMatchSnapshot();
  });
});

describe('<ListSelector />', () => {
  it('should match snapshot', () => {
    const actual = render(<ListSelector active />);
    expect(actual.lastFrame()).toMatchSnapshot();
  });
});
