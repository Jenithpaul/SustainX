// ui/HeadStyle.ts
import { StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext"; // Adjust the path as needed

/**
 * useHeadStyles hook returns a StyleSheet with dynamic theme values.
 */
export const useHeadStyles = () => {
  const theme = useTheme(); // Get current theme colors from context

  return StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border, // Using theme border color
      backgroundColor: theme.background, // Using complete black background from theme
    },
    appName: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.primary, // Uses the theme's primary color
    },
    profileSection: {
      width: 40,
      height: 40,
      borderRadius: 20,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.backgroundPrimary, // Using theme's primary background
    },
    profileImage: {
      width: "100%",
      height: "100%",
      borderRadius: 20,
    },
    icon: {
      tintColor: theme.primary, // Using primary color for icons
    }
  });
};