import { useCallback, useEffect, useState } from 'react';

type StorageType = 'localStorage' | 'sessionStorage';

const getItem = (key: string, storageType: StorageType) => {
  if (window) {
    const item = window[storageType].getItem(key);
    return item ? JSON.parse(item, receiver) : null;
  }
  return undefined;
};

const setItem = <T>(key: string, value: T, storageType: StorageType) => {
  if (window) window[storageType].setItem(key, JSON.stringify(value, replacer));
};

const useStorage = <T>(
  key: string,
  initialValue: T,
  storageType: StorageType = 'sessionStorage',
) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = getItem(key, storageType);
      return item !== null ? (item as T) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const storageListener = useCallback(
    (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(getItem(key, storageType));
      }
    },
    [key, storageType],
  );
  useEffect(() => {
    window.addEventListener('storage', storageListener);
    return () => {
      window.removeEventListener('storage', storageListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function
          ? (value as (val: T) => T)(storedValue)
          : value;
      setStoredValue(valueToStore);
      setItem(key, valueToStore, storageType);
    } catch {
      /* empty */
    }
  };

  useEffect(() => {
    try {
      const item = getItem(key, storageType);
      if (item !== null) {
        setStoredValue(item as T);
      }
    } catch {
      /* empty */
    }
  }, [key, storageType]);

  const removeValue = () => {
    try {
      window[storageType].removeItem(key);
      setStoredValue(initialValue);
    } catch {
      /* empty */
    }
  };

  return [storedValue, setValue, removeValue] as [
    T,
    typeof setValue,
    typeof removeValue,
  ];
};

function replacer(_: unknown, value: unknown) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  }
  return value;
}

function receiver(_: unknown, value: unknown) {
  if (typeof value === 'object' && value !== null) {
    if ('dataType' in value && value.dataType === 'Map' && 'value' in value && Array.isArray(value.value)) {
      return new Map(value.value);
    }
  }
  return value;
}

export default useStorage;
