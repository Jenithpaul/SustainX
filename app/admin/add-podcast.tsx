import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../contexts/ThemeContext';

export default function AddPodcastScreen() {
  const router = useRouter();
  const { colors } = useThemeContext();
  const [newPodcast, setNewPodcast] = useState({ title: '', date: '' });

  const handleSubmit = () => {
    // Add validation and API call here
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    input: {
      backgroundColor: colors.backgroundPrimary,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      color: colors.text,
    },
    submitButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    submitText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Episode Title"
        placeholderTextColor={colors.textSecondary}
        value={newPodcast.title}
        onChangeText={text => setNewPodcast({ ...newPodcast, title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (e.g., March 23, 2024)"
        placeholderTextColor={colors.textSecondary}
        value={newPodcast.date}
        onChangeText={text => setNewPodcast({ ...newPodcast, date: text })}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Add Podcast</Text>
      </TouchableOpacity>
    </View>
  );
}
