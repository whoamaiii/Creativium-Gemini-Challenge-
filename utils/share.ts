import { copyText } from './clipboard';

/**
 * Builds a shareable deep link to the reports page with an ID.
 * @param id A unique identifier for the report being viewed.
 * @returns The full URL string.
 */
export const buildReportLink = (id: string): string => {
  return `${location.origin}${location.pathname}#/reports?id=${encodeURIComponent(id)}`;
};

/**
 * Tries to use the Web Share API, falling back to copying text to the clipboard.
 * @param opts The data to share (title, text, url).
 * @returns A promise that resolves to true if the action was likely successful.
 */
export async function shareOrCopy(opts: { title?: string; text?: string; url?: string }): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(opts);
      return true;
    } catch (err) {
      if ((err as DOMException).name === 'AbortError') {
        return false;
      }
      console.error('Web Share API failed:', err);
    }
  }
  
  const str = opts.url || opts.text || '';
  if (!str) return false;
  return copyText(str);
}
