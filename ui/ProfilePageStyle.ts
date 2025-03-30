import { StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext"; // Adjust path if needed

export const useProfileStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.backgroundSecondary,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "500",
      color: theme.textPrimary,
    },
    profileSection: {
      alignItems: "center",
      paddingVertical: 24,
      paddingHorizontal: 16,
    },
    profileImageContainer: {
      position: "relative",
      width: 96,
      height: 96,
    },
    profileImageBg: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: theme.inputBackground,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 2,
      borderColor: theme.backgroundPrimary,
    },
    cameraButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: theme.primary,
      padding: 6,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: theme.backgroundPrimary,
      justifyContent: "center",
      alignItems: "center",
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
    },
    userName: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.textPrimary,
    },
    editButton: {
      marginLeft: 8,
    },
    nameInput: {
      borderWidth: 1,
      borderColor: theme.border,
      padding: 8,
      borderRadius: 8,
      fontSize: 16,
      color: theme.textPrimary,
      backgroundColor: theme.inputBackground,
      marginRight: 8,
    },
    saveButton: {
      backgroundColor: theme.primary,
      padding: 8,
      borderRadius: 8,
    },
    userRole: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
      marginBottom: 12,
    },
    scoreContainer: {
      backgroundColor: theme.accent,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 24,
      marginTop: 12,
    },
    scoreText: {
      color: theme.textOnPrimary,
      fontWeight: "500",
    },
    optionsContainer: {
      paddingHorizontal: 16,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    optionIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    optionLabel: {
      flex: 1,
      fontSize: 16,
      color: theme.textPrimary,
    },
    logoutContainer: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      justifyContent: "center",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: theme.border,
      marginTop: 8,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 24,
      backgroundColor: theme.errorBackground,
      borderRadius: 24,
    },
    logoutText: {
      color: theme.error,
      fontSize: 16,
      fontWeight: "500",
    },
  });
};
