import { useCallback, useEffect, useMemo, useState } from 'react';
import Client, { SyncDocument } from 'twilio-sync';
import defaultLogger from '../utils/logger';

function getClient(accessToken?: string) {
  const logger = defaultLogger.child({
    module: 'useSyncClient/getClient',
  });
  if (!accessToken) {
    logger.debug('no sync access token yet');
    return null;
  }
  logger.debug({ msg: 'received access token', accessToken });
  return new Client(accessToken, {});
}

export function useSyncClient(accessToken?: string) {
  const syncClient = useMemo(() => getClient(accessToken), [accessToken]);
  return syncClient;
}

export type UseSyncDocumentResult<T> = {
  syncClient: Client | null;
  value: T | null;
  error: null | Error;
};

export function useSyncDocument<T>(
  documentId?: string,
  accessToken?: string
): UseSyncDocumentResult<T> {
  const logger = defaultLogger.child({
    module: 'useSyncClient/useSyncDocument',
  });
  const [value, setValue] = useState<T | null>(null);
  const [syncDoc, setSyncDoc] = useState<SyncDocument | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const syncClient = useSyncClient(accessToken);

  const updateCallback = useCallback((data) => {
    logger.debug({
      msg: 'document update',
      data: data.value,
      isLocal: data.isLocal,
    });
    setValue(data.value as T);
  }, []);

  const removedCallback = useCallback((data) => {
    logger.debug({
      msg: 'document removed',
      isLocal: data.isLocal,
    });
    if (!data.isLocal) {
      logger.debug('resetting doc value to null');
      setValue(null as T);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (syncDoc) {
        logger.debug({ msg: 'clean up document handlers' });
        syncDoc.off('updated', updateCallback);
        syncDoc.off('removed', removedCallback);
      }
    };
  }, []);

  useEffect(() => {
    if (syncClient && documentId && !syncDoc) {
      logger.debug({ msg: 'fetching document', documentId });
      syncClient
        .document(documentId)
        .then((doc) => {
          doc.on('updated', updateCallback);
          doc.on('removed', removedCallback);
          setSyncDoc(doc);
          logger.debug({ msg: 'received initial document', data: doc.value });
          setValue(doc.value as T);
        })
        .catch((err) => setError(err));
    }
  }, [syncClient, documentId]);

  return { value, syncClient, error };
}
