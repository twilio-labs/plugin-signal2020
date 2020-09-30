import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import {
  RegisterForSessionQuery,
  SessionsQuery,
  UnregisterForSessionQuery,
} from '../queries/calendar';
import { Session } from '../types/session';
import { useSignalTv } from './useSignalTv';

export function useCalendar() {
  const { signalTvSchedule } = useSignalTv();
  const { data, error, loading } = useQuery(SessionsQuery);

  const joinedSessions = useMemo(() => {
    let sessions: Session[] = [];
    if (data && Array.isArray(data.getPublicSessions)) {
      sessions = [...sessions, ...data.getPublicSessions];
    }
    if (Array.isArray(signalTvSchedule)) {
      sessions = [...sessions, ...signalTvSchedule];
    }
    return sessions;
  }, [data, signalTvSchedule]);

  const [registerMutation] = useMutation(RegisterForSessionQuery, {});
  const [unregisterMutation] = useMutation(UnregisterForSessionQuery, {});

  const register = useCallback(
    (sessionId) =>
      registerMutation({
        variables: { sessionId },
        refetchQueries: [{ query: SessionsQuery }],
      }),
    [registerMutation]
  );
  const unregister = useCallback(
    (sessionId) =>
      unregisterMutation({
        variables: { sessionId },
        refetchQueries: [{ query: SessionsQuery }],
      }),
    [unregisterMutation]
  );

  return {
    unregister,
    register,
    error,
    loading,
    data,
    joinedSessions,
    calendar: data?.getAttendeeCalendar,
  };
}
