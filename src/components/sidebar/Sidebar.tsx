import format from 'date-fns/format';
import { Box, Text } from 'ink';
import ms from 'ms';
import React, { useEffect, useState } from 'react';
import { useMode } from '../../context/mode';
import { useUser } from '../../context/user';
import { useResponsiveWindowSize } from '../../hooks/useResize';
import { Bold } from '../common/Bold';
import { Avatar } from '../graphics/Avatar';
import { MissingAvatar } from '../graphics/MissingAvatar';
import { Controls } from './Controls';
import { NextUpSection } from './NextUpSection';

export function Sidebar() {
  const { width: totalWidth, height: totalHeight } = useResponsiveWindowSize();
  const { name, heroImage } = useUser();
  const { state } = useMode();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, ms('1m'));

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  if (state.matches('sideBar.hidden')) {
    return null;
  }

  return (
    <Box width={40} borderStyle="single" flexDirection="column">
      <Box
        padding={1}
        flexDirection="column"
        height={5}
        minHeight={5}
        flexShrink={0}
      >
        <Bold>Welcome to SIGNAL 2020, {name}!</Bold>
        <Text>Current Time: {format(currentTime, 'HH:mm')}</Text>
        {process.env.DEBUG_SIGNAL && (
          <Bold>
            w: {totalWidth} h: {totalHeight}
          </Bold>
        )}
      </Box>
      {heroImage ? (
        <Avatar imageBuffer={heroImage} />
      ) : heroImage === null ? (
        <MissingAvatar />
      ) : (
        <Box height={17} />
      )}
      <NextUpSection />
      <Controls />
    </Box>
  );
}
