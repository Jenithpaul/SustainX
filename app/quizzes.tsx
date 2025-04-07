import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'expo-router';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
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

const quizData: Quiz[] = [
  {
    id: '1',
    title: 'React Native Basics',
    description: 'Test your knowledge of React Native fundamentals',
    questions: [
      {
        question: 'What is React Native?',
        options: ['A library', 'A framework', 'A language', 'None of the above'],
        correctOption: 1,
      },
      {
        question: 'What is JSX?',
        options: ['JavaScript XML', 'Java Syntax', 'JavaScript Extension', 'None of the above'],
        correctOption: 0,
      },
    ],
    duration: '20 mins',
    completed: false,
    thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    title: 'JavaScript Fundamentals',
    description: 'Basics of JavaScript programming language',
    questions: [
      {
        question: 'Which keyword is used to declare variables in JavaScript?',
        options: ['var', 'variable', 'v', 'int'],
        correctOption: 0,
      },
      {
        question: 'What does DOM stand for?',
        options: ['Document Object Model', 'Data Object Model', 'Document Oriented Model', 'Digital Object Model'],
        correctOption: 0,
      },
      {
        question: 'Which method adds an element at the end of an array?',
        options: ['push()', 'pop()', 'append()', 'add()'],
        correctOption: 0,
      },
    ],
    duration: '30 mins',
    completed: false,
    thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    title: 'CSS Styling Quiz',
    description: 'Test your knowledge of CSS properties and styling',
    questions: [
      {
        question: 'Which property is used to change the background color?',
        options: ['color', 'background-color', 'bgcolor', 'background'],
        correctOption: 1,
      },
      {
        question: 'Which CSS property controls the text size?',
        options: ['text-size', 'font-style', 'font-size', 'text-style'],
        correctOption: 2,
      },
    ],
    duration: '15 mins',
    completed: false,
    thumbnail: 'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
];

export default function QuizzesScreen() {
  const pathname = usePathname();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { colors } = useThemeContext();
  const [quizzes, setQuizzes] = useState<Quiz[]>(quizData);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    if (params.newQuiz) {
      try {
        const parsedQuiz = JSON.parse(params.newQuiz as string);
        setQuizzes(prev => [...prev, parsedQuiz]);
      } catch (error) {
        console.error('Error parsing quiz data:', error);
      }
    }
  }, [params.newQuiz]);

  const handleBackClick = () => {
    navigation.goBack();
  };

  const handleStartQuiz = (quiz: Quiz) => {
    // Navigate to the quiz-session screen with the quiz data
    router.push({
      pathname: 'quizzes-sessions', // Updated to match the actual filename
      params: { quizData: JSON.stringify(quiz) }
    });
  };

  const handleViewQuizDetails = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const handleClose = () => {
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: false,
    }).start(() => {
      setSelectedQuiz(null);
    });
  };

  const handleAddQuizClick = () => {
    navigation.navigate('add-quiz' as never);
  };

  const headerHeight = 80;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: headerHeight + 20,
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
      justifyContent: 'center',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.backgroundPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 12,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 100, // Extra padding at bottom for FAB
    },
    quizCard: {
      marginVertical: 8,
      backgroundColor: colors.backgroundPrimary,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    thumbnailContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    durationBadge: {
      position: 'absolute',
      right: 8,
      bottom: 8,
      backgroundColor: 'rgba(0,0,0,0.75)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    durationText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '500',
    },
    quizContent: {
      padding: 16,
    },
    quizTitle: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    },
    quizDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    quizInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    questionsCount: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 12,
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 4,
    },
    startButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    viewDetailsButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 8,
    },
    startButtonText: {
      color: '#fff',
      fontWeight: '500',
      fontSize: 14,
    },
    viewDetailsText: {
      color: colors.primary,
      fontWeight: '500',
      fontSize: 14,
    },
    fabButton: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
      zIndex: 2,
    },
    fabIcon: {
      color: '#fff',
    },
    quizView: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    quizHeaderContainer: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 16,
      marginBottom: 20,
    },
    quizViewTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    quizViewDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    questionCard: {
      backgroundColor: colors.backgroundPrimary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    questionText: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 16,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      marginVertical: 6,
      backgroundColor: colors.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    quizButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
    },
    quizButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 8,
    },
    quizButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    closeButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 1,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyStateText: {
      fontSize: 18,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    uploadQuizContainer: {
      position: 'absolute',
      top: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [height, 0],
      }),
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.background,
      zIndex: 100,
      padding: 20,
    },
    inputField: {
      backgroundColor: colors.backgroundPrimary,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 8,
    },
    header2: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textSecondary,
      marginBottom: 16,
    },
  });

  const renderQuizItem = ({ item }: { item: Quiz }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handleViewQuizDetails(item)}
    >
      <View style={styles.quizCard}>
        <View style={styles.thumbnailContainer}>
          <Image 
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
          />
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>
        <View style={styles.quizContent}>
          <Text style={styles.quizTitle}>{item.title}</Text>
          <Text style={styles.quizDescription}>{item.description}</Text>
          <View style={styles.quizInfo}>
            <Text style={styles.questionsCount}>{item.questions.length} Questions</Text>
            {item.completed && (
              <Ionicons name="checkmark-circle" size={18} color="green" />
            )}
          </View>
          <View style={styles.divider} />
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => handleViewQuizDetails(item)}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => handleStartQuiz(item)}
            >
              <Text style={styles.startButtonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const expandedStyle = {
    position: 'absolute' as const,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 0],
    }),
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 100,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackClick} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="school" size={20} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Quizzes</Text>
        </View>
      </View>

      {quizzes.length > 0 ? (
        <FlatList
          data={quizzes}
          renderItem={renderQuizItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.header2}>{quizzes.length} Available Quizzes</Text>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            You don't have any quizzes yet. Quizzes will be added by administrators.
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.fabButton}
        onPress={handleAddQuizClick}
      >
        <Ionicons name="add" size={28} style={styles.fabIcon} />
      </TouchableOpacity>

      {selectedQuiz && (
        <Animated.View style={expandedStyle}>
          <View style={styles.quizView}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            
            <View style={styles.quizHeaderContainer}>
              <Text style={styles.quizViewTitle}>{selectedQuiz.title}</Text>
              <Text style={styles.quizViewDescription}>{selectedQuiz.description}</Text>
              <Text style={styles.questionsCount}>
                {selectedQuiz.questions.length} Questions • {selectedQuiz.duration}
              </Text>
            </View>

            <FlatList
              data={selectedQuiz.questions.slice(0, 1)} // Only show the first question as preview
              renderItem={({ item, index }) => (
                <View style={styles.questionCard}>
                  <Text style={styles.questionText}>
                    Question Preview: {item.question}
                  </Text>
                  {/* Show only placeholder options instead of actual answers */}
                  <View style={styles.optionButton}>
                    <Text style={styles.optionText}>Option 1</Text>
                  </View>
                  <View style={styles.optionButton}>
                    <Text style={styles.optionText}>Option 2</Text>
                  </View>
                  {item.options.length > 2 && (
                    <Text style={{color: colors.textSecondary, marginTop: 10}}>
                      (+ {item.options.length - 2} more options)
                    </Text>
                  )}
                </View>
              )}
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                <Text style={{color: colors.textSecondary, textAlign: 'center', marginBottom: 20}}>
                  {selectedQuiz.questions.length > 1 ? `+ ${selectedQuiz.questions.length - 1} more questions` : ''}
                </Text>
              }
            />

            <View style={styles.quizButtonContainer}>
              <TouchableOpacity 
                style={styles.quizButton}
                onPress={() => {
                  handleClose();
                  handleStartQuiz(selectedQuiz);
                }}
              >
                <Text style={styles.quizButtonText}>Start Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}