import { useUser } from '../context/user';
import defaultLogger from '../utils/logger';
import { KeynoteInfo } from './useKeynoteInfo';
import { useSyncDocument } from './useSyncClient';

const logger = defaultLogger.child({ module: 'useKeynoteTime' });

export type KeynoteSyncValue = {
  active: boolean;
  seconds: number;
};

export function useKeynoteTime(
  keynoteInfo: KeynoteInfo
): KeynoteSyncValue | null {
  const user = useUser();
  const sessionIdx = user.region === 'APJ' ? 1 : user.region === 'EMEA' ? 2 : 0;
  const sessionId = keynoteInfo.data?.xray.keynoteSessionIds[sessionIdx];
  const documentId = sessionId ? `${sessionId}.${user.id}` : undefined;

  const { value, error } = useSyncDocument<KeynoteSyncValue>(
    documentId,
    user.syncToken
  );

  if (error) {
    logger.error(error);
  }

  return value;
}
