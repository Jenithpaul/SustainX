// filepath: c:\Users\jenit\Desktop\SustainXsussyDevs\trialll1\app\(tabs)\marketplace.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, StatusBar, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FeaturedCard from "../../components/FeaturedCard";
import SearchBar from "../../components/SearchBar";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Upload from "../../components/upload"; // Import the Upload component
import ChatScreen from "../../components/ChatScreen"; // Import the ChatScreen component

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showUpload, setShowUpload] = useState(false); // State to toggle upload view
  const [showChat, setShowChat] = useState(false); // State to toggle chat view
  
  interface Item {
    image: string;
    price: string;
    title: string;
    description: string;
    tag: string;
    id?: string;
    isLiked?: boolean;
  }

  const [items, setItems] = useState<Item[]>([]);

  const defaultItems = [
    {
      id: "1",
      image: "https://via.placeholder.com/150",
      price: "₹299",
      title: "Refurbished Laptop",
      description: "Like new condition, 1 year warranty",
      tag: "Electronics",
      isLiked: false,
    },
    {
      id: "2",
      image: "https://via.placeholder.com/150",
      price: "₹45",
      title: "Engineering Books Set",
      description: "Perfect condition, 2nd year",
      tag: "Books",
      isLiked: false,
    },
    {
      id: "3",
      image: "https://via.placeholder.com/150",
      price: "₹99",
      title: "Mechanical Keyboard",
      description: "Brand new, RGB lighting",
      tag: "Electronics",
      isLiked: false,
    },
    {
      id: "4",
      image: "https://via.placeholder.com/150",
      price: "₹199",
      title: "Student Calculator",
      description: "Scientific calculator, lightly used",
      tag: "Electronics",
      isLiked: false,
    },
  ];

  // Get all unique categories
  const getCategories = () => {
    const tags = new Set(items.map(item => item.tag));
    return ["All", ...Array.from(tags)];
  };

  // Load data from AsyncStorage
  const loadMarketplaceData = async () => {
    setIsLoading(true);
    try {
      const storedItems = await AsyncStorage.getItem('marketplaceItems');
      
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        if (parsedItems.length > 0) {
          // Ensure all items have IDs
          const itemsWithIds = parsedItems.map((item: Item, index: number) => ({
            ...item,
            id: item.id || `item-${index}`
          }));
          setItems(itemsWithIds);
        } else {
          // If nothing in storage, store default items
          await AsyncStorage.setItem('marketplaceItems', JSON.stringify(defaultItems));
          setItems(defaultItems);
        }
      } else {
        // If no stored items yet, initialize with default
        await AsyncStorage.setItem('marketplaceItems', JSON.stringify(defaultItems));
        setItems(defaultItems);
      }
    } catch (error) {
      console.error("Error loading marketplace items:", error);
      setItems(defaultItems); // Fallback to default items on error
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadMarketplaceData();
  }, []);

  // Refresh on focus
  useFocusEffect(
    React.useCallback(() => {
      loadMarketplaceData();
      return () => {};
    }, [])
  );

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadMarketplaceData();
  };

  // Filter items based on search, tag, and wishlist status
  const filteredItems = items.filter(item => {
    const matchesTag = selectedTag === "All" || item.tag === selectedTag;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWishlist = !showWishlist || item.isLiked;
    return matchesTag && matchesSearch && matchesWishlist;
  });

  // Navigate to upload screen
  const navigateToUpload = () => {
    router.push('/upload'); // Ensure the path matches the registered screen name
  };
  
  // Toggle between marketplace and wishlist
  const toggleWishlist = () => {
    setShowWishlist(!showWishlist);
  };
  
  // Navigate to chats
  const navigateToChats = () => {
    // This would navigate to your chat screen
    // router.push('/chats');
    console.log("Navigate to chats");
  };

  // Toggle like status of an item
  const toggleLike = async (itemId: string) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, isLiked: !item.isLiked } : item
    );
    setItems(updatedItems);
    await AsyncStorage.setItem('marketplaceItems', JSON.stringify(updatedItems));
  };

  // Toggle between marketplace and upload view
  const toggleUploadView = () => {
    setShowUpload(!showUpload);
  };

  // Toggle between marketplace and chat view
  const toggleChatView = () => {
    setShowChat(!showChat);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading marketplace...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />
      
      {showUpload ? (
        <Upload />
      ) : showChat ? (
        <ChatScreen route={{ key: "chat", name: "params", params: { itemId: "1", itemTitle: "Sample Item", recipientId: "123", recipientName: "John Doe" } }} />
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {showWishlist ? "My Wishlist" : "SustainX Marketplace"}
            </Text>
            <View style={styles.headerActions}></View>
              <TouchableOpacity style={styles.iconButton} onPress={toggleChatView}>
                <Ionicons name="chatbubble-outline" size={24} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton}>
                <Ionicons name="person-circle-outline" size={30} color="#4CAF50" />
              </TouchableOpacity>
          </View>

          {/* Search and Filter */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            tags={getCategories()}
            showWishlist={showWishlist}
            toggleWishlist={toggleWishlist}
          />
          
          {/* Content */}
          {filteredItems.length > 0 ? (
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />
              }
            >
              {!showWishlist && (
                <>
                  {/* Featured Items Section */}
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Featured Items</Text>
                    <TouchableOpacity>
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Featured Items Horizontal Scroll */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.featuredScroll}
                  >
                    {filteredItems.slice(0, 3).map((item, index) => (
                      <View key={`featured-${index}`} style={styles.featuredItem}>
                        <FeaturedCard
                          image={item.image}
                          price={item.price}
                          title={item.title}
                          description={item.description}
                          key={item.id || `feat-${index}`}
                          isLiked={item.isLiked ?? false}
                          onLikeToggle={() => {
                            toggleLike(item.id!);
                            if (showWishlist) {
                              setItems(prevItems => prevItems.filter(i => i.id !== item.id));
                            }
                          }}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </>
              )}

              {/* All Items Grid */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {showWishlist ? "Saved Items" : "All Items"}
                </Text>
                {!showWishlist && (
                  <View style={styles.sortContainer}>
                    <Text style={styles.sortText}>Sort by:</Text>
                    <TouchableOpacity style={styles.sortButton}>
                      <Text style={styles.sortButtonText}>Newest</Text>
                      <Ionicons name="chevron-down" size={16} color="#4CAF50" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.gridContainer}>
                {filteredItems.map((item, index) => (
                  <View key={`grid-${index}`} style={styles.gridItem}>
                    <FeaturedCard
                      image={item.image}
                      price={item.price}
                      title={item.title}
                      description={item.description}
                      isLiked={item.isLiked ?? false}
                      onLikeToggle={() => {
                        toggleLike(item.id!);
                        if (showWishlist) {
                          setItems(prevItems => prevItems.filter(i => i.id !== item.id));
                        }
                      }}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Image 
                source={{ uri: "https://via.placeholder.com/150" }} 
                style={styles.emptyStateImage} 
              />
              <Text style={styles.emptyStateTitle}>
                {showWishlist ? "No liked items" : "No items found"}
              </Text>
              <Text style={styles.emptyStateText}>
                {showWishlist 
                  ? "Items you like will appear here. Start exploring the marketplace!" 
                  : "Try adjusting your search or filters, or add some items to get started!"}
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton} 
                onPress={showWishlist ? toggleWishlist : toggleUploadView}
              >
                <Text style={styles.emptyStateButtonText}>
                  {showWishlist ? "Browse Marketplace" : "Add Item"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Floating Action Button */}
          <TouchableOpacity style={styles.addButton} onPress={toggleUploadView}>
            <Ionicons name="add" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4CAF50",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginRight: 4,
  },
  profileButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  featuredScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  featuredItem: {
    marginRight: 8,
    width: 200,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  sortButtonText: {
    fontSize: 14,
    color: "#4CAF50",
    marginRight: 4,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  gridItem: {
    width: "48%",
    marginBottom: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyStateImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    right: 24,
    bottom: 85,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
