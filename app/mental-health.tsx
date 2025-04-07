import React from 'react';
import { usePathname, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useThemeContext } from '../contexts/ThemeContext';

export default function MentalHealthScreen() {
  const router = useRouter();
  const { colors } = useThemeContext();

  const handleBackClick = () => {
    router.push('/(tabs)/Knowledge');
  };

  const handleOptionClick = (option) => {
    switch (option) {
      case 'therapist':
        router.push('/mental-health/therapist');
        break;
      case 'support-group':
        router.push('/mental-health/support-group');
        break;
      case 'resources':
        router.push('/mental-health/resources');
        break;
      default:
        break;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.backgroundPrimary,
      paddingTop: 40,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    backButton: {
      position: 'absolute',
      left: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginLeft: 12,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    listContent: {
      padding: 20,
    },
    supportText: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 20,
    },
    optionItem: {
      backgroundColor: colors.backgroundPrimary,
      marginBottom: 16,
      padding: 20,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    optionIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    optionDescription: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackClick}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <Ionicons name="heart" size={24} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Mental Health</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.supportText}>24/7 Support Available</Text>

        <TouchableOpacity
          style={styles.optionItem}
          activeOpacity={0.7}
          onPress={() => handleOptionClick('therapist')}
        >
          <View style={styles.optionIconContainer}>
            <MaterialIcons name="psychology" size={32} color={colors.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Talk to a Therapist</Text>
            <Text style={styles.optionDescription}>
              Connect with a licensed professional
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          activeOpacity={0.7}
          onPress={() => handleOptionClick('support-group')}
        >
          <View style={styles.optionIconContainer}>
            <Ionicons name="people" size={32} color={colors.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Join a Support Group</Text>
            <Text style={styles.optionDescription}>
              Participate in group sessions
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          activeOpacity={0.7}
          onPress={() => handleOptionClick('resources')}
        >
          <View style={styles.optionIconContainer}>
            <Ionicons name="book" size={32} color={colors.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Access Resources</Text>
            <Text style={styles.optionDescription}>
              Explore articles and tools
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}