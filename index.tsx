import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Dev probe to verify CSS variables are loaded. This helps catch regressions.
if (process.env.NODE_ENV !== 'production') {
  // Defer the check to the next event loop cycle to ensure CSS has been parsed.
  setTimeout(() => {
    const css = getComputedStyle(document.documentElement);
    const vals = ['--bg', '--surface', '--card', '--text'].map(k => [k, css.getPropertyValue(k).trim()]);
    const missing = vals.filter(([, v]) => !v);
    
    console.log('[theme]', 'data-theme=', document.documentElement.dataset.theme, 'vars=', Object.fromEntries(vals));
    
    if (missing.length) {
      console.warn('[theme] Missing CSS variables:', missing.map(([k]) => k).join(', '));
    }
  }, 0);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);