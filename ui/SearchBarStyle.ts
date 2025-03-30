// ui/SearchBarStyle.ts
import { StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext"; // Ensure you have a ThemeContext set up

/**
 * useSearchBarStyles hook returns styles with dynamic theme values.
 */
export const useSearchBarStyles = () => {
  const theme = useTheme(); // Get theme values from context

  return StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundPrimary, // Themed background
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border, // Theme-based border color
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    searchInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.inputBackground, // Themed input background
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 46,
      flex: 1,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.textPrimary, // Themed text color
    },
    clearButton: {
      padding: 4,
    },
    wishlistButton: {
      marginLeft: 8,
    },
    categoriesContainer: {
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.inputBackground, // Themed chip background
      borderRadius: 20,
      marginHorizontal: 4,
    },
    selectedCategoryChip: {
      backgroundColor: theme.primary, // Themed primary color for selected
    },
    categoryText: {
      fontSize: 14,
      color: theme.textSecondary, // Themed secondary text color
    },
    selectedCategoryText: {
      color: theme.textOnPrimary, // Themed text color when selected
      fontWeight: "500",
    },
  });
};
