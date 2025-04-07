import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function QuizCard({ quiz, onStart, colors }) {
  const styles = StyleSheet.create({
    quizCard: {
      marginVertical: 8,
      backgroundColor: colors.backgroundPrimary,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    quizTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    quizInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quizMetadata: {
      fontSize: 14,
      color: colors.textSecondary,
      marginRight: 16,
    },
    completedBadge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    completedText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '500',
    },
    startButton: {
      backgroundColor: '#4CAF50',
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 8,
      marginLeft: 'auto',
      marginTop: 12,
    },
    startButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.quizCard}>
      <Text style={styles.quizTitle}>{quiz.title}</Text>
      <View style={styles.quizInfo}>
        <Text style={styles.quizMetadata}>{quiz.questions}</Text>
        <Text style={styles.quizMetadata}>{quiz.duration}</Text>
        {quiz.completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.startButton}
        activeOpacity={0.8}
        onPress={() => onStart(quiz)}
      >
        <Text style={styles.startButtonText}>Start Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}
