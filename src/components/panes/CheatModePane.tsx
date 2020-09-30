import { DeployResult } from '@twilio-labs/serverless-api';
import { useMachine } from '@xstate/react';
import clipboardy from 'clipboardy';
import got from 'got';
import { Box, Text, useInput } from 'ink';
import React, { useCallback, useEffect } from 'react';
import { Except } from 'type-fest';
import { v4 as uuid } from 'uuid';
import { assign, DoneInvokeEvent } from 'xstate';
import { useMode } from '../../context/mode';
import { useUser } from '../../context/user';
import {
  CheatModeEvents,
  cheatModeMachine,
  CheatModeMachineContext,
  CheatModeMachineDeployEvent,
  CheatModeMachineRequestEvent,
  CheatModeMachineUpdateEvent,
} from '../../machines/cheatModeMachine';
import { ModeEvents } from '../../machines/modeMachine';
import { ChatMessage } from '../../types/chatMessages';
import { SHOW_CHEATMODE } from '../../utils/breakpoints';
import { cheatModeApiQuery, TwimlResult } from '../../utils/cheatModeApi';
import config from '../../utils/config';
import { deployTwimlApp } from '../../utils/deployTwimlApp';
import defaultLogger from '../../utils/logger';
import { ChatWindow } from '../chat/ChatWindow';
import { Bold } from '../common/Bold';
import { Button } from '../common/Button';
import { Key } from '../common/Key';
import { LoadingIndicator } from '../common/LoadingIndicator';
import { VerticalSpacer } from '../common/VerticalSpacer';
import { Pane } from './Pane';
import { PaneContent } from './PaneContent';

const logger = defaultLogger.child({ module: 'CheatModePane' });

type CheatModeApiModeResponse = {
  enabled: boolean;
  mode: string;
};

function createMessageEntry(msg: Except<ChatMessage, 'id'>): ChatMessage {
  return {
    ...msg,
    id: uuid(),
  };
}

function deployApp(
  context: CheatModeMachineContext,
  event: CheatModeMachineDeployEvent
) {
  if (!context.latestTwiml || !context.username || !context.password) {
    return;
  }

  return deployTwimlApp(
    context.latestTwiml,
    context.username,
    context.password,
    (msg: string) => {
      event.dispatch({ type: CheatModeEvents.UPDATE, data: msg });
    }
  );
}

async function requestTwiml(context: CheatModeMachineContext) {
  if (!context.currentRequest) {
    const error = new Error('invalid state transition');
    logger.error({ msg: 'invalid state transition', context, error });
    throw error;
  }

  return cheatModeApiQuery(context.currentRequest).then((resp) => {
    return resp.twiml;
  });
}

function contextHasValidTwiml(context: CheatModeMachineContext) {
  return (
    typeof context.latestTwiml === 'string' && context.latestTwiml.length > 0
  );
}

function canDeploy(context: CheatModeMachineContext): boolean {
  return (
    !!context.username && !!context.password && contextHasValidTwiml(context)
  );
}

const addRequestMessage = assign<
  CheatModeMachineContext,
  CheatModeMachineRequestEvent
>({
  currentRequest: (_, event) => event.data,
  messages: (context, event) => {
    return [
      ...context.messages,
      createMessageEntry({ author: 'You', content: event.data }),
      createMessageEntry({
        author: null,
        content: <LoadingIndicator text={'waiting for response'} />,
      }),
    ];
  },
});

const addErrorMessage = assign<CheatModeMachineContext, DoneInvokeEvent<Error>>(
  {
    errors: (context, event) => [...context.errors, event.data],
    messages: (context) => [
      ...context.messages,
      createMessageEntry({
        author: 'Error',
        content: 'Oh no something went wrong. Please try again later.',
      }),
    ],
  }
);

const addTwimlResult = assign<
  CheatModeMachineContext,
  DoneInvokeEvent<TwimlResult>
>({
  messages: (context, event) => {
    const newContentMessage = createMessageEntry({
      author: 'The Cloud',
      content: `Here's your app:`,
    });
    const twimlMessages = event.data.twiml.split('\r\n').map((line) => {
      const fixedSpacingLine = line.split('\t').join('  ');
      return createMessageEntry({
        author: null,
        content: <Text color="redBright">{fixedSpacingLine}</Text>,
      });
    });
    return [
      ...context.messages.slice(0, context.messages.length - 1),
      newContentMessage,
      ...twimlMessages,
    ];
  },
  latestTwiml: (_, event) => event.data.twiml,
});

const addDeployResult = assign<
  CheatModeMachineContext,
  { type: string; data: DeployResult }
>({
  latestDeploymentInfo: (_, event) => event.data,
  messages: (context, event) => [
    ...context.messages,
    createMessageEntry({
      author: 'Twilio',
      content: `Deployed at https://${event.data.domain}/`,
    }),
  ],
});

const handleUpdateMessage = assign<
  CheatModeMachineContext,
  CheatModeMachineUpdateEvent
>({
  messages: (context, event) => [
    ...context.messages,
    createMessageEntry({
      author: 'Twilio',
      content: event.data,
    }),
  ],
});

async function isCheatModeActive() {
  try {
    const resp = await got(`${config.cheatModeApi}/mode`, {
      responseType: 'json',
    });
    const body = resp.body as CheatModeApiModeResponse;
    return body.enabled;
  } catch (err) {
    return false;
  }
}

const fallbackCheatmode = (
  <Text>
    Your terminal is too small to support the best experience for cheat mode.
    Try hiding the sidebar using <Key>Ctrl</Key>+<Key>b</Key> or increase the
    size of your terminal until this message disappears.
  </Text>
);

export const CheatModePane = () => {
  const { dispatch: modeDispatch } = useMode();
  const user = useUser();

  const [state, dispatch] = useMachine(cheatModeMachine, {
    context: {
      latestDeploymentInfo: undefined,
      currentRequest: undefined,
      latestTwiml: undefined,
      messages: [],
      errors: [],
      username: user.twilioUsername,
      password: user.twilioPassword,
    },
    services: {
      fetchResult: requestTwiml,
      deployResult: deployApp,
    },
    actions: {
      addRequestMessage: addRequestMessage,
      addTwimlResult: addTwimlResult,
      addErrorMessage: addErrorMessage,
      addDeployResult: addDeployResult,
      handleUpdateMessage: handleUpdateMessage,
    },
    guards: {
      canDeploy: canDeploy,
    },
  });

  const deploy = useCallback(() => {
    dispatch({ type: 'DEPLOY', dispatch } as CheatModeMachineDeployEvent);
  }, [user, dispatch]);

  const back = useCallback(() => {
    modeDispatch({ type: ModeEvents.exitCheatMode });
  }, []);

  const copy = useCallback(() => {
    const twimlContent = state.context.latestTwiml;
    if (twimlContent) {
      clipboardy.writeSync(twimlContent);
    }
  }, [state.context]);

  const onSend = (text: string) => {
    dispatch({
      type: CheatModeEvents.REQUEST,
      data: text,
    } as CheatModeMachineRequestEvent);
  };

  useEffect(() => {
    isCheatModeActive().then((active) => {
      if (active) {
        dispatch(CheatModeEvents.ACTIVATE);
      } else {
        modeDispatch({ type: ModeEvents.enableInput });
        dispatch(CheatModeEvents.DEACTIVATE);
      }
    });
  }, []);

  useInput((input, key) => {
    if (key.ctrl && input.toLowerCase() === 'b') {
      modeDispatch({ type: ModeEvents.toggleSideBar });
    }

    if (key.ctrl && input.toLowerCase() === 'd') {
      dispatch(CheatModeEvents.DEACTIVATE);
      modeDispatch({ type: ModeEvents.exitCheatMode });
    }
  });

  const hasTwimlResult = !!state.context.latestTwiml;
  const canDeployResult = canDeploy(state.context) && state.matches('idle');
  const Footer = (
    <Box padding={1} paddingRight={0} paddingLeft={0}>
      <Button
        onAction={deploy}
        focusable={canDeployResult}
        dimColor={!canDeployResult}
      >
        Deploy App
      </Button>
      <VerticalSpacer />
      <Button
        onAction={copy}
        focusable={hasTwimlResult}
        dimColor={!hasTwimlResult}
      >
        Copy TwiML
      </Button>
      <VerticalSpacer />
      <Button onAction={back}>Back To Welcome</Button>
    </Box>
  );

  const activeContent = (
    <>
      <Box flexDirection="column" paddingLeft={2} paddingRight={2}>
        <Bold>Welcome to the hidden world of the SIGNAL Developer Mode</Bold>
        <Text>
          In this section you'll be able to harness the power of the cloud to
          generate apps with just your thoughts (and writing them down).
        </Text>
        <Text>
          Tell us what you want to build and we'll send you the code. Afterwards
          you can deploy the app directly to your Twilio account.
        </Text>
        <Text>
          Use the <Key>Tab</Key> and <Key>Return</Key>/<Key>Enter</Key> keys to
          navigate between the functionality in this realm.
        </Text>
      </Box>
      <ChatWindow
        footer={Footer}
        onSend={onSend}
        messages={state.context.messages}
        prompt="What should your app do?"
        placeholder="Generate a twilio app that..."
        active={state.matches('idle')}
      />
    </>
  );

  const offlineContent = (
    <>
      <Bold>Congratulations on finding the hidden Cheat Mode!</Bold>
      <Text>
        This section of the Developer Mode is only active during certain times
        during and shortly after the Keynote. Please return during those times.
        Thank you!
      </Text>
    </>
  );

  const loadingContent = <LoadingIndicator text="Loading Cheat Mode..." />;

  let content;
  switch (true) {
    case state.matches('loading'):
      content = loadingContent;
      break;
    case state.matches('off'):
      content = offlineContent;
      break;
    default:
      content = activeContent;
      break;
  }

  return (
    <Pane headline="Cheat Mode">
      <PaneContent breakpoint={SHOW_CHEATMODE} fallback={fallbackCheatmode}>
        {content}
      </PaneContent>
    </Pane>
  );
};
