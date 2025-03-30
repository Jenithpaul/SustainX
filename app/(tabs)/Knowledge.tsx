import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  RefreshControl 
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useKnowledgeStyles } from "../../ui/KnowledgeStyle";
import Header from "../../components/Header";

export default function KnowledgeCentre() {
  const navigation = useNavigation();
  const router = useRouter();
  const styles = useKnowledgeStyles();
  
  const [activeTab, setActiveTab] = useState("Home");
  const [refreshing, setRefreshing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(""), 2000);
  };

  const handleBackClick = () => {
    navigation.goBack();
  };

  const handleSearchClick = () => {
    navigation.navigate("Search" as never);
  };

  const handleViewAllFeatured = () => {
    navigation.navigate("Featured" as never);
  };

  const handleStartLearning = () => {
    // navigation.navigate('CourseDetail' as never, { id: 'sustainable-development-goals' });
  };

  const handleCategoryClick = (category: string) => {
    navigation.navigate(category.charAt(0).toUpperCase() + category.slice(1) as never);
  };

  const handleViewAllMagazines = () => {
    navigation.navigate("Magazines" as never);
  };

  const handleMagazineClick = (id: string) => {
    // navigation.navigate('MagazineDetail' as never, { id });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab.toLowerCase() !== "home") {
      (navigation as any).navigate(tab.charAt(0).toUpperCase() + tab.slice(1));
    }
  };

  const navigateToProfile = () => {
    router.push({
      pathname: "/profile",
      params: { previousScreen: "knowledge" }
    });
  };

  const loadData = async () => {
    // Simulated data loading (replace with actual API calls if needed)
    setTimeout(() => {
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
      id: "podcasts",
      title: "Podcasts",
      count: "12 New Episodes",
      icon: <Feather name="mic" size={20} color="#6366F1" />,
      bgColor: "#EEF2FF"
    },
    {
      id: "courses",
      title: "Courses",
      count: "45 Available",
      icon: <Feather name="book" size={20} color="#3B82F6" />,
      bgColor: "#EFF6FF"
    },
    {
      id: "quizzes",
      title: "Quizzes",
      count: "8 New Quizzes",
      icon: <Feather name="target" size={20} color="#F97316" />,
      bgColor: "#FFF7ED"
    },
    {
      id: "mental-health",
      title: "Mental Health",
      count: "24/7 Support",
      icon: <Feather name="heart" size={20} color="#EF4444" />,
      bgColor: "#FEF2F2"
    }
  ];

  const magazines = [
    {
      id: "green-campus-today",
      title: "Green Campus Today",
      date: "March 2025 Edition",
      color: "#D1FAE5",
      image: "https://via.placeholder.com/60"
    },
    {
      id: "sustainability-report",
      title: "Sustainability Report",
      date: "Environmental Impact Analysis",
      color: "#DBEAFE",
      image: "https://via.placeholder.com/60"
    }
  ];

  return (
    <View style={styles.container}>
      <Header currentTab="Knowledge" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={["#10B981"]} 
          />
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
            <Text style={styles.courseDescription}>
              Learn about UN's 17 SDGs and their implementation
            </Text>
            <TouchableOpacity 
              style={styles.startLearningButton} 
              onPress={handleStartLearning}
            >
              <Text style={styles.startLearningText}>Start Learning</Text>
              <Feather name="chevron-right" size={16} color="#10B981" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
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
          {magazines.map((magazine) => (
            <TouchableOpacity 
              key={magazine.id}
              style={styles.magazineItem}
              onPress={() => handleMagazineClick(magazine.id)}
            >
              <View style={[styles.magazineIcon, { backgroundColor: magazine.color }]}>
                {/* Placeholder for magazine image/icon */}
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
      {feedbackMessage !== "" && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{feedbackMessage}</Text>
        </View>
      )}
    </View>
  );
}