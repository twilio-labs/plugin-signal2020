import { useEffect } from 'react';
import { format } from 'util';
import logger from '../utils/logger';

export function useLogValueChange(label: string, value: any) {
  useEffect(() => {
    const obj = { msg: format('%s changed', label), value: value };
    logger.debug(obj);
  }, [value]);
}
