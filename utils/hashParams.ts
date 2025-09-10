/**
 * Reads the current URL hash, removing the leading '#'.
 * @returns The hash path, e.g., "/reports?id=123"
 */
export const readHash = (): string => {
  return window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;
};

/**
 * Parses the query parameters from the URL hash.
 * @returns A URLSearchParams object for easy access to hash query params.
 */
export const parseHashSearch = (): URLSearchParams => {
  const hash = readHash();
  const queryString = hash.split('?')[1] || '';
  return new URLSearchParams(queryString);
};
