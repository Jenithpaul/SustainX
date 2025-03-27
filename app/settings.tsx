import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext'; // Ensure this path is correct
import lightModeStyles from '@/components/ui/lightModeStyles'; // Import the light mode styles
import darkModeStyles from '@/components/ui/darkModeStyles'; // Dark mode styles

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDarkMode, setTheme } = useTheme();

  const handleBackClick = () => {
    router.back();
  };

  const handleThemeChange = (selectedTheme: 'light' | 'dark' | 'system') => {
    setTheme(selectedTheme);
  };

  // Dynamically select styles based on the current theme
  const styles = isDarkMode ? darkModeStyles : lightModeStyles;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[headerStyles.header, { 
        borderBottomColor: isDarkMode ? '#2D3748' : '#eaeaea' 
      }]}>
        <TouchableOpacity onPress={handleBackClick} style={headerStyles.backButton}>
          <Ionicons name="chevron-back" size={24} color={isDarkMode ? '#E2E8F0' : '#000'} />
        </TouchableOpacity>
        <Text style={[headerStyles.headerTitle, { color: isDarkMode ? '#F7FAFC' : '#000' }]}>
          Settings
        </Text>
        <View style={headerStyles.headerPlaceholder} />
      </View>

      {/* Theme Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Appearance
        </Text>

        {/* Light Theme Option */}
        <View style={styles.optionButton}>
          <View style={styles.optionInfo}>
            <View style={[styles.optionIconContainer, { backgroundColor: '#fff8e6' }]}>
              <Ionicons name="sunny-outline" size={20} color="#ffa000" />
            </View>
            <Text style={styles.optionLabel}>
              Light Theme
            </Text>
          </View>
          <Switch
            value={theme === 'light'}
            onValueChange={() => handleThemeChange('light')}
            trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
            thumbColor={theme === 'light' ? '#4CAF50' : '#f4f3f4'}
          />
        </View>

        {/* Dark Theme Option */}
        <View style={styles.optionButton}>
          <View style={styles.optionInfo}>
            <View style={[styles.optionIconContainer, { backgroundColor: '#e9ecef' }]}>
              <Ionicons name="moon-outline" size={20} color="#4a4e69" />
            </View>
            <Text style={styles.optionLabel}>
              Dark Theme
            </Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={() => handleThemeChange('dark')}
            trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
            thumbColor={theme === 'dark' ? '#4CAF50' : '#f4f3f4'}
          />
        </View>

        {/* System Theme Option */}
        <View style={styles.optionButton}>
          <View style={styles.optionInfo}>
            <View style={[styles.optionIconContainer, { backgroundColor: '#f3e8fa' }]}>
              <Ionicons name="phone-portrait-outline" size={20} color="#7209b7" />
            </View>
            <Text style={styles.optionLabel}>
              Use Device Settings
            </Text>
          </View>
          <Switch
            value={theme === 'system'}
            onValueChange={() => handleThemeChange('system')}
            trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
            thumbColor={theme === 'system' ? '#4CAF50' : '#f4f3f4'}
          />
        </View>

        <Text style={styles.infoText}>
          Choose your preferred theme or follow your device settings.
        </Text>
      </View>
    </ScrollView>
  );
}

// Header-specific styles (not theme-dependent)
const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  headerPlaceholder: {
    width: 40,
  },
});