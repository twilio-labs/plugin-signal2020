import { render } from 'ink-testing-library';
import * as React from 'react';
import {
  getTextFrames,
  TypeText,
} from '../../src/components/animated/TypeText';

describe('getTextFrames', () => {
  it('should create frames from text', () => {
    const actual = getTextFrames('Hello');
    const expected = ['', 'H', 'He', 'Hel', 'Hell', 'Hello'];
    expect(actual).toEqual(expected);
  });
});

describe('<TypeText />', () => {
  it('should display text', () => {
    const rendered = render(<TypeText text="Hi there!" />);
    expect(rendered.lastFrame()).toEqual('Hi there!');
  });

  it('should match snapshot', () => {
    const rendered = render(<TypeText text="Hi there!" />);
    expect(rendered.lastFrame()).toMatchSnapshot();
  });
});
