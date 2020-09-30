import { Newline, Text } from 'ink';
import React, { useCallback } from 'react';
import { useUser } from '../../context/user';
import { XrayData } from '../../types/inspector';
import { openSessionUrl } from '../../utils/openLink';
import { Button } from '../common/Button';
import { Key } from '../common/Key';
import { PaneContent } from '../panes/PaneContent';

export type InactiveKeynotePaneProps = Pick<XrayData, 'keynoteSessionIds'>;
export function InactiveKeynotePane({
  keynoteSessionIds,
}: InactiveKeynotePaneProps) {
  const user = useUser();

  const openKeynote = useCallback(() => {
    const sessionIdx =
      user.region === 'APJ' ? 1 : user.region === 'EMEA' ? 2 : 0;
    openSessionUrl(keynoteSessionIds[sessionIdx]);
  }, [keynoteSessionIds, user.region]);

  return (
    <PaneContent marginTop={1}>
      <Text>
        For this section to activate you must be watching the keynote in your
        browser.
        <Newline count={2} />
        Hit <Key>Return</Key>/<Key>Enter</Key> to open the keynote to see when
        it starts.
        <Newline count={2} />
        <Button onAction={openKeynote} focusable={true} autoFocus={true}>
          Open Keynote
        </Button>
      </Text>
    </PaneContent>
  );
}
