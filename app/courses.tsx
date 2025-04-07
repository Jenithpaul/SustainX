import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../contexts/ThemeContext';

export default function CoursesScreen() {
  const router = useRouter();
  const { colors } = useThemeContext();
  const [courses] = useState([
    { 
      id: '1', 
      title: 'Introduction to React Native', 
      duration: '2h 30m', 
      lessons: '12 lessons',
      progress: 75, // Add progress percentage
      link: 'https://reactnative.dev/' 
    },
    { 
      id: '2', 
      title: 'Advanced JavaScript Patterns', 
      duration: '3h 45m', 
      lessons: '15 lessons',
      progress: 30,
      link: 'https://javascript.info/' 
    },
    { 
      id: '3', 
      title: 'Mastering TypeScript', 
      duration: '4h 15m', 
      lessons: '20 lessons',
      progress: 0,
      link: 'https://www.typescriptlang.org/' 
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(courses);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredCourses(
      courses.filter((course) =>
        course.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 40, // Reduced from 60
      paddingBottom: 16, // Reduced from 20
      backgroundColor: colors.backgroundPrimary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
      textAlign: 'center',
    },
    backButton: {
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
    refreshButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchInput: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundPrimary,
      margin: 20,
      marginTop: 10,
      borderRadius: 12,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    searchIcon: {
      marginRight: 12,
      color: colors.textSecondary,
    },
    searchTextInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
    courseCard: {
      backgroundColor: colors.backgroundPrimary,
      marginHorizontal: 20,
      marginBottom: 16,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    progressContainer: {
      height: 4,
      backgroundColor: colors.border,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    courseContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    courseIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    courseDetails: {
      flex: 1,
    },
    courseTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    courseMeta: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    noCoursesText: {
      textAlign: 'center',
      fontSize: 18,
      color: colors.textSecondary,
      marginTop: 40,
      fontWeight: '600',
    },
  });

  const renderCourseCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.courseCard}
      activeOpacity={0.7}
      onPress={() => Linking.openURL(item.link)}
    >
      <View style={styles.courseContent}>
        <View style={styles.courseIcon}>
          <Ionicons name="book" size={24} color={colors.primary} />
        </View>
        <View style={styles.courseDetails}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseMeta}>{item.duration} • {item.lessons}</Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/Knowledge')}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Courses</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => setFilteredCourses(courses)}
        >
          <Ionicons name="refresh" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchInput}>
        <Ionicons name="search" size={22} style={styles.searchIcon} />
        <TextInput
          style={styles.searchTextInput}
          placeholder="Search courses..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {filteredCourses.length === 0 ? (
        <Text style={styles.noCoursesText}>No courses found</Text>
      ) : (
        <FlatList
          data={filteredCourses}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}