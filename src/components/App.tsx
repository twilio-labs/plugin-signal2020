import { ApolloProvider } from '@apollo/client';
import { Box, render as renderApp, Text } from 'ink';
import useStdoutDimensions from 'ink-use-stdout-dimensions';
import React from 'react';
import { ModeProvider } from '../context/mode';
import { User, UserProvider } from '../context/user';
import { SHOW_APP } from '../utils/breakpoints';
import { client } from '../utils/graphqlClient';
import { Bold } from './common/Bold';
import { ITermWarning } from './dialogs/ITermWarning';
import { CheckUpdateAvailable } from './dialogs/UpdateNotice';
import { RenderIfWindowSize } from './media-breakpoints/RenderIfWindowSize';
import { ModeSwitcher } from './ModeSwitcher';
import { MainPane } from './panes/MainPane';
import { Sidebar } from './sidebar/Sidebar';

type AppProps = {
  user: Partial<User>;
};
export function App({ user }: AppProps) {
  const [columns, rows] = useStdoutDimensions();

  const appFallbackMessage = (
    <Box
      flexDirection="column"
      height={rows}
      width={columns}
      justifyContent="center"
      alignItems="center"
    >
      <Box width="50%" minWidth={30} flexDirection="column">
        <Bold>Thanks for entering SIGNAL Developer Mode.</Bold>
        <Text>
          Developer Mode will automatically adapt to your terminal window size
          but requires a certain minimum height to work well. Please either
          increase the size of your window or reduce the text size of your
          terminal.
        </Text>
      </Box>
    </Box>
  );

  return (
    <ApolloProvider client={client()}>
      <UserProvider defaultValue={user}>
        <ModeProvider>
          <ModeSwitcher />
          <RenderIfWindowSize {...SHOW_APP} fallback={appFallbackMessage}>
            <Box
              flexDirection="column"
              height={rows}
              width={columns}
              padding={1}
            >
              <CheckUpdateAvailable />
              <ITermWarning />
              <Box flexDirection="row" width="100%" flexGrow={1}>
                <Sidebar />
                <MainPane />
              </Box>
            </Box>
          </RenderIfWindowSize>
        </ModeProvider>
      </UserProvider>
    </ApolloProvider>
  );
}

export const render = async (
  {
    name,
    accountSid,
    twilioUsername,
    twilioPassword,
    refreshToken,
  }: Partial<User>,
  debug = false
) => {
  process.title = 'SIGNAL Developer Mode';
  if (!debug) {
    const enterAltScreenCommand = '\x1b[?1049h';
    process.stdout.write(enterAltScreenCommand);
  }
  const { waitUntilExit } = renderApp(
    <App
      user={{ name, accountSid, twilioUsername, twilioPassword, refreshToken }}
    />,
    {
      debug: debug,
    }
  );

  await waitUntilExit();
  process.exit(0);
};
