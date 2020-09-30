import { useQuery } from '@apollo/client';
import ms from 'ms';
import React, { useEffect, useState } from 'react';
import { refreshToken } from '../api/login';
import { useTerminalInfo } from '../hooks/useTerminalInfo';
import { UserProfileQuery } from '../queries/user';
import { setAuthToken } from '../utils/graphqlClient';
import { urlToBuffer } from '../utils/urlToBuffer';

export type User = {
  id: string;
  name: string;
  accountSid?: string | null;
  twilioUsername?: string | null;
  twilioPassword?: string | null;
  heroImage?: Buffer | null;
  refreshToken?: string;
  region: 'Americas' | 'EMEA' | 'APJ';
  syncToken?: string;
};

const defaultUser: User = {
  id: '',
  name: 'Operator',
  accountSid: 'ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  twilioUsername: null,
  twilioPassword: null,
  heroImage: undefined,
  refreshToken: undefined,
  region: 'Americas',
  syncToken: undefined,
};

const UserContext = React.createContext<User>(defaultUser);

export const useUser = () => React.useContext(UserContext);

export type UserProviderProps = {
  defaultValue?: Partial<User>;
};

export const UserProvider: React.FC<UserProviderProps> = ({
  defaultValue,
  children,
}) => {
  const [value, setValue] = useState<User>({ ...defaultUser, ...defaultValue });
  const { data } = useQuery(UserProfileQuery);
  const { isGitBash } = useTerminalInfo();
  const noColors = process.env.FORCE_COLOR === '0';

  useEffect(() => {
    (async () => {
      if (data && data.getProfile) {
        const heroImage = isGitBash
          ? undefined
          : noColors
          ? null
          : await urlToBuffer(data.getProfile.hero_url);
        setValue((currentValue) => {
          return {
            ...currentValue,
            id: data.getProfile.id,
            name: data.getProfile.first_name,
            heroImage: heroImage,
            region: data.getProfile.region,
            syncToken: data.getProfile.sync_token || undefined,
            profile: { ...data.getProfile },
          };
        });
      }
    })();
  }, [data]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (value.refreshToken) {
        const newAuthToken = await refreshToken(value.refreshToken);
        setAuthToken(newAuthToken);
      }
    }, ms('12h'));

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  });

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
