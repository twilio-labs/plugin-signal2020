import { DOMElement, measureElement, useStdout } from 'ink';
import { useCallback, useEffect, useState } from 'react';
import { useMode } from '../context/mode';
import { Breakpoint } from '../utils/breakpoints';

export type ResizeTrigger = (stdout?: NodeJS.WriteStream) => any;

export function useResize(handler: ResizeTrigger) {
  const { stdout } = useStdout();

  useEffect(() => {
    handler(stdout);
    stdout?.setMaxListeners(100);
    stdout?.on('resize', () => handler(stdout));
    return () => {
      stdout?.off('resize', () => handler(stdout));
    };
  }, [stdout]);
}

export function useResponsiveWindowSize() {
  const { stdout } = useStdout();
  const [width, setTotalWidth] = useState(stdout?.columns);
  const [height, setTotalHeight] = useState(stdout?.rows);

  useResize((stdout) => {
    if (stdout) {
      setTotalWidth(stdout.columns);
      setTotalHeight(stdout.rows);
    }
  });

  return {
    width,
    height,
  };
}

export function useResponsiveMeasureElement(changeTriggers: any[] = []) {
  const { state } = useMode();
  const [domNode, setDomNode] = useState<DOMElement | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [workaroundCounter, setWorkaroundCount] = useState(0);
  const { width: totalWidth, height: totalHeight } = useResponsiveWindowSize();

  const ref = useCallback((node: DOMElement | null) => {
    setDomNode(node);
  }, []);

  useEffect(() => {
    if (domNode) {
      const result = measureElement(domNode);
      const { width, height } = result;

      if (isNaN(width) || isNaN(height)) {
        // When at first you don't succeed...
        // Try again in a few milliseconds by triggering a re-render
        // we'll only do that 2 times. Otherwise we'll set it to Infinity.
        // if you find this work around and email HACK to d.kundel+cli[at]twilio[dot]com
        // we'll mail to the first person some special goodies
        // TODO: I should figure out why this is happening
        if (workaroundCounter < 2) {
          setTimeout(() => {
            setWorkaroundCount((c) => c + 1);
          }, 20);
        }
      } else {
        setWidth(width);
        setHeight(height);
      }
    }
  }, [
    domNode,
    domNode?.yogaNode?.getChildCount(),
    totalWidth,
    totalHeight,
    state.value,
    workaroundCounter,
    ...changeTriggers,
  ]);

  return { ref, width, height };
}

export function shouldRenderBasedOnBreakpoint(
  {
    height = undefined,
    minHeight = 0,
    maxHeight = Infinity,
    width = undefined,
    minWidth = 0,
    maxWidth = Infinity,
    minArea = 0,
    maxArea = Infinity,
  }: Breakpoint,
  totalWidth: number,
  totalHeight: number
): boolean {
  const totalArea = totalHeight * totalWidth;
  let shouldRender = true;

  if (totalWidth < minWidth) {
    shouldRender = false;
  }

  if (totalWidth > maxWidth) {
    shouldRender = false;
  }

  if (totalHeight < minHeight) {
    shouldRender = false;
  }

  if (totalHeight > maxHeight) {
    shouldRender = false;
  }

  if (width === totalWidth) {
    shouldRender = true;
  }

  if (height === totalHeight) {
    shouldRender = true;
  }

  if (totalArea < minArea) {
    shouldRender = false;
  }

  if (totalArea > maxArea) {
    shouldRender = false;
  }

  return shouldRender;
}

export function useBreakpointForElement(
  breakpoint: Breakpoint,
  changeTriggers?: any[]
): { ref: (domInstance: DOMElement | null) => any; shouldRender: boolean };
export function useBreakpointForElement(
  breakpoint: Breakpoint[],
  changeTriggers?: any[]
): { ref: (domInstance: DOMElement | null) => any; shouldRender: boolean[] };
export function useBreakpointForElement(
  breakpoint: Breakpoint | Breakpoint[],
  changeTriggers: any[] = []
):
  | { ref: (domInstance: DOMElement | null) => any; shouldRender: boolean }
  | { ref: (domInstance: DOMElement | null) => any; shouldRender: boolean[] } {
  const { width, height, ref } = useResponsiveMeasureElement(changeTriggers);
  if (Array.isArray(breakpoint)) {
    const shouldRender = breakpoint.map((b) =>
      shouldRenderBasedOnBreakpoint(b, width, height)
    );
    return { ref, shouldRender };
  }
  const shouldRender = shouldRenderBasedOnBreakpoint(breakpoint, width, height);
  return { ref, shouldRender };
}

export function useBreakpointForWindow(breakpoint: Breakpoint) {
  const { width, height } = useResponsiveWindowSize();
  return {
    shouldRender: shouldRenderBasedOnBreakpoint(breakpoint, width, height),
    width: width,
    height: height,
  };
}
