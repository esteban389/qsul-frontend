import { useCallback, useEffect, useState } from 'react';

type StorageType = 'localStorage' | 'sessionStorage';

const getItem = (key: string, storageType: StorageType) => {
  if (window) {
    const item = window[storageType].getItem(key);
    return item ? JSON.parse(item, receiver) : null;
  }
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
  }, []);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function
          ? (value as (val: T) => T)(storedValue)
          : value;
      setStoredValue(valueToStore);
      setItem(key, valueToStore, storageType);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      const item = getItem(key, storageType);
      if (item !== null) {
        setStoredValue(item as T);
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storageType]);

  const removeValue = () => {
    try {
      window[storageType].removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(error);
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
    if (value?.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

export default useStorage;