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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const useProfileStyles = () => ({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700", // Changed from "bold" to "700" for consistency
    color: "#333",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  profileImageBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    padding: 5,
  },
  nameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 10,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700", // Changed from "bold" to "700"
    color: "#333",
    marginRight: 10,
  },
  editButton: {
    padding: 5,
  },
  userRole: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  scoreContainer: {
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
    padding: 10,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "700", // Changed from "bold" to "700"
    color: "#00796b",
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  logoutContainer: {
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    color: "#ef4444",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "100%",
    maxWidth: 500,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600", // This should already be valid
    color: "#2a2a2a",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 10,
  },
  supportContent: {
    alignItems: "center",
    paddingVertical: 15,
  },
  supportIcon: {
    marginBottom: 10,
  },
  supportText: {
    fontSize: 18,
    fontWeight: "600", // This should already be valid
    marginBottom: 5,
    color: "#2a2a2a",
  },
  supportPhone: {
    fontSize: 22,
    fontWeight: "700", // Changed from "700" to numeric 700 if needed
    color: "#4CAF50",
    marginBottom: 10,
  },
  supportHours: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
  },
  supportDivider: {
    height: 1,
    backgroundColor: "#e5e5e5",
    width: "100%",
    marginVertical: 15,
  },
  supportEmail: {
    fontSize: 16,
    color: "#4361ee",
    marginBottom: 10,
  },
  supportFaq: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  feedbackContent: {
    marginVertical: 15,
  },
  feedbackLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    minHeight: 120,
    color: "#333",
  },
  passwordContent: {
    marginVertical: 10,
  },
  passwordField: {
    marginBottom: 15,
  },
  passwordLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  passwordInfo: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500", // This should already be valid
  },
  secondaryButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  secondaryButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500", // This should already be valid
  },
});

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const styles = useProfileStyles();

  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    role: "Environmental Science Major",
    score: 850,
    imageUrl: "https://via.placeholder.com/80",
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(profile.name);

  const [helpSupportVisible, setHelpSupportVisible] = useState(false);
  const [feedbackFormVisible, setFeedbackFormVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  const [feedbackText, setFeedbackText] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const profileOptions = [
    {
      id: "certificates",
      icon: "trophy-outline",
      label: "Certificates",
      color: "#e6efff",
      iconColor: "#4361ee",
    },
    {
      id: "feedback",
      icon: "chatbubble-outline",
      label: "Feedback Form",
      color: "#f3e8fa",
      iconColor: "#7209b7",
    },
    {
      id: "settings",
      icon: "settings-outline",
      label: "Settings",
      color: "#e9ecef",
      iconColor: "#4a4e69",
    },
    {
      id: "help",
      icon: "headset-outline",
      label: "Help & Support",
      color: "#fce8ea",
      iconColor: "#e63946",
    },
    {
      id: "password",
      icon: "lock-closed-outline",
      label: "Change Password",
      color: "#fff8e6",
      iconColor: "#ffd166",
    },
  ];

  const handleBackPress = async () => {
    const previousTab = await AsyncStorage.getItem("previousTab");
    if (previousTab) {
      await AsyncStorage.removeItem("previousTab");
      router.replace(`/${previousTab}`);
    } else {
      router.back();
    }
  };

  const handleOptionClick = (optionId) => {
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

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("authToken");
            router.replace("/(auth)/Login");
          } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert("Error", "An error occurred during logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleImageChange = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please grant permission to access your photos");
        return;
      }
    }
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
  };

  const handleNameEdit = () => {
    setProfile({ ...profile, name: newName });
    setIsEditingName(false);
  };

  const handleFeedbackSubmit = () => {
    if (feedbackText.trim() === "") {
      Alert.alert("Error", "Please enter your feedback");
      return;
    }

    console.log("Feedback submitted:", feedbackText);
    Alert.alert("Success", "Thank you for your feedback!");
    setFeedbackText("");
    setFeedbackFormVisible(false);
  };

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

    console.log("Password change requested");
    Alert.alert("Success", "Your password has been updated successfully");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setChangePasswordVisible(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageBg}>
            <Image source={{ uri: profile.imageUrl }} style={styles.profileImage} />
          </View>
          <TouchableOpacity style={styles.cameraButton} onPress={handleImageChange}>
            <Ionicons name="camera" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        {isEditingName ? (
          <View style={styles.nameEditContainer}>
            <TextInput style={styles.nameInput} value={newName} onChangeText={setNewName} />
            <TouchableOpacity onPress={handleNameEdit} style={styles.saveButton}>
              <Ionicons name="checkmark" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{profile.name}</Text>
            <TouchableOpacity onPress={() => setIsEditingName(true)} style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.userRole}>{profile.role}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Sustainability Score: {profile.score}</Text>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        {profileOptions.map((option) => (
          <TouchableOpacity key={option.id} style={styles.optionButton} onPress={() => handleOptionClick(option.id)}>
            <View style={[styles.optionIconContainer, { backgroundColor: option.color }]}>
              <Ionicons name={option.icon as any} size={20} color={option.iconColor} />
            </View>
            <Text style={styles.optionLabel}>{option.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

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
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.supportContent}>
              <Ionicons name="call" size={24} color="#4CAF50" style={styles.supportIcon} />
              <Text style={styles.supportText}>Customer Support</Text>
              <Text style={styles.supportPhone}>1-800-SUSTAIN (1-800-787-8246)</Text>

              <Text style={styles.supportHours}>
                Available Monday to Friday, 9:00 AM to 5:00 PM EST
              </Text>

              <View style={styles.supportDivider} />

              <Text style={styles.supportEmail}>Email: support@ecoteam.com</Text>
              <Text style={styles.supportFaq}>
                Visit our FAQ section for common questions and answers
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => setHelpSupportVisible(false)}
            >
              <Text style={styles.primaryButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.feedbackContent}>
              <Text style={styles.feedbackLabel}>
                Your suggestions help us improve our service. Please share your thoughts:
              </Text>

              <TextInput
                style={styles.feedbackInput}
                placeholder="Enter your feedback here..."
                placeholderTextColor="#888"
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setFeedbackFormVisible(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleFeedbackSubmit}
              >
                <Text style={styles.primaryButtonText}>Submit Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContent}>
              <View style={styles.passwordField}>
                <Text style={styles.passwordLabel}>Current Password</Text>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter current password"
                  placeholderTextColor="#888"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.passwordField}>
                <Text style={styles.passwordLabel}>New Password</Text>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter new password"
                  placeholderTextColor="#888"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.passwordField}>
                <Text style={styles.passwordLabel}>Confirm New Password</Text>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm new password"
                  placeholderTextColor="#888"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              <Text style={styles.passwordInfo}>
                Password must be at least 8 characters and include a mix of letters, numbers, and special characters.
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setChangePasswordVisible(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handlePasswordChange}
              >
                <Text style={styles.primaryButtonText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

export default ProfilePage;