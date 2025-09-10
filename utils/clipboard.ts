/**
 * Copies a string of text to the user's clipboard using the modern Clipboard API with a fallback.
 * @param text The text to copy.
 * @returns A promise that resolves to true if successful, false otherwise.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    // Modern way: Use the Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.error("Clipboard API failed:", err);
    // Fallback below
  }

  // Fallback for older browsers or insecure contexts
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.width = '2em';
    ta.style.height = '2em';
    ta.style.padding = '0';
    ta.style.border = 'none';
    ta.style.outline = 'none';
    ta.style.boxShadow = 'none';
    ta.style.background = 'transparent';
    
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(ta);
    return successful;
  } catch (err) {
    console.error("Fallback copy failed:", err);
    return false;
  }
}
