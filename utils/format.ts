/**
 * Formats an ISO date string into a more readable local format.
 * @param isoString The date string to format.
 * @returns A formatted string like "Jul 20, 2024, 2:30 PM".
 */
export const formatDateTime = (isoString: string): string => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(isoString));
  } catch (e) {
    return 'Invalid Date';
  }
};

/**
 * Formats an ISO date string into a short date format.
 * @param isoString The date string to format.
 * @returns A formatted string like "7/20/2024".
 */
export const formatDate = (isoString: string): string => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(isoString));
    } catch (e) {
      return 'Invalid Date';
    }
  };