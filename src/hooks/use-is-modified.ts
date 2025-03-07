import { useEffect, useRef, useState } from 'react';

/**
 * Hook that tracks whether a value has been modified from its initial state
 * @param value - The value to track
 * @param defaultValue - The default value to compare against
 * @returns boolean indicating if the value has been modified from its initial state
 */
function useIsModified<T>(value: T, defaultValue: T): boolean {
  const [isModified, setIsModified] = useState(false);
  const initialValue = useRef<T>(defaultValue || value);

  useEffect(() => {
    // Use JSON.stringify for deep comparison
    const hasChanged =
      JSON.stringify(value) !== JSON.stringify(initialValue.current);
    setIsModified(hasChanged);
  }, [value]);

  return isModified;
}

export default useIsModified;
