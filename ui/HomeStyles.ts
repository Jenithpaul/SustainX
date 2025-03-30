import { StyleSheet } from "react-native";
import { useTheme } from '../contexts/ThemeContext';

export const useHomeStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    mainContent: {
      flex: 1,
      padding: 16,
    },
    banner: {
      backgroundColor: theme.banner.background,
      padding: 24,
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    bannerTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.banner.title,
      marginBottom: 8,
    },
    bannerSubtitle: {
      fontSize: 15,
      color: theme.banner.subtitle,
      lineHeight: 22,
    },
    bannerButton: {
      backgroundColor: theme.banner.button,
      paddingVertical: 12,
      paddingHorizontal: 28,
      borderRadius: 10,
      alignSelf: "flex-start",
      marginTop: 16,
    },
    bannerButtonText: {
      color: theme.banner.buttonText,
      fontWeight: "600",
      fontSize: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
      marginTop: 16,
      marginBottom: 12,
    },
    actions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    actionButton: {
      alignItems: "center",
      width: "30%",
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme.cardBackground,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    actionIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
      backgroundColor: theme.sortBackground,
    },
    actionText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text,
    },
    featuredItems: {
      marginBottom: 24,
    },
    featuredItem: {
      width: 220,
      marginRight: 16,
      borderRadius: 16,
      backgroundColor: theme.cardBackground,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    tipCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 16,
      padding: 20,
      flexDirection: "row",
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    tipIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.banner.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    tipContent: {
      flex: 1,
    },
    tipTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 4,
      color: theme.text,
    },
    tipText: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
  });
};