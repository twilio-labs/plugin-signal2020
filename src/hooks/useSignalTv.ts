import { useMemo } from 'react';
import { SignalTvApiResponse } from '../types/signalTvSchedule';
import config from '../utils/config';
import { useGot } from './useApi';

function extractNormalizedSchedule(data?: SignalTvApiResponse) {
  if (typeof data == 'undefined') {
    return undefined;
  }

  return data.map((entry) => {
    let speakers = entry.talent
      .split(',')
      .map((name) => ({ name: name.trim() }));

    if (speakers.length === 1 && speakers[0].name.length === 0) {
      speakers = [];
    }

    return {
      id: entry.id,
      start_date: entry.start * 1000,
      end_date: entry.end * 1000,
      tags: entry.tags,
      title: entry.title,
      description: entry.description,
      speakers,
      url: 'https://twitch.tv/twilio',
      signalTv: true,
    };
  });
}

export function useSignalTv() {
  const apiResponse = useGot<SignalTvApiResponse>(config.signalTvSchedule);
  const signalTvSchedule = useMemo(
    () => extractNormalizedSchedule(apiResponse?.data),
    [apiResponse.data]
  );

  return { ...apiResponse, signalTvSchedule };
}
