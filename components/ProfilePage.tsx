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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProfileStyles } from "../ui/ProfilePageStyle";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

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
  const styles = useProfileStyles();

  const [profile, setProfile] = useState<UserProfile>({
    name: "Sarah Johnson",
    role: "Environmental Science Major",
    score: 850,
    imageUrl: "https://via.placeholder.com/80",
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(profile.name);

  const profileOptions: ProfileOption[] = [
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
      id: "purchase",
      icon: "bag-outline",
      label: "Purchase History",
      color: "#fdf6ec",
      iconColor: "#e09f3e",
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

  // Navigate back to the previous tab stored in AsyncStorage.
  const handleBackPress = async () => {
    const previousTab = await AsyncStorage.getItem("previousTab");
    if (previousTab) {
      await AsyncStorage.removeItem("previousTab");
      router.replace(`/${previousTab}`);
    } else {
      router.back();
    }
  };

  // Handle profile option navigation
  const handleOptionClick = (optionId: string) => {
    console.log(`${optionId} option clicked`);
    router.push(optionId);
  };

  // Logout functionality
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

  // Profile image change functionality
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

  // Handle name editing
  const handleNameEdit = () => {
    setProfile({ ...profile, name: newName });
    setIsEditingName(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Info Section */}
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

      {/* Options List */}
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

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
