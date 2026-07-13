import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = 'mana_portal_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(
    () => (localStorage.getItem(STORAGE_KEY) as ThemePreference) || 'system'
  );

  useEffect(() => {
    const root = document.documentElement;

    const updateTheme = () => {
      const isDark =
        preference === 'dark' ||
        (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      if (preference === 'system') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', preference);
      }
    };

    updateTheme();

    if (preference === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [preference]);

  const setPreference = (p: ThemePreference) => setPreferenceState(p);

  return <ThemeContext.Provider value={{ preference, setPreference }}>{children}</ThemeContext.Provider>;
}

export function useThemePreference() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemePreference must be used within ThemeProvider');
  return ctx;
}
