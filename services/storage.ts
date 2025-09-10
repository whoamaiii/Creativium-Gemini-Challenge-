// A simple wrapper around localStorage for consistent, type-safe access.

export const storage = {
  /**
   * Retrieves an item from localStorage and parses it as JSON.
   * @param key The key of the item to retrieve.
   * @returns The parsed data, or null if the item doesn't exist or there's a parsing error.
   */
  get: <T>(key: string): T | null => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error getting item "${key}" from localStorage:`, error);
      return null;
    }
  },

  /**
   * Stores an item in localStorage after converting it to a JSON string.
   * @param key The key under which to store the item.
   * @param value The value to store. Can be any JSON-serializable type.
   */
  set: <T>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting item "${key}" in localStorage:`, error);
    }
  },

  /**
   * Removes an item from localStorage.
   * @param key The key of the item to remove.
   */
  remove: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item "${key}" from localStorage:`, error);
    }
  },

  /**
   * Clears all items from localStorage.
   */
  clear: (): void => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};
