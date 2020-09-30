import { Text, useInput } from 'ink';
import React from 'react';
import { useScrollableList } from '../../hooks/useScrollableList';
import { openBrowserUrl } from '../../utils/openLink';
import { ListSelector } from '../common/ListSelector';
import { ScrollableItemList } from '../scrollable/ScrollableItemList';
import { Pane } from './Pane';
import { PaneContent } from './PaneContent';

const RESOURCES = [
  {
    key: 'twilio',
    name: 'Twilio',
    url: 'https://www.twilio.com',
    description: 'Visit the Twilio Website.',
  },
  {
    key: 'tq',
    name: 'TwilioQuest',
    url: 'https://www.twilio.com/quest',
    description: `Twilio's video game to teach you coding.`,
  },
  {
    key: 'signal',
    name: 'SIGNAL Website',
    url: 'https://www.twilio.com/signal',
    description: 'View live and on-demand SIGNAL 2020 sessions.',
  },
  {
    key: 'codeexchange',
    name: 'Twilio CodeExchange',
    url: 'https://www.twilio.com/code-exchange',
    description: 'Find code for various use cases you can build with Twilio.',
  },
  {
    key: 'signal-tv',
    name: 'SIGNAL TV',
    url: 'https://twitch.tv/twilio',
    description: 'Watch live coverage of SIGNAL 2020.',
  },
  {
    key: 'twilio-docs',
    name: 'Twilio Docs',
    url: 'https://www.twilio.com/docs',
    description: 'Find the documentation to all of our Twilio products.',
  },
  {
    key: 'dev-mode-introduction',
    name: 'SIGNAL Developer Mode',
    url: 'https://www.twilio.com/blog/signal-developer-mode',
    description: 'Read more on how to use SIGNAL Developer Mode',
  },
  {
    key: 'troubleshooting',
    name: 'SIGNAL Developer Mode Troubleshooting',
    url:
      'https://github.com/twilio-labs/plugin-signal2020/blob/main/docs/TROUBLESHOOTING.md',
    description: 'Read our troubleshooting guide for SIGNAL Developer Mode',
  },
  {
    key: 'how-its-built',
    name: 'How we built a CLI for a conference',
    url: 'https://www.twilio.com/blog/building-conference-cli-in-react',
    description: 'Learn how we built the SIGNAL Developer Mode using React',
  },
  {
    key: 'source-code',
    name: 'Developer Mode Source Code',
    url: 'https://github.com/twilio-labs/plugin-signal2020',
    description:
      'View the source and general documentation of SIGNAL Developer Mode',
  },
];

type ResourceRowProps = {
  name: string;
  description: string;
  active?: boolean;
};
function ResourceRow({ name, description, active }: ResourceRowProps) {
  return (
    <Text wrap="truncate-end">
      <ListSelector active={active} />
      <Text>
        <Text bold>{name}</Text> <Text dimColor>| {description}</Text>
      </Text>
    </Text>
  );
}

export function ResourcePane() {
  const resources = RESOURCES;
  const [activeEntry] = useScrollableList(0, resources);

  useInput((input, key) => {
    if (resources[activeEntry] && resources[activeEntry].url) {
      if (key.return) {
        openBrowserUrl(RESOURCES[activeEntry].url);
      }
    }
  });
  return (
    <Pane headline="Resources">
      <PaneContent>
        <ScrollableItemList activeIdx={activeEntry}>
          {RESOURCES.map((res, idx) => {
            return (
              <ResourceRow
                key={res.key}
                name={res.name}
                description={res.description}
                active={idx === activeEntry}
              />
            );
          })}
        </ScrollableItemList>
      </PaneContent>
    </Pane>
  );
}
