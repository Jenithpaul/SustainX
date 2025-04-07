// ProfilePage.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../contexts/ThemeContext"; // Adjust the path if needed
import { useProfileStyles } from "../ui/ProfilePageStyle"; // Using the hook from ProfilePageStyle.ts

// Define types for profile options and user profile
interface ProfileOption {
  id: string;
  icon: string;
  label: string;
  color: string;
  iconColor: string;
}

interface UserProfile {
  name: string;
  role: string;
  score: number;
  imageUrl: string;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = useProfileStyles(); // Using the hook that internally uses the current theme

  // State for user profile data
  const [profile, setProfile] = useState<UserProfile>({
    name: "Sarah Johnson",
    role: "Environmental Science Major",
    score: 850,
    imageUrl: "https://via.placeholder.com/80",
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(profile.name);
  const [isLoading, setIsLoading] = useState(false);

  // Modal visibility states
  const [helpSupportVisible, setHelpSupportVisible] = useState(false);
  const [feedbackFormVisible, setFeedbackFormVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  // Form states for feedback and password change
  const [feedbackText, setFeedbackText] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility states
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Profile options for navigation
  const profileOptions: ProfileOption[] = [
    {
      id: "certificates",
      icon: "trophy",
      label: "Certificates",
      color: "#e6efff",
      iconColor: "#4361ee",
    },
    {
      id: "feedback",
      icon: "chatbubble",
      label: "Feedback Form",
      color: "#f3e8fa",
      iconColor: "#7209b7",
    },
    {
      id: "settings",
      icon: "settings",
      label: "Settings",
      color: "#e9ecef",
      iconColor: "#4a4e69",
    },
    {
      id: "help",
      icon: "headset",
      label: "Help & Support",
      color: "#fce8ea",
      iconColor: "#e63946",
    },
    {
      id: "password",
      icon: "lock-closed",
      label: "Change Password",
      color: "#fff8e6",
      iconColor: "#ffd166",
    },
  ];

  // Navigate back based on a saved previous tab or simply go back
  const handleBackPress = async () => {
    const previousTab = await AsyncStorage.getItem("previousTab");
    if (previousTab) {
      await AsyncStorage.removeItem("previousTab");
      router.replace(`/${previousTab}`);
    } else {
      router.back();
    }
  };

  // Handle profile option click
  const handleOptionClick = (optionId: string) => {
    console.log(`${optionId} option clicked`);
    switch (optionId) {
      case "help":
        setHelpSupportVisible(true);
        break;
      case "feedback":
        setFeedbackFormVisible(true);
        break;
      case "password":
        setChangePasswordVisible(true);
        break;
      default:
        router.push(optionId);
    }
  };

  // Handle logout functionality
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            setIsLoading(true);
            await AsyncStorage.removeItem("authToken");
            setTimeout(() => {
              setIsLoading(false);
              router.replace("/(auth)/Login");
            }, 1000);
          } catch (error) {
            console.error("Error during logout:", error);
            setIsLoading(false);
            Alert.alert("Error", "An error occurred during logout. Please try again.");
          }
        },
      },
    ]);
  };

  // Handle profile image change using ImagePicker
  const handleImageChange = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please grant permission to access your photos");
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setProfile({ ...profile, imageUrl: selectedAsset.uri });
        Alert.alert("Success", "Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("Error", "Failed to update profile picture. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle name editing
  const handleNameEdit = () => {
    if (newName.trim() === "") {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    setProfile({ ...profile, name: newName });
    setIsEditingName(false);
  };

  // Handle feedback form submission
  const handleFeedbackSubmit = () => {
    if (feedbackText.trim() === "") {
      Alert.alert("Error", "Please enter your feedback");
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Feedback submitted:", feedbackText);
      setIsLoading(false);
      Alert.alert("Success", "Thank you for your feedback!");
      setFeedbackText("");
      setFeedbackFormVisible(false);
    }, 1000);
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Password change requested");
      setIsLoading(false);
      Alert.alert("Success", "Your password has been updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setChangePasswordVisible(false);
    }, 1000);
  };

  // Calculate progress percentage for visual indicator
  const progressPercentage = (profile.score / 1000) * 100;

  // Toggle password visibility
  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case "current":
        setCurrentPasswordVisible(!currentPasswordVisible);
        break;
      case "new":
        setNewPasswordVisible(!newPasswordVisible);
        break;
      case "confirm":
        setConfirmPasswordVisible(!confirmPasswordVisible);
        break;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Profile Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageBg}>
              <Image source={{ uri: profile.imageUrl }} style={styles.profileImage} />
            </View>
            <TouchableOpacity style={styles.cameraButton} onPress={handleImageChange}>
              <Ionicons name="camera" size={16} color={theme.textOnPrimary} />
            </TouchableOpacity>
          </View>

          {isEditingName ? (
            <View style={styles.nameEditContainer}>
              <TextInput
                style={styles.nameInput}
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter new name"
                placeholderTextColor={theme.textSecondary}
                autoFocus
              />
              <View style={styles.editButtonsRow}>
                <TouchableOpacity onPress={() => setIsEditingName(false)} style={styles.cancelButton}>
                  <Ionicons name="close" size={20} color={theme.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNameEdit} style={styles.saveButton}>
                  <Ionicons name="checkmark" size={20} color={theme.textOnPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{profile.name}</Text>
              <TouchableOpacity onPress={() => setIsEditingName(true)} style={styles.editNameButton}>
                <Ionicons name="pencil" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.userRole}>{profile.role}</Text>
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Sustainability Score</Text>
            <Text style={styles.scoreValue}>{profile.score}/1000</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.scoreDescription}>
            Keep up the great work! You're making a positive impact.
          </Text>
        </View>

        {/* Options List */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.optionsContainer}>
          {profileOptions.map((option) => (
            <TouchableOpacity 
              key={option.id} 
              style={styles.optionButton} 
              onPress={() => handleOptionClick(option.id)}
            >
              <View style={[styles.optionIconContainer, { backgroundColor: option.color }]}>
                <Ionicons name={option.icon} size={22} color={option.iconColor} />
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} style={styles.chevronIcon} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color={theme.error} style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Help & Support Modal */}
      <Modal
        visible={helpSupportVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setHelpSupportVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Help & Support</Text>
              <TouchableOpacity onPress={() => setHelpSupportVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.supportContent}>
              <View style={styles.supportCard}>
                <Ionicons name="call" size={28} color={theme.primary} style={styles.supportIcon} />
                <Text style={styles.supportText}>Customer Support</Text>
                <Text style={styles.supportPhone}>1-800-SUSTAIN</Text>
                <Text style={styles.supportHours}>Available Monday to Friday, 9:00 AM to 5:00 PM EST</Text>
              </View>
              
              <View style={styles.supportCard}>
                <Ionicons name="mail" size={28} color={theme.primary} style={styles.supportIcon} />
                <Text style={styles.supportText}>Email Support</Text>
                <Text style={styles.supportEmail}>support@ecoteam.com</Text>
                <Text style={styles.supportHours}>We usually respond within 24 hours</Text>
              </View>
              
              <View style={styles.supportCard}>
                <Ionicons name="help-circle" size={28} color={theme.primary} style={styles.supportIcon} />
                <Text style={styles.supportText}>FAQ Section</Text>
                <Text style={styles.supportFaq}>
                  Visit our comprehensive FAQ section for answers to common questions
                </Text>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.primaryButton} onPress={() => setHelpSupportVisible(false)}>
                <Text style={styles.primaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Feedback Form Modal */}
      <Modal
        visible={feedbackFormVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFeedbackFormVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Feedback Form</Text>
              <TouchableOpacity onPress={() => setFeedbackFormVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.feedbackContent}>
              <Ionicons name="chatbubble-ellipses" size={28} color={theme.primary} style={styles.feedbackIcon} />
              <Text style={styles.feedbackIntro}>
                We value your feedback! Please share your thoughts to help us improve our service.
              </Text>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Enter your feedback here..."
                placeholderTextColor={theme.textSecondary}
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              
              {/* Feedback type selection */}
              <Text style={[styles.formLabel, { marginTop: 16 }]}>Feedback Type</Text>
              <View style={styles.feedbackTypeContainer}>
                {["Suggestion", "Bug Report", "Question", "Praise"].map((type) => (
                  <TouchableOpacity 
                    key={type}
                    style={styles.feedbackTypeButton}
                  >
                    <Text style={styles.feedbackTypeText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setFeedbackFormVisible(false)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleFeedbackSubmit}>
                <Text style={styles.primaryButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={changePasswordVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChangePasswordVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setChangePasswordVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.passwordContent}>
              <Ionicons name="lock-closed" size={28} color={theme.primary} style={styles.passwordIcon} />
              <Text style={styles.passwordIntro}>
                Create a strong password to keep your account secure
              </Text>
              <View style={styles.passwordField}>
                <Text style={styles.passwordLabel}>Current Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter current password"
                    placeholderTextColor={theme.textSecondary}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!currentPasswordVisible}
                  />
                  <TouchableOpacity onPress={() => togglePasswordVisibility("current")}>
                    <Ionicons 
                      name={currentPasswordVisible ? "eye" : "eye-off"} 
                      size={20} 
                      color={theme.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.passwordField}>
                <Text style={styles.passwordLabel}>New Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter new password"
                    placeholderTextColor={theme.textSecondary}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!newPasswordVisible}
                  />
                  <TouchableOpacity onPress={() => togglePasswordVisibility("new")}>
                    <Ionicons 
                      name={newPasswordVisible ? "eye" : "eye-off"} 
                      size={20} 
                      color={theme.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.passwordField}>
                <Text style={styles.passwordLabel}>Confirm New Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm new password"
                    placeholderTextColor={theme.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!confirmPasswordVisible}
                  />
                  <TouchableOpacity onPress={() => togglePasswordVisibility("confirm")}>
                    <Ionicons 
                      name={confirmPasswordVisible ? "eye" : "eye-off"} 
                      size={20} 
                      color={theme.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.passwordRequirements}>
                <Text style={styles.passwordRequirementsTitle}>Password requirements:</Text>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={newPassword.length >= 8 ? "checkmark-circle" : "ellipse-outline"}
                    size={16} 
                    color={newPassword.length >= 8 ? theme.primary : theme.textSecondary} 
                  />
                  <Text style={styles.requirementText}>Minimum 8 characters</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={/[A-Z]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"}
                    size={16} 
                    color={/[A-Z]/.test(newPassword) ? theme.primary : theme.textSecondary} 
                  />
                  <Text style={styles.requirementText}>At least one uppercase letter</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={/[0-9]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"}
                    size={16} 
                    color={/[0-9]/.test(newPassword) ? theme.primary : theme.textSecondary} 
                  />
                  <Text style={styles.requirementText}>At least one number</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={/[^A-Za-z0-9]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"}
                    size={16} 
                    color={/[^A-Za-z0-9]/.test(newPassword) ? theme.primary : theme.textSecondary} 
                  />
                  <Text style={styles.requirementText}>At least one special character</Text>
                </View>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setChangePasswordVisible(false)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handlePasswordChange}>
                <Text style={styles.primaryButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default ProfilePage;