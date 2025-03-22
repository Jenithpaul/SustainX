import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function KnowledgeCentre() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(''), 2000);
  };

  const handleBackClick = () => {
    navigation.goBack();
  };

  const handleSearchClick = () => {
    navigation.navigate('Search' as never);
  };

  const handleViewAllFeatured = () => {
    navigation.navigate('Featured' as never);
  };

  const handleStartLearning = () => {
    // navigation.navigate('CourseDetail' as never, { id: 'sustainable-development-goals' });
  };

  const handleCategoryClick = (category: string) => {
    navigation.navigate(category.charAt(0).toUpperCase() + category.slice(1) as never);
  };

  const handleViewAllMagazines = () => {
    navigation.navigate('Magazines' as never);
  };

  const handleMagazineClick = (id: string) => {
    // navigation.navigate('MagazineDetail' as never, { id });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'home') {
      (navigation as any).navigate(tab.charAt(0).toUpperCase() + tab.slice(1));
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    // Simulated data loading
    setTimeout(() => {
      setIsLoading(false);
      setRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      return () => {};
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const categories = [
    {
      id: 'podcasts',
      title: 'Podcasts',
      count: '12 New Episodes',
      icon: <Feather name="mic" size={20} color="#6366F1" />,
      bgColor: '#EEF2FF'
    },
    {
      id: 'courses',
      title: 'Courses',
      count: '45 Available',
      icon: <Feather name="book" size={20} color="#3B82F6" />,
      bgColor: '#EFF6FF'
    },
    {
      id: 'quizzes',
      title: 'Quizzes',
      count: '8 New Quizzes',
      icon: <Feather name="target" size={20} color="#F97316" />,
      bgColor: '#FFF7ED'
    },
    {
      id: 'mental-health',
      title: 'Mental Health',
      count: '24/7 Support',
      icon: <Feather name="heart" size={20} color="#EF4444" />,
      bgColor: '#FEF2F2'
    }
  ];

  const magazines = [
    {
      id: 'green-campus-today',
      title: 'Green Campus Today',
      date: 'March 2025 Edition',
      color: '#D1FAE5',
      image: 'https://via.placeholder.com/60'
    },
    {
      id: 'sustainability-report',
      title: 'Sustainability Report',
      date: 'Environmental Impact Analysis',
      color: '#DBEAFE',
      image: 'https://via.placeholder.com/60'
    }
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading knowledge centre...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackClick}>
          <Feather name="chevron-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Knowledge Centre</Text>
        <TouchableOpacity onPress={handleSearchClick}>
          <Feather name="search" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#10B981"]} />
        }
      >
        {/* Featured Section */}
        <View style={styles.featuredContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured This Week</Text>
            <TouchableOpacity onPress={handleViewAllFeatured}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.featuredCard}>
            <Text style={styles.courseTag}>New Course</Text>
            <Text style={styles.courseTitle}>Sustainable Development Goals</Text>
            <Text style={styles.courseDescription}>Learn about UN's 17 SDGs and their implementation</Text>
            <TouchableOpacity style={styles.startLearningButton} onPress={handleStartLearning}>
              <Text style={styles.startLearningText}>Start Learning</Text>
              <Feather name="chevron-right" size={16} color="#10B981" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesGrid}>
            {categories.map(category => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                onPress={() => handleCategoryClick(category.id)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.bgColor }]}>
                  {category.icon}
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryCount}>{category.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Magazines Section */}
        <View style={styles.magazinesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>University Magazines</Text>
            <TouchableOpacity onPress={handleViewAllMagazines}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {magazines.map(magazine => (
            <TouchableOpacity 
              key={magazine.id}
              style={styles.magazineItem}
              onPress={() => handleMagazineClick(magazine.id)}
            >
              <View style={[styles.magazineIcon, { backgroundColor: magazine.color }]}>
                {/* Placeholder for magazine icon/image */}
              </View>
              <View style={styles.magazineInfo}>
                <Text style={styles.magazineTitle}>{magazine.title}</Text>
                <Text style={styles.magazineDate}>{magazine.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Feedback Toast */}
      {feedbackMessage !== '' && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{feedbackMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#10B981",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  featuredContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#ECFDF5",
    borderRadius: 8,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#047857",
  },
  viewAllText: {
    fontSize: 14,
    color: "#10B981",
  },
  featuredCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  courseTag: {
    fontSize: 12,
    color: "#10B981",
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  startLearningButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  startLearningText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10B981",
    marginRight: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: "#6B7280",
  },
  magazinesContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 80,
  },
  magazineItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  magazineIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  magazineInfo: {
    flex: 1,
  },
  magazineTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  magazineDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  toast: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    margin: 40,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  toastText: {
    color: "white",
    fontSize: 14,
  },
});