import { useCallback, useEffect, useState } from 'react';

type StorageType = 'localStorage' | 'sessionStorage';
type StorageChangeDetail = {
  key: string;
  storageType: StorageType;
};

const STORAGE_CHANGE_EVENT = 'app-storage-change';

const getItem = (key: string, storageType: StorageType) => {
  if (typeof window !== 'undefined') {
    const item = window[storageType].getItem(key);
    return item ? JSON.parse(item, receiver) : null;
  }
  return undefined;
};

const setItem = <T>(key: string, value: T, storageType: StorageType) => {
  if (typeof window !== 'undefined') {
    window[storageType].setItem(key, JSON.stringify(value, replacer));
  }
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

  const syncStoredValue = useCallback(() => {
    try {
      const item = getItem(key, storageType);
      setStoredValue(item !== null ? (item as T) : initialValue);
    } catch {
      setStoredValue(initialValue);
    }
  }, [initialValue, key, storageType]);

  const storageListener = useCallback(
    (event: StorageEvent) => {
      if (event.key === key && event.storageArea === window[storageType]) {
        syncStoredValue();
      }
    },
    [key, storageType, syncStoredValue],
  );

  const localStorageListener = useCallback(
    (event: Event) => {
      const customEvent = event as CustomEvent<StorageChangeDetail>;

      if (
        customEvent.detail?.key === key &&
        customEvent.detail?.storageType === storageType
      ) {
        syncStoredValue();
      }
    },
    [key, storageType, syncStoredValue],
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    window.addEventListener('storage', storageListener);
    window.addEventListener(STORAGE_CHANGE_EVENT, localStorageListener);

    return () => {
      window.removeEventListener('storage', storageListener);
      window.removeEventListener(STORAGE_CHANGE_EVENT, localStorageListener);
    };
  }, [localStorageListener, storageListener]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function
          ? (value as (val: T) => T)(storedValue)
          : value;
      setStoredValue(valueToStore);
      setItem(key, valueToStore, storageType);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent<StorageChangeDetail>(STORAGE_CHANGE_EVENT, {
            detail: { key, storageType },
          }),
        );
      }
    } catch {
      /* empty */
    }
  };

  useEffect(() => {
    syncStoredValue();
  }, [syncStoredValue]);

  const removeValue = () => {
    try {
      window[storageType].removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(
        new CustomEvent<StorageChangeDetail>(STORAGE_CHANGE_EVENT, {
          detail: { key, storageType },
        }),
      );
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
    if (
      'dataType' in value &&
      value.dataType === 'Map' &&
      'value' in value &&
      Array.isArray(value.value)
    ) {
      return new Map(value.value);
    }
  }
  return value;
}

export default useStorage;
