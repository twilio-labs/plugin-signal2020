import { Box, Text } from 'ink';
import React, { useCallback } from 'react';
import { XrayLinkWithProduct } from '../../types/inspector';
import { openBrowserUrl } from '../../utils/openLink';
import { Bold } from '../common/Bold';
import { Button } from '../common/Button';

export type ResourceLinkBoxProps = {
  link: XrayLinkWithProduct;
  slim?: boolean;
};
export function ResourceLinkBox({ link, slim = false }: ResourceLinkBoxProps) {
  const openLink = useCallback(() => {
    openBrowserUrl(link.url);
  }, [link]);

  return (
    <Box
      borderStyle="single"
      flexDirection="column"
      paddingX={1}
      paddingY={slim ? 0 : 1}
      flexGrow={0}
      flexShrink={0}
    >
      <Bold>{link.name}</Bold>
      <Box marginBottom={1}>
        <Text dimColor>{link.url}</Text>
      </Box>
      <Button autoFocus onAction={openLink}>
        Open Link
      </Button>
    </Box>
  );
}
