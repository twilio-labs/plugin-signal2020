import { useEffect, useState } from 'react';

export function useCounter(increments = 1000, interval = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((c) => c + increments);
    }, interval);
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);
  return count;
}
