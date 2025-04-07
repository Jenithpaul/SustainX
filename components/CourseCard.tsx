import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';

export default function CourseCard({ course, onEdit, onDelete }: { course: any; onEdit: () => void; onDelete: () => void }) {
  const { colors } = useThemeContext();

  return (
    <View style={[styles.card, { backgroundColor: colors.backgroundPrimary }]}>
      <TouchableOpacity activeOpacity={0.7} onPress={onEdit}>
        <Text style={[styles.title, { color: colors.text }]}>{course.title}</Text>
        <View style={styles.info}>
          <Text style={[styles.metadata, { color: colors.textSecondary }]}>{course.duration}</Text>
          <Text style={[styles.metadata, { color: colors.textSecondary }]}>{course.lessons}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={{ color: 'red' }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metadata: {
    fontSize: 14,
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
});