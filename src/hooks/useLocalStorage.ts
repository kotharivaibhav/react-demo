import { useCallback, useMemo, useState } from 'react';
import { storage } from '@/utils';

type SetValue<T> = T | ((prev: T) => T);

/**
 * Syncs state with localStorage. Uses useMemo/useCallback for stable API.
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storage.get<T>(key);
    return item ?? initialValue;
  });

  const setValue = useCallback(
    (value: SetValue<T>) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        storage.set(key, next);
        return next;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    storage.remove(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return useMemo(
    () => ({ value: storedValue, setValue, removeValue }),
    [storedValue, setValue, removeValue],
  );
};
