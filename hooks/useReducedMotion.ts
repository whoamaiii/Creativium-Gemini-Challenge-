import { useState, useEffect } from 'react';

const query = '(prefers-reduced-motion: reduce)';

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia(query).matches;
};

const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialState);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
};

export default useReducedMotion;
