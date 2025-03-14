import { useState, useEffect, useCallback } from 'react';
import { Theme } from '../types';

/**
 * Custom hook for theme management
 * @param storageKey Key to use for localStorage
 * @param defaultTheme Default theme to use if none is stored
 */
export const useTheme = (storageKey = 'app-theme', defaultTheme: Theme = 'system') => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Load saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, [storageKey]);

  // Apply theme to body for global theming
  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme', 'system-theme');
    document.body.classList.add(`${theme}-theme`);

    // Store preference
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'light';
      
      // If system, check system preference and toggle to opposite
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'light' : 'dark';
    });
  }, []);

  // Set theme directly
  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  return { theme, setTheme, toggleTheme, handleThemeChange };
};

export default useTheme; 