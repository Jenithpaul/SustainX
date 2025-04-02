// ui/ThemeProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useColorScheme } from "react-native";

/**
 * ThemeType defines the color properties used across the app.
 */
export type ThemeType = {
  background: string;             // General background color
  backgroundPrimary: string;      // Primary background (cards, inputs, etc.)
  backgroundSecondary: string;    // Secondary background (headers, banners, etc.)
  banner: {
    background: string;
    title: string;
    subtitle: string;
    button: string;
    buttonText: string;
  };
  text: string;                   // Default text color
  textPrimary: string;            // Primary text color (headings)
  textSecondary: string;          // Secondary text color (subtle text)
  textOnPrimary: string;          // Text color used on primary surfaces
  primary: string;                // Main brand color (green) for dark mode
  accent: string;                 // Accent color
  border: string;                 // Border color for dividers
  cardBackground: string;         // Background for cards
  sortBackground: string;         // Background for sort/filter elements
  inputBackground: string;        // Background for input fields
  header: {
    border: string;
    text: string;
  };
  optionButton: {
    background: string;
    label: string;
    iconContainer: string;
  };
  primaryLight: string;           // Lighter variant of the primary color
  actionIcons: {
    sunny: string;
    moon: string;
    phone: string;
  };
  switch: {
    track: {
      inactive: string;
      active: string;
    };
    thumb: {
      inactive: string;
      active: string;
    };
  };
  // Adding missing properties used in ProfilePageStyle.ts
  error: string;                  // For error text/icons
  errorBackground: string;        // Background for error states
};

/**
 * LIGHT THEME
 * Using your previous light theme values.
 */
export const lightTheme: ThemeType = {
  background: "#F9F9F9",
  backgroundPrimary: "#FFFFFF",
  backgroundSecondary: "#F5F5F5",
  banner: {
    background: "#E8F5E9",
    title: "#2E7D32",
    subtitle: "#4A4A4A",
    button: "#43A047",
    buttonText: "#FFFFFF",
  },
  text: "#1E293B",
  textPrimary: "#111827",
  textSecondary: "#64748B",
  textOnPrimary: "#FFFFFF",
  primary: "#4CAF50",
  accent: "#10B981",
  border: "#E5E7EB",
  cardBackground: "#FFFFFF",
  sortBackground: "#F0F0F0",
  inputBackground: "#F5F5F5",
  header: {
    border: "#E5E7EB",
    text: "#111827",
  },
  optionButton: {
    background: "#FFFFFF",
    label: "#111827",
    iconContainer: "#FFF8E6",
  },
  primaryLight: "#FFF8E6",
  actionIcons: {
    sunny: "#FFA726",
    moon: "#90A4AE",
    phone: "#42A5F5",
  },
  switch: {
    track: {
      inactive: "#E0E0E0",
      active: "#4CAF50",
    },
    thumb: {
      inactive: "#F4F4F4",
      active: "#4CAF50",
    },
  },
  // Adding missing properties
  error: "#D32F2F",               // Red color for errors
  errorBackground: "#FFEBEE",     // Light red background for error states
};

/**
 * DARK THEME
 * Enhanced for a complete black look with sustainable green accents.
 *
 * Colors:
 *  - Primary-100: #00FF00
 *  - Primary-200: #00df00
 *  - Primary-300: #009700
 *  - Accent-100:  #32CD32
 *  - Accent-200:  #006a00
 *  - Text-100:    #FFFFFF
 *  - Text-200:    #e0e0e0
 *  - BG-100:      #000000
 *  - BG-200:      #161616
 *  - BG-300:      #2c2c2c
 */
export const darkTheme: ThemeType = {
  background: "#000000",           // BG-100: complete black background
  backgroundPrimary: "#161616",    // BG-200: for cards, inputs, etc.
  backgroundSecondary: "#2c2c2c",  // BG-300: for banners, headers, etc.
  banner: {
    background: "#161616",         // Using BG-200 as banner background
    title: "#00FF00",              // Primary-100: bright green for title
    subtitle: "#e0e0e0",           // Text-200 for subtitles
    button: "#00df00",             // Primary-200 for buttons
    buttonText: "#FFFFFF",         // Text-100 for button text
  },
  text: "#FFFFFF",                 // Text-100: pure white text
  textPrimary: "#FFFFFF",
  textSecondary: "#e0e0e0",         // Text-200: light gray
  textOnPrimary: "#FFFFFF",         // White text on primary (green) surfaces
  primary: "#00FF00",              // Primary-100 as the main green accent
  accent: "#32CD32",               // Accent-100 for additional emphasis
  border: "#2c2c2c",               // Use BG-300 for borders
  cardBackground: "#161616",       // Same as backgroundPrimary
  sortBackground: "#161616",       // Same as backgroundPrimary
  inputBackground: "#161616",      // Same as backgroundPrimary for inputs
  header: {
    border: "#2c2c2c",
    text: "#FFFFFF",
  },
  optionButton: {
    background: "#161616",
    label: "#FFFFFF",
    iconContainer: "#2c2c2c",
  },
  primaryLight: "#00df00",         // Primary-200 as a lighter variant of primary
  actionIcons: {
    sunny: "#FFA726",
    moon: "#B0BEC5",
    phone: "#64B5F6",
  },
  switch: {
    track: {
      inactive: "#555555",
      active: "#00FF00",           // Active switch uses primary-100
    },
    thumb: {
      inactive: "#888888",
      active: "#00FF00",
    },
  },
  // Adding missing properties
  error: "#FF5252",                // Bright red for error in dark mode
  errorBackground: "#331111",      // Dark red background for error states
};

// Create the ThemeContext with default values (lightTheme by default)
export const ThemeContext = createContext<{
  theme: ThemeType;
  toggleTheme: () => void;
}>({
  theme: lightTheme,
  toggleTheme: () => {},
});

/**
 * ThemeProvider wraps your app and provides the current theme.
 * It uses the system color scheme on initialization.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Get the system color scheme ("dark" or "light")
  const colorScheme = useColorScheme();
  // Initialize theme based on the system color scheme
  const [theme, setTheme] = useState<ThemeType>(colorScheme === "dark" ? darkTheme : lightTheme);

  /**
   * toggleTheme switches between light and dark themes.
   * (Extend this function for user preferences if needed.)
   */
  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  // The return statement would go here but was intentionally omitted as requested
  
};

/**
 * useTheme is a custom hook to access the current theme.
 */
export const useTheme = () => useContext(ThemeContext).theme;

/**
 * useToggleTheme is a custom hook to access the theme toggler function.
 */
export const useToggleTheme = () => useContext(ThemeContext).toggleTheme;