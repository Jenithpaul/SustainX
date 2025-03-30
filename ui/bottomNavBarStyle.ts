// ui/BottomNavbarStyle.ts
import { StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext"; // Ensure your ThemeContext is set up

/**
 * useBottomNavbarStyles hook returns styles with dynamic theme values.
 */
export const useBottomNavbarStyles = () => {
  const theme = useTheme(); // Get theme values from context

  return StyleSheet.create({
    navbar: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: theme.background, // Using complete black background from theme
      borderTopWidth: 1,
      borderTopColor: theme.border, // Theme-based border color
      paddingVertical: 10,
    },
    navItem: {
      alignItems: "center",
      justifyContent: "center",
    },
    navItemText: {
      marginTop: 4,
      fontSize: 12,
    },
    activeText: {
      color: theme.primary, // Uses theme's primary color for active state
    },
    inactiveText: {
      color: theme.textSecondary, // Uses theme's secondary text color
    },
    icon: {
      width: 24,
      height: 24,
    },
    activeIcon: {
      tintColor: theme.primary, // Active icon color using primary theme color
    },
    inactiveIcon: {
      tintColor: theme.textSecondary, // Inactive icon color using secondary text color
    }
  });
};