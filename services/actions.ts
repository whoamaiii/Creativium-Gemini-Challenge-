import { copyText } from '../utils/clipboard';
import { toastService } from './toast';

export async function onCopy(text: string, successMessage = 'Copied to clipboard') {
  const ok = await copyText(text);
  toastService.show(ok ? successMessage : 'Copy failed');
}

export function onDownloadPDF(sessionId: string) {
  toastService.show('Opening print dialog…');
  // Navigate to the dedicated print page, which will trigger the print dialog
  window.location.hash = `#/print?id=${sessionId}`;
}

export async function onShare(url: string, text?: string) {
  try {
    if (navigator.share) {
      await navigator.share({ url, text, title: 'Kreativium Session Insight' });
      return;
    }
  } catch (err) {
    if ((err as DOMException).name === 'AbortError') return; // User cancelled
    console.error('Web Share API failed:', err);
  }
  // Fallback to copying the link
  const ok = await copyText(url);
  toastService.show(ok ? 'Link copied to clipboard' : 'Unable to share or copy link');
}
