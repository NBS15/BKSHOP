import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'corporate';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'corporate' ? 'dark' : 'corporate';
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  return { theme, toggleTheme };
}
