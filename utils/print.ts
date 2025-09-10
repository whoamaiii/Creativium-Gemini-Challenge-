
/**
 * Triggers the browser's print dialog.
 * It adds a data-attribute to the html element to allow print-specific CSS to be applied,
 * then removes it after printing is complete.
 */
export const applyPrintMode = () => {
  const html = document.documentElement;
  html.setAttribute("data-print", "true");

  // Give the browser a moment to apply the print styles before opening the print dialog.
  setTimeout(() => {
    window.print();
    
    // The 'afterprint' event is the most reliable way to clean up.
    const handleAfterPrint = () => {
      html.removeAttribute("data-print");
      window.removeEventListener('afterprint', handleAfterPrint);
    };
    window.addEventListener('afterprint', handleAfterPrint);

    // Fallback for browsers that might not fire the event consistently.
    setTimeout(() => {
        html.removeAttribute("data-print");
    }, 1000);
  }, 100);
};
