import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useThemeContext } from '../../contexts/ThemeContext';
import CourseCard from '../../components/CourseCard';

export default function AddCourseScreen() {
  const { colors } = useThemeContext();
  const [courses, setCourses] = useState([
    { id: '1', title: 'Introduction to React Native', duration: '2h 30m', lessons: '12 lessons' },
    { id: '2', title: 'Advanced JavaScript Patterns', duration: '3h 45m', lessons: '15 lessons' },
  ]);
  const [newCourse, setNewCourse] = useState({ title: '', duration: '', lessons: '' });

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.duration || !newCourse.lessons) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setCourses([...courses, { id: Date.now().toString(), ...newCourse }]);
    setNewCourse({ title: '', duration: '', lessons: '' });
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 8,
      marginBottom: 8,
      color: colors.text,
    },
    addButton: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    addButtonText: {
      color: '#fff',
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Course Title"
        placeholderTextColor={colors.textSecondary}
        value={newCourse.title}
        onChangeText={(text) => setNewCourse({ ...newCourse, title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration"
        placeholderTextColor={colors.textSecondary}
        value={newCourse.duration}
        onChangeText={(text) => setNewCourse({ ...newCourse, duration: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Lessons"
        placeholderTextColor={colors.textSecondary}
        value={newCourse.lessons}
        onChangeText={(text) => setNewCourse({ ...newCourse, lessons: text })}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
        <Text style={styles.addButtonText}>Add Course</Text>
      </TouchableOpacity>

      <FlatList
        data={courses}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onDelete={() => handleDeleteCourse(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
