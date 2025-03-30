// SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeContext, ThemePreference } from '../contexts/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, colors, isDarkMode, setTheme } = useThemeContext();

  const handleBackClick = () => {
    router.back();
  };

  const handleThemeChange = (selectedTheme: ThemePreference) => {
    setTheme(selectedTheme);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.header.border }]}>
        <TouchableOpacity onPress={handleBackClick} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.header.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.header.text }]}>
          Settings
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Theme Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Appearance
        </Text>

        {/* Light Theme Option */}
        <View style={[styles.optionButton, { backgroundColor: colors.optionButton.background }]}>
          <View style={styles.optionInfo}>
            <View style={[styles.optionIconContainer, { backgroundColor: theme === 'light' ? colors.primaryLight : '#fff8e6' }]}>
              <Ionicons name="sunny-outline" size={20} color={colors.actionIcons.sunny} />
            </View>
            <Text style={[styles.optionLabel, { color: colors.optionButton.label }]}>
              Light Theme
            </Text>
          </View>
          <Switch
            value={theme === 'light'}
            onValueChange={() => handleThemeChange('light')}
            trackColor={{
              false: colors.switch.track.inactive,
              true: colors.switch.track.active,
            }}
            thumbColor={theme === 'light' ? colors.switch.thumb.active : colors.switch.thumb.inactive}
          />
        </View>

        {/* Dark Theme Option */}
        <View style={[styles.optionButton, { backgroundColor: colors.optionButton.background }]}>
          <View style={styles.optionInfo}>
            <View style={[styles.optionIconContainer, { backgroundColor: theme === 'dark' ? colors.optionButton.iconContainer : '#e9ecef' }]}>
              <Ionicons name="moon-outline" size={20} color={colors.actionIcons.moon} />
            </View>
            <Text style={[styles.optionLabel, { color: colors.optionButton.label }]}>
              Dark Theme
            </Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={() => handleThemeChange('dark')}
            trackColor={{
              false: colors.switch.track.inactive,
              true: colors.switch.track.active,
            }}
            thumbColor={theme === 'dark' ? colors.switch.thumb.active : colors.switch.thumb.inactive}
          />
        </View>

        {/* System Theme Option */}
        <View style={[styles.optionButton, { backgroundColor: colors.optionButton.background }]}>
          <View style={styles.optionInfo}>
            <View style={[styles.optionIconContainer, { backgroundColor: theme === 'system' ? colors.optionButton.iconContainer : '#f3e8fa' }]}>
              <Ionicons name="phone-portrait-outline" size={20} color={colors.actionIcons.phone} />
            </View>
            <Text style={[styles.optionLabel, { color: colors.optionButton.label }]}>
              Use Device Settings
            </Text>
          </View>
          <Switch
            value={theme === 'system'}
            onValueChange={() => handleThemeChange('system')}
            trackColor={{
              false: colors.switch.track.inactive,
              true: colors.switch.track.active,
            }}
            thumbColor={theme === 'system' ? colors.switch.thumb.active : colors.switch.thumb.inactive}
          />
        </View>

        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Choose your preferred theme or follow your device settings.
        </Text>
      </View>
    </ScrollView>
  );
}

// Styles that don't depend on theme
const styles = StyleSheet.create({
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
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
  },
});