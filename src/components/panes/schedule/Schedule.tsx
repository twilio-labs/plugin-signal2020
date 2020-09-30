import { Box, useInput } from 'ink';
import React, { useEffect, useMemo, useState } from 'react';
import { useScrollableList } from '../../../hooks/useScrollableList';
import { Session } from '../../../types/session';
import { openBrowserUrl, openSessionUrl } from '../../../utils/openLink';
import { groupSessionsByTypeOrDate } from '../../../utils/scheduleUtils';
import { ScheduleContent } from './ScheduleContent';
import { ScheduleTab } from './ScheduleTab';
import { SessionDetails } from './SessionDetails';

export type ScheduleProps = {
  sessions: Session[];
  calendarSessions: Session[];
  unregister: (sessionId: string) => any;
  register: (sessionId: string) => any;
};
export function Schedule({
  sessions,
  calendarSessions,
  unregister,
  register,
}: ScheduleProps) {
  const groupedSessions = useMemo(() => {
    const grouped = groupSessionsByTypeOrDate(sessions);
    return grouped;
  }, [sessions]);
  const days = Object.keys(groupedSessions).sort();
  // const [registeredSessions, setRegisteredSessions] = useState(
  // );
  const registeredSessions = useMemo(
    () => new Set(calendarSessions.map((x) => x.id)),
    [calendarSessions]
  );
  const [selectedDay, setSelectedDay] = useState(0);

  const [selectedSession, setSelectedSession] = useScrollableList(
    0,
    groupedSessions[days[selectedDay]]
  );

  const [updatingSesions, setUpdatingSessions] = useState<
    {
      id: string;
      type: 'registering' | 'unregistering';
    }[]
  >([]);

  useEffect(() => {
    if (registeredSessions) {
      setUpdatingSessions((current) => {
        return current.filter(({ id, type }) =>
          type === 'registering'
            ? !registeredSessions.has(id)
            : registeredSessions.has(id)
        );
      });
    }
  }, [registeredSessions]);

  useInput((input, key) => {
    if (key.leftArrow) {
      setSelectedSession(0);
      setSelectedDay((currentDay) => Math.max(0, currentDay - 1));
      return;
    }

    if (key.rightArrow) {
      setSelectedSession(0);
      setSelectedDay((currentDay) => Math.min(currentDay + 1, days.length - 1));
      return;
    }

    if (key.return) {
      const session = groupedSessions[days[selectedDay]][selectedSession];
      if (session.url) {
        openBrowserUrl(session.url);
      } else {
        openSessionUrl(session.id);
      }
    }

    if (input === ' ') {
      const session = groupedSessions[days[selectedDay]][selectedSession];
      if (session.canRegister) {
        if (registeredSessions.has(session.id)) {
          setUpdatingSessions((current) => [
            ...current,
            { id: session.id, type: 'unregistering' },
          ]),
            unregister(session.id);
        } else {
          setUpdatingSessions((current) => [
            ...current,
            { id: session.id, type: 'registering' },
          ]),
            register(session.id);
        }
      }
    }
  });

  const selectedSessionInstance =
    groupedSessions[days[selectedDay]][selectedSession];
  return (
    <>
      <Box flexDirection="column" flexGrow={1} justifyContent="flex-start">
        <Box
          flexDirection="row"
          justifyContent="space-around"
          paddingLeft={4}
          paddingRight={4}
        >
          {days.map((day) => (
            <ScheduleTab
              key={day}
              day={day}
              active={days[selectedDay] === day}
            />
          ))}
        </Box>
        <Box flexGrow={1} flexShrink={1}>
          <ScheduleContent
            sessions={groupedSessions[days[selectedDay]]}
            activeSessionIdx={selectedSession}
            registeredSessions={registeredSessions}
          />
        </Box>
        <Box height={10}>
          <SessionDetails
            session={selectedSessionInstance}
            registered={registeredSessions.has(selectedSessionInstance.id)}
            updating={updatingSesions.find(
              (x) => x.id === selectedSessionInstance.id
            )}
          />
        </Box>
      </Box>
    </>
  );
}
