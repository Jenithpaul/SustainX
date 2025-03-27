import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

interface ProfilePageProps {
  previousScreen?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ previousScreen }) => {
  const router = useRouter();
  
  // State for user profile data
  const [profile, setProfile] = useState<UserProfile>({
    name: "Sarah Johnson",
    role: "Environmental Science Major",
    score: 850,
    imageUrl: "https://via.placeholder.com/80"
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(profile.name);

  // Profile options with appropriate icons and colors
  const profileOptions: ProfileOption[] = [
    {
      id: 'certificates',
      icon: 'trophy-outline',
      label: 'Certificates',
      color: '#e6efff',
      iconColor: '#4361ee'
    },
    {
      id: 'feedback',
      icon: 'chatbubble-outline',
      label: 'Feedback Form',
      color: '#f3e8fa',
      iconColor: '#7209b7'
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      label: 'Settings',
      color: '#e9ecef',
      iconColor: '#4a4e69'
    },
    {
      id: 'purchase',
      icon: 'bag-outline',
      label: 'Purchase History',
      color: '#fdf6ec',
      iconColor: '#e09f3e'
    },
    {
      id: 'help',
      icon: 'headset-outline',
      label: 'Help & Support',
      color: '#fce8ea',
      iconColor: '#e63946'
    },
    {
      id: 'password',
      icon: 'lock-closed-outline',
      label: 'Change Password',
      color: '#fff8e6',
      iconColor: '#ffd166'
    }
  ];

  // Navigate back to previous screen
  const handleBackClick = async () => {
    try {
      // Try to get the stored previous tab
      const storedPreviousTab = await AsyncStorage.getItem('previousTab');
      
      if (previousScreen) {
        // Make sure previousScreen is a valid tab
        const validTab = ['Home', 'Marketplace', 'Knowledge'].includes(previousScreen) 
          ? previousScreen 
          : 'Home';
        router.replace(`/(tabs)/${validTab}`);
      } else if (storedPreviousTab) {
        // Make sure storedPreviousTab is a valid tab
        const validTab = ['Home', 'Marketplace', 'Knowledge'].includes(storedPreviousTab) 
          ? storedPreviousTab 
          : 'Home';
        router.replace(`/(tabs)/${validTab}`);
      } else {
        // Always navigate to a safe default route instead of using router.back()
        router.replace("/(tabs)/Home");
      }
    } catch (error) {
      console.error("Error navigating back:", error);
      // Fallback to home if there's an error
      router.replace("/(tabs)/Home");
    }
  };

  // Navigate to the selected option page
  const handleOptionClick = (optionId: string) => {
    console.log(`${optionId} option clicked`);
    router.push(`/${optionId}`);
  };

  // Handle logout functionality
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              // Clear authentication state
              await AsyncStorage.removeItem('authToken');
              // Navigate to login screen
              router.replace('/(auth)/Login');
            } catch (error) {
              console.error("Error during logout: ", error);
              Alert.alert("Error", "An error occurred during logout. Please try again.");
            }
          }
        }
      ]
    );
  };

  // Handle profile image upload
  const handleImageChange = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setProfile({ ...profile, imageUrl: selectedAsset.uri });
      
      // Save profile image to AsyncStorage so it can be used in the header
      try {
        await AsyncStorage.setItem('userProfileImage', selectedAsset.uri);
      } catch (error) {
        console.error("Error saving profile image to storage:", error);
      }
      
      Alert.alert("Success", "Profile picture updated successfully!");
    }
  };

  const handleNameEdit = () => {
    setProfile({ ...profile, name: newName });
    setIsEditingName(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackClick} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageBg}>
            <Image
              source={{ uri: profile.imageUrl }}
              style={styles.profileImage}
            />
          </View>
          <TouchableOpacity 
            style={styles.cameraButton} 
            onPress={handleImageChange}
          >
            <Ionicons name="camera" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {isEditingName ? (
          <View style={styles.nameEditContainer}>
            <TextInput
              style={styles.nameInput}
              value={newName}
              onChangeText={setNewName}
            />
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
          <TouchableOpacity
            key={option.id}
            style={styles.optionButton}
            onPress={() => handleOptionClick(option.id)}
          >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  profileImageContainer: {
    position: 'relative',
    width: 96,
    height: 96,
  },
  profileImageBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'white',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4ade80',
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    marginLeft: 8,
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 12,
  },
  scoreContainer: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginTop: 12,
  },
  scoreText: {
    color: '#047857',
    fontWeight: '500',
  },
  optionsContainer: {
    paddingHorizontal: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  optionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
  },
  logoutContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#fef2f2',
    borderRadius: 24,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfilePage;
