import { Box } from 'ink';
import React, { PropsWithChildren, useMemo } from 'react';
import { useResponsiveMeasureElement } from '../../hooks/useResize';
import { EmptyRow } from './EmptyRow';
import { MoreItemsDown } from './MoreItemsDown';
import { MoreItemsUp } from './MoreItemsUp';

export type ScrollableItemListProps = PropsWithChildren<{
  activeIdx: number;
  showScrollIndicator?: boolean;
  rowsPerLine?: number;
  moreAboveText?: string;
  moreBelowText?: string;
  [key: string]: any;
}>;

export function ScrollableItemList({
  activeIdx,
  children,
  showScrollIndicator = true,
  rowsPerLine = 1,
  moreAboveText,
  moreBelowText,
  ...props
}: ScrollableItemListProps) {
  const { ref, height } = useResponsiveMeasureElement([children]);

  const [slicedEntries, offset] = useMemo(() => {
    const entries = React.Children.toArray(children);
    const availableRows = height;
    const allNeededRows = entries.length * rowsPerLine;

    let numberOfRowsShown: number | undefined;
    if (availableRows < allNeededRows) {
      if (availableRows === 0) {
        numberOfRowsShown = rowsPerLine;
      } else {
        numberOfRowsShown = availableRows;
      }
    } else {
      numberOfRowsShown = allNeededRows;
    }

    const activeIdxPerLine = activeIdx * rowsPerLine;
    let offset = 0;
    if (
      activeIdxPerLine > (numberOfRowsShown + offset) / 2 &&
      numberOfRowsShown !== allNeededRows
    ) {
      offset = Math.round(
        (activeIdxPerLine - Math.floor((numberOfRowsShown + offset) / 2)) /
          rowsPerLine
      );
    }

    const numberOfItems = Math.floor(numberOfRowsShown / rowsPerLine);
    const slicedEntries = entries.slice(offset, offset + numberOfItems);
    return [slicedEntries, offset, numberOfItems];
  }, [children, activeIdx, height]);

  const shouldRenderMoreEntriesBelow =
    showScrollIndicator && slicedEntries.length * rowsPerLine >= height;
  const shouldRenderMoreEntriesAbove = showScrollIndicator && offset > 0;

  return (
    <Box
      flexGrow={1}
      flexShrink={1}
      padding={0}
      paddingTop={0}
      paddingBottom={0}
      borderStyle="single"
      flexDirection="column"
      {...props}
    >
      {shouldRenderMoreEntriesAbove ? (
        <MoreItemsUp text={moreAboveText} />
      ) : !showScrollIndicator ? null : (
        <EmptyRow />
      )}
      <Box ref={ref} flexGrow={1} flexDirection="column">
        {slicedEntries}
      </Box>
      {shouldRenderMoreEntriesBelow ? (
        <MoreItemsDown text={moreBelowText} />
      ) : !showScrollIndicator ? null : (
        <EmptyRow />
      )}
    </Box>
  );
}
