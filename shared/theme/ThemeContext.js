import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES, createShadows } from './theme';

const THEME_STORAGE_KEY = '@kaamdost_theme_id';

export const ThemeContext = createContext({
  themeId: 'light_navy',
  theme: THEMES.light_navy,
  shadows: createShadows(THEMES.light_navy.shadowColor),
  setThemeId: () => {},
  switchTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [themeId, setThemeIdState] = useState('light_navy');

  useEffect(() => {
    // Load persisted theme on mount
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved && THEMES[saved]) {
          setThemeIdState(saved);
        }
      } catch (err) {
        console.warn('Failed to load saved theme:', err);
      }
    })();
  }, []);

  const switchTheme = async (newThemeId) => {
    if (THEMES[newThemeId]) {
      setThemeIdState(newThemeId);
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeId);
      } catch (err) {
        console.warn('Failed to persist theme:', err);
      }
    }
  };

  const currentTheme = THEMES[themeId] || THEMES.light_navy;
  const currentShadows = createShadows(currentTheme.shadowColor);

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme: currentTheme,
        shadows: currentShadows,
        setThemeId: switchTheme,
        switchTheme,
        THEMES
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if rendered outside ThemeProvider
    return {
      themeId: 'light_navy',
      theme: THEMES.light_navy,
      shadows: createShadows(THEMES.light_navy.shadowColor),
      setThemeId: () => {},
      switchTheme: () => {},
      THEMES
    };
  }
  return context;
}
