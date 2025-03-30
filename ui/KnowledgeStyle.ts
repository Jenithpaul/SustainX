import { StyleSheet } from "react-native";
import { useTheme } from '../contexts/ThemeContext';

export const useKnowledgeStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: theme.accent,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.backgroundSecondary,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
    scrollContent: {
      paddingBottom: 80,
    },
    featuredContainer: {
      marginHorizontal: 16,
      marginTop: 16,
      backgroundColor: theme.banner.background,
      borderRadius: 8,
      padding: 16,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.banner.title,
    },
    viewAllText: {
      fontSize: 14,
      color: theme.accent,
    },
    featuredCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 8,
      padding: 16,
    },
    courseTag: {
      fontSize: 12,
      color: theme.accent,
      marginBottom: 4,
    },
    courseTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    courseDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 12,
    },
    startLearningButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    startLearningText: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.accent,
      marginRight: 4,
    },
    categoriesContainer: {
      paddingHorizontal: 16,
      marginTop: 24,
    },
    categoriesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    categoryCard: {
      width: "48%",
      backgroundColor: theme.cardBackground,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    categoryTitle: {
      fontSize: 15,
      fontWeight: "500",
      color: theme.text,
      marginBottom: 4,
    },
    categoryCount: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    magazinesContainer: {
      paddingHorizontal: 16,
      marginTop: 8,
      marginBottom: 80,
    },
    magazineItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      borderRadius: 8,
      padding: 8,
      marginBottom: 12,
    },
    magazineIcon: {
      width: 48,
      height: 48,
      borderRadius: 8,
      marginRight: 12,
    },
    magazineInfo: {
      flex: 1,
    },
    magazineTitle: {
      fontSize: 15,
      fontWeight: "500",
      color: theme.text,
      marginBottom: 4,
    },
    magazineDate: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    toast: {
      position: "absolute",
      top: 40,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      margin: 40,
      padding: 8,
      borderRadius: 8,
      alignItems: "center",
    },
    toastText: {
      color: "#fff",
      fontSize: 14,
    },
  });
};