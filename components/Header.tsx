// Header.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHeadStyles } from "../ui/HeaderStyle";

interface HeaderProps {
  onProfilePress?: () => void;
  currentTab?: string; // Current tab name, used for navigation purposes
}

const Header: React.FC<HeaderProps> = ({ onProfilePress, currentTab }) => {
  const router = useRouter();
  const styles = useHeadStyles();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load profile image from AsyncStorage and update periodically
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const imageUri = await AsyncStorage.getItem("userProfileImage");
        if (imageUri) {
          setProfileImage(imageUri);
        }
      } catch (error) {
        console.error("Error loading profile image:", error);
      }
    };

    loadProfileImage();
    const intervalId = setInterval(loadProfileImage, 2000);
    return () => clearInterval(intervalId);
  }, []);

  // When profile is pressed, store the current tab (if valid) then navigate to /profile.
  const handleProfilePress = async () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      const validTabs = ["Home", "Marketplace", "Knowledge"];
      if (currentTab && validTabs.includes(currentTab)) {
        await AsyncStorage.setItem("previousTab", currentTab);
      } else {
        await AsyncStorage.setItem("previousTab", "Home");
      }
      router.push("/profile");
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.appName}>SustainX</Text>
      <TouchableOpacity style={styles.profileSection} onPress={handleProfilePress}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-circle-outline" size={40} color="#4CAF50" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Header;
