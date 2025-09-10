
import { useEffect, useRef } from 'react';
import { storage } from '../services/storage';

/**
 * Loads a saved draft from localStorage.
 * @param key The key where the draft is stored.
 * @returns The parsed draft data, or null if not found or invalid.
 */
export const loadDraft = <T,>(key: string): T | null => {
  return storage.get<T>(key);
};

/**
 * Clears a saved draft from localStorage.
 * @param key The key of the draft to remove.
 */
export const clearDraft = (key:string) => {
  storage.remove(key);
};

/**
 * A React hook that automatically saves a component's state to localStorage.
 * It waits for a specified delay after the data changes before saving.
 * @param key The localStorage key to save the data under.
 * @param data The state data to be saved.
 * @param options Configuration options like the save delay.
 */
export const useAutosave = <T,>(
  key: string,
  data: T,
  { delay = 800 } = {}
) => {
  const timeoutRef = useRef<number | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    // Don't save on the initial mount, only on subsequent updates.
    if (!isMountedRef.current) {
        isMountedRef.current = true;
        return;
    }

    // If a save is already scheduled, cancel it.
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule a new save.
    timeoutRef.current = window.setTimeout(() => {
      storage.set(key, data);
    }, delay);

    // Cleanup function to cancel the scheduled save if the component unmounts.
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, data, delay]);
};
