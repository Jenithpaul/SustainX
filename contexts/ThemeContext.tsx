// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, ThemeType } from '../ui/ThemeProvider';

// Define the theme selection type
export type ThemePreference = 'light' | 'dark' | 'system';

// Create context type
type ThemeContextType = {
  theme: ThemePreference;
  colors: ThemeType;
  isDarkMode: boolean;
  setTheme: (theme: ThemePreference) => void;
};

// Storage key for persistence
const THEME_STORAGE_KEY = 'user_theme_preference';

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  colors: lightTheme,
  isDarkMode: false,
  setTheme: () => {},
});

// Provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemePreference>('system');

  // Determine if we're in dark mode
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  // Choose the correct theme colors
  const colors = isDarkMode ? darkTheme : lightTheme;

  // Set theme and persist selection
  const setTheme = async (newTheme: ThemePreference) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };

  // Load saved theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeState(savedTheme as ThemePreference);
        }
      } catch (error) {
        console.error('Failed to load theme', error);
      }
    };
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, colors, isDarkMode, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to access theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  // Return colors directly to match how it's used in style files
  return context.colors;
};

// If you need the full context elsewhere, create a separate hook
export const useThemeContext = () => useContext(ThemeContext);