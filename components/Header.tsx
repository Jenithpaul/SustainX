import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HeaderProps {
  onProfilePress?: () => void;
  currentTab?: string; // Current tab prop
}

const Header: React.FC<HeaderProps> = ({ onProfilePress, currentTab }) => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load profile image from AsyncStorage on component mount
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const imageUri = await AsyncStorage.getItem('userProfileImage');
        if (imageUri) {
          setProfileImage(imageUri);
        }
      } catch (error) {
        console.error("Error loading profile image from storage:", error);
      }
    };
    
    loadProfileImage();
    
    // Set up listener to check for profile image changes
    const intervalId = setInterval(loadProfileImage, 2000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleProfilePress = async () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      // Store the current tab name in AsyncStorage if it's a valid tab
      if (currentTab && ['Home', 'Marketplace', 'Knowledge'].includes(currentTab)) {
        await AsyncStorage.setItem('previousTab', currentTab);
      } else {
        // Store a default tab if currentTab is not valid
        await AsyncStorage.setItem('previousTab', 'Home');
      }
      // Navigate to profile page
      router.push('/profile');
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.appName}>SustainX</Text>
      <TouchableOpacity 
        style={styles.profileSection} 
        onPress={handleProfilePress}
      >
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Ionicons name="person-circle-outline" size={40} color="#4CAF50" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  profileSection: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
});

export default Header;
