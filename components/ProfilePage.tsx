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
import { useProfileStyles } from "../ui/ProfilePageStyle"; // Make sure this path is correct

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const styles = useProfileStyles(); // Now using the themed styles

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
          <Ionicons name="chevron-back" size={24} color={styles.headerTitle.color} />
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
          <View style={styles.nameContainer}>
            <TextInput 
              style={styles.nameInput} 
              value={newName} 
              onChangeText={setNewName}
              placeholderTextColor={styles.textSecondary}
            />
            <TouchableOpacity onPress={handleNameEdit} style={styles.saveButton}>
              <Ionicons name="checkmark" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{profile.name}</Text>
            <TouchableOpacity onPress={() => setIsEditingName(true)} style={styles.editButton}>
              <Ionicons name="pencil" size={16} color={styles.primary} />
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
            <Ionicons name="chevron-forward" size={18} color={styles.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={styles.logoutText.color} style={{ marginRight: 10 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={helpSupportVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setHelpSupportVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}>
          <View style={{
            backgroundColor: styles.backgroundPrimary,
            borderRadius: 15,
            width: "100%",
            maxWidth: 500,
            padding: 20,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: styles.border,
              paddingBottom: 10,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: "600",
                color: styles.textPrimary,
              }}>Help & Support</Text>
              <TouchableOpacity onPress={() => setHelpSupportVisible(false)}>
                <Ionicons name="close" size={24} color={styles.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={{
              alignItems: "center",
              paddingVertical: 15,
            }}>
              <Ionicons name="call" size={24} color={styles.primary} style={{ marginBottom: 10 }} />
              <Text style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 5,
                color: styles.textPrimary,
              }}>Customer Support</Text>
              <Text style={{
                fontSize: 22,
                fontWeight: "700",
                color: styles.primary,
                marginBottom: 10,
              }}>1-800-SUSTAIN (1-800-787-8246)</Text>

              <Text style={{
                fontSize: 14,
                color: styles.textSecondary,
                textAlign: "center",
                marginBottom: 15,
              }}>
                Available Monday to Friday, 9:00 AM to 5:00 PM EST
              </Text>

              <View style={{
                height: 1,
                backgroundColor: styles.border,
                width: "100%",
                marginVertical: 15,
              }} />

              <Text style={{
                fontSize: 16,
                color: "#4361ee",
                marginBottom: 10,
              }}>Email: support@ecoteam.com</Text>
              <Text style={{
                fontSize: 14,
                color: styles.textSecondary,
                textAlign: "center",
              }}>
                Visit our FAQ section for common questions and answers
              </Text>
            </View>

            <TouchableOpacity 
              style={{
                backgroundColor: styles.primary,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                minWidth: 100,
              }}
              onPress={() => setHelpSupportVisible(false)}
            >
              <Text style={{
                color: "white",
                fontSize: 16,
                fontWeight: "500",
              }}>Close</Text>
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
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View style={{
            backgroundColor: styles.backgroundPrimary,
            borderRadius: 15,
            width: "100%",
            maxWidth: 500,
            padding: 20,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: styles.border,
              paddingBottom: 10,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: "600",
                color: styles.textPrimary,
              }}>Feedback Form</Text>
              <TouchableOpacity onPress={() => setFeedbackFormVisible(false)}>
                <Ionicons name="close" size={24} color={styles.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={{
              marginVertical: 15,
            }}>
              <Text style={{
                fontSize: 14,
                color: styles.textSecondary,
                marginBottom: 15,
              }}>
                Your suggestions help us improve our service. Please share your thoughts:
              </Text>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: styles.border,
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  backgroundColor: styles.inputBackground,
                  minHeight: 120,
                  color: styles.textPrimary,
                }}
                placeholder="Enter your feedback here..."
                placeholderTextColor={styles.textSecondary}
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 20,
              gap: 10,
            }}>
              <TouchableOpacity 
                style={{
                  backgroundColor: styles.backgroundSecondary,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 100,
                }}
                onPress={() => setFeedbackFormVisible(false)}
              >
                <Text style={{
                  color: styles.textPrimary,
                  fontSize: 16,
                  fontWeight: "500",
                }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{
                  backgroundColor: styles.primary,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 100,
                }}
                onPress={handleFeedbackSubmit}
              >
                <Text style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "500",
                }}>Submit Feedback</Text>
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
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View style={{
            backgroundColor: styles.backgroundPrimary,
            borderRadius: 15,
            width: "100%",
            maxWidth: 500,
            padding: 20,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: styles.border,
              paddingBottom: 10,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: "600",
                color: styles.textPrimary,
              }}>Change Password</Text>
              <TouchableOpacity onPress={() => setChangePasswordVisible(false)}>
                <Ionicons name="close" size={24} color={styles.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={{
              marginVertical: 10,
            }}>
              <View style={{
                marginBottom: 15,
              }}>
                <Text style={{
                  fontSize: 14,
                  color: styles.textSecondary,
                  marginBottom: 5,
                }}>Current Password</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: styles.border,
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: styles.inputBackground,
                    color: styles.textPrimary,
                  }}
                  placeholder="Enter current password"
                  placeholderTextColor={styles.textSecondary}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                />
              </View>

              <View style={{
                marginBottom: 15,
              }}>
                <Text style={{
                  fontSize: 14,
                  color: styles.textSecondary,
                  marginBottom: 5,
                }}>New Password</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: styles.border,
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: styles.inputBackground,
                    color: styles.textPrimary,
                  }}
                  placeholder="Enter new password"
                  placeholderTextColor={styles.textSecondary}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
              </View>

              <View style={{
                marginBottom: 15,
              }}>
                <Text style={{
                  fontSize: 14,
                  color: styles.textSecondary,
                  marginBottom: 5,
                }}>Confirm New Password</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: styles.border,
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: styles.inputBackground,
                    color: styles.textPrimary,
                  }}
                  placeholder="Confirm new password"
                  placeholderTextColor={styles.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              <Text style={{
                fontSize: 12,
                color: styles.textSecondary,
                marginTop: 5,
                fontStyle: "italic",
              }}>
                Password must be at least 8 characters and include a mix of letters, numbers, and special characters.
              </Text>
            </View>

            <View style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 20,
              gap: 10,
            }}>
              <TouchableOpacity 
                style={{
                  backgroundColor: styles.backgroundSecondary,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 100,
                }}
                onPress={() => setChangePasswordVisible(false)}
              >
                <Text style={{
                  color: styles.textPrimary,
                  fontSize: 16,
                  fontWeight: "500",
                }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{
                  backgroundColor: styles.primary,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 100,
                }}
                onPress={handlePasswordChange}
              >
                <Text style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "500",
                }}>Update Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

export default ProfilePage;