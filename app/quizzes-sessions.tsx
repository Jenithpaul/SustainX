import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../contexts/ThemeContext';
import { useNavigation, useLocalSearchParams, router } from 'expo-router';

interface QuizQuestion {
  question: string;
  options: string[];
  correctOption: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  duration: string;
  completed: boolean;
  thumbnail: string;
}

export default function QuizSessionScreen() {
  const { colors } = useThemeContext();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    try {
      if (params.quizData) {
        const quizData = JSON.parse(params.quizData as string);
        setQuiz(quizData);
        
        // Initialize selected options array with -1 (nothing selected)
        setSelectedOptions(new Array(quizData.questions.length).fill(-1));
        
        // Initialize timer
        const durationMatch = quizData.duration.match(/(\d+)/);
        if (durationMatch) {
          const minutes = parseInt(durationMatch[0]);
          const endTime = new Date();
          endTime.setMinutes(endTime.getMinutes() + minutes);
          setStartTime(new Date());
          
          // Set up timer interval
          const interval = setInterval(() => {
            const now = new Date();
            const diff = endTime.getTime() - now.getTime();
            
            if (diff <= 0) {
              // Time's up - calculate score and show results
              clearInterval(interval);
              setTimeRemaining('00:00');
              calculateFinalScore();
              setShowResults(true);
              return;
            }
            
            // Format remaining time
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
          }, 1000);
          
          setTimerInterval(interval);
        }
      }
    } catch (error) {
      console.error('Error loading quiz data:', error);
      Alert.alert('Error', 'Failed to load quiz. Please try again.');
      router.back();
    }
    
    // Clean up timer on unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [params.quizData]);

  const handleOptionSelect = (optionIndex: number) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // This is the last question, show results
      calculateFinalScore();
      setShowResults(true);
      
      // Stop the timer
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateFinalScore = () => {
    if (!quiz) return;
    
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedOptions[index] === question.correctOption) {
        correctAnswers++;
      }
    });
    
    const calculatedScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(calculatedScore);
  };

  const handleFinishQuiz = () => {
    // Navigate back to the quizzes screen
    router.replace('/quizzes');
  };

  const getScoreColor = () => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };

  const getElapsedTime = () => {
    if (!startTime) return '00:00';
    
    const elapsedMs = new Date().getTime() - startTime.getTime();
    const minutes = Math.floor(elapsedMs / 60000);
    const seconds = Math.floor((elapsedMs % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const headerHeight = 80;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: headerHeight,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: headerHeight,
      backgroundColor: colors.backgroundPrimary,
      zIndex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 12,
      flex: 1,
    },
    timer: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      marginRight: 8,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    questionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    questionCounter: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    questionText: {
      fontSize: 20,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 24,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginVertical: 8,
      backgroundColor: colors.backgroundPrimary,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedOption: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}20`,
    },
    optionText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
      flex: 1,
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
      paddingBottom: 40,
    },
    navButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    navButtonText: {
      fontSize: 16,
      fontWeight: '500',
      marginHorizontal: 4,
    },
    prevButton: {
      borderWidth: 1,
      borderColor: colors.border,
    },
    nextButton: {
      backgroundColor: colors.primary,
    },
    nextButtonText: {
      color: '#fff',
    },
    prevButtonText: {
      color: colors.text,
    },
    disabledButton: {
      opacity: 0.5,
    },
    resultContainer: {
      padding: 24,
      alignItems: 'center',
    },
    resultHeader: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
    },
    scoreCircle: {
      width: 160,
      height: 160,
      borderRadius: 80,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 8,
      marginVertical: 24,
    },
    scoreText: {
      fontSize: 42,
      fontWeight: '700',
    },
    scoreLabel: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 4,
    },
    resultStats: {
      width: '100%',
      marginVertical: 24,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    statLabel: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    statValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    finishButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 24,
      width: '100%',
    },
    finishButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    questionContainer: {
      backgroundColor: colors.backgroundPrimary,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    radioButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioButtonSelected: {
      borderColor: colors.primary,
    },
    radioButtonInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    correctAnswer: {
      borderColor: 'green',
      backgroundColor: 'rgba(0, 128, 0, 0.1)',
    },
    incorrectAnswer: {
      borderColor: 'red',
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
    optionLetter: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
      width: 24,
      textAlign: 'center',
      marginRight: 8,
    }
  });

  if (!quiz) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Loading quiz...</Text>
      </View>
    );
  }

  if (showResults) {
    const correctAnswers = quiz.questions.filter((q, idx) => selectedOptions[idx] === q.correctOption).length;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Quiz Results</Text>
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.resultContainer}>
            <Text style={styles.resultHeader}>Quiz Completed!</Text>
            
            <View style={[styles.scoreCircle, { borderColor: getScoreColor() }]}>
              <Text style={[styles.scoreText, { color: getScoreColor() }]}>{score}%</Text>
              <Text style={styles.scoreLabel}>Score</Text>
            </View>
            
            <View style={styles.resultStats}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Questions</Text>
                <Text style={styles.statValue}>{quiz.questions.length}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Correct Answers</Text>
                <Text style={styles.statValue}>{correctAnswers}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Incorrect Answers</Text>
                <Text style={styles.statValue}>{quiz.questions.length - correctAnswers}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Time Taken</Text>
                <Text style={styles.statValue}>{getElapsedTime()}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.finishButton} onPress={handleFinishQuiz}>
              <Text style={styles.finishButtonText}>Finish Quiz</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
          Alert.alert(
            'Exit Quiz',
            'Are you sure you want to exit? Your progress will be lost.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Exit', style: 'destructive', onPress: () => router.back() }
            ]
          );
        }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{quiz.title}</Text>
        </View>
        <Text style={styles.timer}>{timeRemaining}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionCounter}>Question {currentQuestionIndex + 1} of {quiz.questions.length}</Text>
          </View>
          
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          {currentQuestion.options.map((option, optionIndex) => (
            <TouchableOpacity
              key={optionIndex}
              style={[
                styles.optionButton,
                selectedOptions[currentQuestionIndex] === optionIndex ? styles.selectedOption : null
              ]}
              onPress={() => handleOptionSelect(optionIndex)}
            >
              <View style={[
                styles.radioButton,
                selectedOptions[currentQuestionIndex] === optionIndex ? styles.radioButtonSelected : null
              ]}>
                {selectedOptions[currentQuestionIndex] === optionIndex && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={styles.optionLetter}>{String.fromCharCode(65 + optionIndex)}</Text>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton, 
              styles.prevButton,
              currentQuestionIndex === 0 ? styles.disabledButton : null
            ]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <Ionicons name="arrow-back" size={18} color={colors.text} />
            <Text style={styles.prevButtonText}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNextQuestion}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Finish' : 'Next'}
            </Text>
            {!isLastQuestion && <Ionicons name="arrow-forward" size={18} color="#fff" />}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}