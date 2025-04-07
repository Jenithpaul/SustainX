// Marketplace.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FeaturedCard from "../../components/FeaturedCard";
import SearchBar from "../../components/SearchBar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Upload from "../../components/upload";
import ChatScreen from "../../components/ChatScreen";
import ProfilePage from "../../components/ProfilePage";
import ItemDetails from "../../components/ItemDetails";
import { useLocalSearchParams, router } from "expo-router";
import { useMarketplaceStyles } from "../../ui/MarketplaceStyles";
import Header from "../../components/Header";
import ImageViewing from "react-native-image-viewing";

interface Item {
  image: string;
  images?: string[]; // New: Array of image URIs
  price: string;
  title: string;
  description: string;
  tag: string;
  id?: string;
  isLiked?: boolean;
  username: string;
  negotiable?: boolean;
}

export default function Marketplace() {
  const { method } = useLocalSearchParams<{ method?: string }>();
  const navigation = useNavigation();
  const styles = useMarketplaceStyles();

  // Marketplace UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [chatDetails, setChatDetails] = useState<{
    itemId: string;
    itemTitle: string;
    recipientId: string;
    recipientName: string;
  } | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  // New: Image viewer state for expanded/swipe view
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState<{ uri: string }[]>([]);
  const [currentViewingItem, setCurrentViewingItem] = useState<Item | null>(null);

  // Default items if no marketplace items are stored
  const defaultItems: Item[] = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      images: [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
      ],
      price: "₹299",
      title: "Refurbished Laptop",
      description: "Like new condition, 1 year warranty",
      tag: "Electronics",
      isLiked: false,
      username: "John Doe",
      negotiable: true,
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"],
      price: "₹45",
      title: "Engineering Books Set",
      description: "Perfect condition, 2nd year",
      tag: "Books",
      isLiked: false,
      username: "Jane Smith",
      negotiable: false,
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"],
      price: "₹99",
      title: "Mechanical Keyboard",
      description: "Brand new, RGB lighting",
      tag: "Electronics",
      isLiked: false,
      username: "Alice Johnson",
      negotiable: true,
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      images: ["https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"],
      price: "₹199",
      title: "Student Calculator",
      description: "Scientific calculator, lightly used",
      tag: "Electronics",
      isLiked: false,
      username: "Bob Brown",
      negotiable: false,
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

  // Debug the method parameter and show upload view if valid
  useEffect(() => {
    console.log("Method parameter received:", method);
    const methodValue = method?.toLowerCase();
    if (methodValue === "sell" || methodValue === "swap" || methodValue === "donate") {
      console.log("Setting showUpload to true for method:", methodValue);
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

  // Toggle the upload view and reload marketplace data when closing
  const toggleUploadView = () => {
    if (showUpload) {
      loadMarketplaceData();
    }
    setShowUpload(!showUpload);
  };

  // Open item details view by setting the selected item
  const openItemDetails = (item: Item) => {
    setSelectedItem(item);
  };

  // Start a chat for the given item
  const startChat = (item: Item) => {
    router.push({
      pathname: "/(tabs)/Messages",
      params: {
        itemId: item.id!,
        recipientId: item.id!
      }
    });
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  // Open image viewer modal when image is tapped in FeaturedCard.
  // Use the item's 'images' array if available.
  const openImageViewer = (item: Item) => {
    try {
      // Ensure images are in the correct format for the component
      const imgs = item.images && item.images.length > 0 
        ? item.images.map(uri => ({ uri })) 
        : [{ uri: item.image }];
      
      setCurrentImages(imgs);
      setCurrentViewingItem(item);
      setIsImageViewerVisible(true);
    } catch (error) {
      console.error("Error opening image viewer:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Header currentTab="Marketplace" />
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading marketplace...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header currentTab="Marketplace" />
      {selectedItem ? (
        <ItemDetails 
          item={selectedItem} 
          onStartChat={() => startChat(selectedItem)} 
          onClose={closeItemDetails} 
        />
      ) : showUpload ? (
        <Upload 
          onClose={toggleUploadView} 
          initialMethod={(method?.toLowerCase() as "sell" | "swap" | "donate") || "sell"} 
        />
      ) : showChat && chatDetails ? (
        <ChatScreen route={{ key: "chat", name: "params", params: chatDetails }} />
      ) : showProfile ? (
        <ProfilePage onClose={() => setShowProfile(false)} />
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
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />
              }
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
                          negotiable={item.negotiable}
                          onLikeToggle={() => toggleLike(item.id!)}
                          onPress={() => openItemDetails(item)}
                          onImagePress={() => openImageViewer(item)}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </>
              )}
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
                      negotiable={item.negotiable}
                      onLikeToggle={() => toggleLike(item.id!)}
                      onPress={() => openItemDetails(item)}
                      onImagePress={() => openImageViewer(item)}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.emptyStateImage} />
              <Text style={styles.emptyStateTitle}>
                {showWishlist ? "No liked items" : "No items found"}
              </Text>
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
      <TouchableOpacity style={styles.addButton} onPress={toggleUploadView}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal for image viewing with multi-image swipe and caption footer */}
      {isImageViewerVisible && currentImages.length > 0 && (
        <ImageViewing
          images={currentImages}
          imageIndex={0}
          visible={isImageViewerVisible}
          onRequestClose={() => setIsImageViewerVisible(false)}
          FooterComponent={({ imageIndex }) => 
            currentViewingItem ? (
              <View style={{ 
                padding: 20, 
                backgroundColor: "rgba(0,0,0,0.5)",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0 
              }}>
                <Text style={{ 
                  color: "#fff", 
                  fontSize: 18, 
                  fontWeight: "bold" 
                }}>
                  {currentViewingItem.title}
                </Text>
                <Text style={{ 
                  color: "#fff", 
                  fontSize: 14, 
                  marginTop: 4 
                }}>
                  {currentViewingItem.description}
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View> 
  );
}
