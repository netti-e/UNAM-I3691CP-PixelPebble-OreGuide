// contexts/theme-context.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DARK_COLORS, THEME } from '../constants/theme';

interface ThemeContextValue {
  theme: typeof THEME;
  isDark: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEME,
  isDark: false,
  toggleDarkMode: () => {},
});

const STORAGE_KEY = '@oreguide_dark_mode';

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(val => { if (val === 'true') setIsDark(true); })
      .catch(() => {});
  }, []);

  const toggleDarkMode = () => {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, String(next)).catch(() => {});
      return next;
    });
  };

  const theme = useMemo(
    () => (isDark ? { ...THEME, colors: DARK_COLORS } : THEME),
    [isDark]
  );

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeContext);
