import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FeaturedCard from "../../components/FeaturedCard";
import SearchBar from "../../components/SearchBar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Upload from "../../components/upload";
import ChatScreen from "../../components/ChatScreen";
import ProfilePage from "../../components/ProfilePage";
import ItemDetails from "../../components/ItemDetails";
import { useLocalSearchParams } from "expo-router";
import styles from "../../components/ui/MarketplaceStyles";

interface Item {
  image: string;
  price: string;
  title: string;
  description: string;
  tag: string;
  id?: string;
  isLiked?: boolean;
  username: string;
}

export default function Marketplace() {
  const { method } = useLocalSearchParams<{ method?: string }>();
  const navigation = useNavigation();

  // Marketplace UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [chatDetails, setChatDetails] = useState<{ itemId: string; itemTitle: string; recipientId: string; recipientName: string } | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  // Default items if no marketplace items are stored
  const defaultItems: Item[] = [
    {
      id: "1",
      image: "https://via.placeholder.com/150",
      price: "₹299",
      title: "Refurbished Laptop",
      description: "Like new condition, 1 year warranty",
      tag: "Electronics",
      isLiked: false,
      username: "John Doe",
    },
    {
      id: "2",
      image: "https://via.placeholder.com/150",
      price: "₹45",
      title: "Engineering Books Set",
      description: "Perfect condition, 2nd year",
      tag: "Books",
      isLiked: false,
      username: "Jane Smith",
    },
    {
      id: "3",
      image: "https://tse2.mm.bing.net/th?id=OIP.uLgbHigFVo5rfNajwAhRXwHaE5&pid=Api&P=0&h=180",
      price: "₹99",
      title: "Mechanical Keyboard",
      description: "Brand new, RGB lighting",
      tag: "Electronics",
      isLiked: false,
      username: "Alice Johnson",
    },
    {
      id: "4",
      image: "https://via.placeholder.com/150",
      price: "₹199",
      title: "Student Calculator",
      description: "Scientific calculator, lightly used",
      tag: "Electronics",
      isLiked: false,
      username: "Bob Brown",
    },
  ];

  // Get categories based on item tags
  const getCategories = () => {
    const tags = new Set(items.map((item) => item.tag));
    return ["All", ...Array.from(tags)];
  };

  // Load marketplace data from AsyncStorage
  const loadMarketplaceData = async () => {
    setIsLoading(true);
    try {
      const storedItems = await AsyncStorage.getItem("marketplaceItems");
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        if (parsedItems.length > 0) {
          const itemsWithIds = parsedItems.map((item: Item, index: number) => ({
            ...item,
            id: item.id || `item-${index}`,
          }));
          setItems(itemsWithIds);
        } else {
          await AsyncStorage.setItem("marketplaceItems", JSON.stringify(defaultItems));
          setItems(defaultItems);
        }
      } else {
        await AsyncStorage.setItem("marketplaceItems", JSON.stringify(defaultItems));
        setItems(defaultItems);
      }
    } catch (error) {
      console.error("Error loading marketplace items:", error);
      setItems(defaultItems);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  // Automatically show the upload view if a valid method parameter is provided
  useEffect(() => {
    if (method === "sell" || method === "swap" || method === "donate") {
      setShowUpload(true);
    }
  }, [method]);

  useFocusEffect(
    React.useCallback(() => {
      loadMarketplaceData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadMarketplaceData();
  };

  // Filter items based on search query, selected tag, and wishlist toggle
  const filteredItems = items.filter((item) => {
    const matchesTag = selectedTag === "All" || item.tag === selectedTag;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWishlist = !showWishlist || item.isLiked;
    return matchesTag && matchesSearch && matchesWishlist;
  });

  const toggleWishlist = () => {
    setShowWishlist(!showWishlist);
  };

  // Toggle like status for an item and update AsyncStorage
  const toggleLike = async (itemId: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, isLiked: !item.isLiked } : item
    );
    setItems(updatedItems);
    await AsyncStorage.setItem("marketplaceItems", JSON.stringify(updatedItems));
  };

  // Toggle the upload view
  const toggleUploadView = () => {
    setShowUpload(!showUpload);
  };

  // Open the chat screen with provided details
  const openChatScreen = (chatDetails: { itemId: string; itemTitle: string; recipientId: string; recipientName: string }) => {
    setChatDetails(chatDetails);
    setShowChat(true);
  };

  const toggleProfileView = () => {
    setShowProfile(!showProfile);
  };

  // Open item details view by setting the selected item
  const openItemDetails = (item: Item) => {
    setSelectedItem(item);
  };

  // Start a chat for the given item
  const startChat = (item: Item) => {
    openChatScreen({
      itemId: item.id!,
      itemTitle: item.title,
      recipientId: item.id!,
      recipientName: item.username,
    });
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
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
      {/* Render ItemDetails if an item is selected */}
      {selectedItem ? (
        <ItemDetails item={selectedItem} onStartChat={() => startChat(selectedItem)} onClose={closeItemDetails} />
      ) : showUpload ? (
        // Render the Upload component with onClose callback so that it closes properly
        <Upload onClose={toggleUploadView} />
      ) : showChat && chatDetails ? (
        <ChatScreen route={{ key: "chat", name: "params", params: chatDetails }} />
      ) : showProfile ? (
        <ProfilePage />
      ) : (
        <>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            tags={getCategories()}
            showWishlist={showWishlist}
            toggleWishlist={toggleWishlist}
          />
          {filteredItems.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />}
            >
              {!showWishlist && (
                <>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Featured Items</Text>
                    <TouchableOpacity>
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
                    {filteredItems.slice(0, 3).map((item, index) => (
                      <View key={`featured-${index}`} style={styles.featuredItem}>
                        <FeaturedCard
                          image={item.image}
                          price={item.price}
                          title={item.title}
                          description={item.description}
                          isLiked={item.isLiked ?? false}
                          onLikeToggle={() => toggleLike(item.id!)}
                          onPress={() => openItemDetails(item)}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </>
              )}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{showWishlist ? "Saved Items" : "All Items"}</Text>
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
                      onLikeToggle={() => toggleLike(item.id!)}
                      onPress={() => openItemDetails(item)}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.emptyStateImage} />
              <Text style={styles.emptyStateTitle}>{showWishlist ? "No liked items" : "No items found"}</Text>
              <Text style={styles.emptyStateText}>
                {showWishlist
                  ? "Items you like will appear here. Start exploring the marketplace!"
                  : "Try adjusting your search or filters, or add some items to get started!"}
              </Text>
              <TouchableOpacity style={styles.emptyStateButton} onPress={showWishlist ? toggleWishlist : toggleUploadView}>
                <Text style={styles.emptyStateButtonText}>
                  {showWishlist ? "Browse Marketplace" : "Add Item"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
      {/* Floating button to toggle the Upload view */}
      <TouchableOpacity style={styles.addButton} onPress={toggleUploadView}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
