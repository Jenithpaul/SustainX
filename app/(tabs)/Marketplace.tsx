import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, TextInput, Alert, Switch } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import FeaturedCard from "../../components/FeaturedCard";
import SearchBar from "../../components/SearchBar";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Upload from "../../components/upload";
import ChatScreen from "../../components/ChatScreen";
import ProfilePage from '../../components/ProfilePage';
import ChatList from "../../components/ChatList";
import ItemDetails from "../../components/ItemDetails";
import { useLocalSearchParams } from "expo-router"; // Import useLocalSearchParams
import * as ImagePicker from "expo-image-picker"; // Add import for ImagePicker

export default function Marketplace() {
  const { method } = useLocalSearchParams<{ method?: string }>(); // Read the method parameter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showChatList, setShowChatList] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [chatDetails, setChatDetails] = useState<{ itemId: string; itemTitle: string; recipientId: string; recipientName: string } | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"sell" | "swap" | "donate">("sell"); // Default to "sell"

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("https://via.placeholder.com/150");

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

  const getCategories = () => {
    const tags = new Set(items.map(item => item.tag));
    return ["All", ...Array.from(tags)];
  };

  const loadMarketplaceData = async () => {
    setIsLoading(true);
    try {
      const storedItems = await AsyncStorage.getItem('marketplaceItems');
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        if (parsedItems.length > 0) {
          const itemsWithIds = parsedItems.map((item: Item, index: number) => ({
            ...item,
            id: item.id || `item-${index}`
          }));
          setItems(itemsWithIds);
        } else {
          await AsyncStorage.setItem('marketplaceItems', JSON.stringify(defaultItems));
          setItems(defaultItems);
        }
      } else {
        await AsyncStorage.setItem('marketplaceItems', JSON.stringify(defaultItems));
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

  useEffect(() => {
    if (method === "sell" || method === "swap" || method === "donate") {
      setUploadMethod(method); // Set the upload method based on the parameter
      setShowUpload(true); // Automatically show the Upload section
    }
  }, [method]);

  useFocusEffect(
    React.useCallback(() => {
      loadMarketplaceData();
      return () => {};
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadMarketplaceData();
  };

  const filteredItems = items.filter(item => {
    const matchesTag = selectedTag === "All" || item.tag === selectedTag;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWishlist = !showWishlist || item.isLiked;
    return matchesTag && matchesSearch && matchesWishlist;
  });

  const toggleWishlist = () => {
    setShowWishlist(!showWishlist);
  };

  const toggleLike = async (itemId: string) => {
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, isLiked: !item.isLiked } : item
    );
    setItems(updatedItems);
    await AsyncStorage.setItem('marketplaceItems', JSON.stringify(updatedItems));
  };

  const toggleUploadView = () => {
    setShowUpload(!showUpload);
  };

  const toggleChatListView = () => {
    setShowChatList(!showChatList);
  };

  const openChatScreen = (chatDetails: { itemId: string; itemTitle: string; recipientId: string; recipientName: string }) => {
    setChatDetails(chatDetails);
    setShowChat(true);
  };

  const toggleProfileView = () => {
    setShowProfile(!showProfile);
  };

  const openItemDetails = (item: Item) => {
    setSelectedItem(item);
  };

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

  const renderMethodButton = ({
    method,
    label,
    color,
  }: {
    method: "sell" | "swap" | "donate";
    label: string;
    color: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.methodButton,
        { backgroundColor: uploadMethod === method ? color : "#f0f0f0" },
      ]}
      onPress={() => setUploadMethod(method)}
    >
      <Text
        style={[
          styles.methodButtonText,
          { color: uploadMethod === method ? "white" : "#666" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert("Missing Information", "Please enter a title for your item");
      return false;
    }

    if (!description.trim()) {
      Alert.alert(
        "Missing Information",
        "Please provide a description for your item"
      );
      return false;
    }

    if (uploadMethod === "sell" && (!price || parseFloat(price) <= 0)) {
      Alert.alert("Invalid Price", "Please enter a valid price for your item");
      return false;
    }

    return true;
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        setImageUrl(result.assets[0].uri);
      }
    }
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      let formattedPrice = "Free";
      if (uploadMethod === "sell") {
        formattedPrice = `₹${price}`;
      } else if (uploadMethod === "swap") {
        formattedPrice = "For Swap";
      }

      const newItem = {
        image: imageUrl,
        price: formattedPrice,
        title: title.trim(),
        description: description.trim(),
        tag: category,
        negotiable: uploadMethod === "sell" ? negotiable : false,
        listedDate: new Date().toISOString(),
        type: uploadMethod,
      };

      const storedItemsStr = await AsyncStorage.getItem("marketplaceItems");
      const storedItems = storedItemsStr ? JSON.parse(storedItemsStr) : [];
      storedItems.unshift(newItem);

      await AsyncStorage.setItem(
        "marketplaceItems",
        JSON.stringify(storedItems)
      );

      Alert.alert("Success!", "Your item has been listed on the marketplace", [
        {
          text: "OK",
          onPress: () => {
            setShowUpload(false); // Close the upload section
          },
        },
      ]);
    } catch (error) {
      console.error("Error saving item:", error);
      Alert.alert("Error", "Failed to save your item. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
      {showUpload ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Upload Method Selection */}
          <View style={styles.methodContainer}>
            {renderMethodButton({
              method: "sell",
              label: "Sell",
              color: "#4CAF50",
            })}
            {renderMethodButton({
              method: "swap",
              label: "Swap",
              color: "#2196F3",
            })}
            {renderMethodButton({
              method: "donate",
              label: "Donate",
              color: "#FF9800",
            })}
          </View>

          {/* Images Section */}
          <Text style={styles.sectionTitle}>Upload Images</Text>
          <View style={styles.imageContainer}>
            <TouchableOpacity style={styles.mainImagePlaceholder} onPress={selectImage}>
              <Image source={{ uri: imageUrl }} style={styles.mainImagePreview} />
              <View style={styles.imageOverlay}>
                <Ionicons name="camera" size={32} color="#fff" />
                <Text style={styles.imageOverlayText}>Tap to add</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Details Section */}
          <Text style={styles.sectionTitle}>Item Details</Text>
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="What are you listing?"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Describe your item's condition, features, etc."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue: string) => setCategory(itemValue)} // Explicitly type itemValue as string
>
                <Picker.Item label="Electronics" value="Electronics" />
                <Picker.Item label="Books" value="Books" />
                <Picker.Item label="Furniture" value="Furniture" />
                <Picker.Item label="Clothes" value="Clothes" />
                <Picker.Item label="Sports" value="Sports" />
                <Picker.Item label="Others" value="Others" />
              </Picker>
            </View>

            {uploadMethod === "sell" && (
              <>
                <Text style={styles.inputLabel}>Price (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter price"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />

                <View style={styles.checkboxContainer}>
                  <Switch
                    value={negotiable}
                    onValueChange={setNegotiable}
                    trackColor={{ false: "#ccc", true: "#4CAF50" }}
                    thumbColor={negotiable ? "#ffffff" : "#f4f3f4"}
                  />
                  <Text style={styles.checkboxLabel}>Price is negotiable</Text>
                </View>
              </>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleUpload}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={20}
                  color="#fff"
                  style={styles.submitIcon}
                />
                <Text style={styles.submitText}>
                  {uploadMethod === "sell"
                    ? "List For Sale"
                    : uploadMethod === "swap"
                    ? "List For Swap"
                    : "List For Donation"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      ) : showChat && chatDetails ? (
        <ChatScreen route={{ key: "chat", name: "params", params: chatDetails }} />
      ) : showProfile ? (
        <ProfilePage />
      ) : showChatList ? (
        <ChatList onChatSelect={openChatScreen} />
      ) : selectedItem ? (
        <ItemDetails 
          item={selectedItem} 
          onStartChat={() => startChat(selectedItem)} 
          onClose={closeItemDetails} 
        />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>
              {showWishlist ? "My Wishlist" : "SustainX Marketplace"}
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton} onPress={toggleChatListView}>
                <Ionicons name="chatbubble-outline" size={24} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton} onPress={toggleProfileView}>
                <Ionicons name="person-circle-outline" size={30} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>

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
                          onPress={() => openItemDetails(item)}
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
                      onLikeToggle={() => {
                        toggleLike(item.id!);
                        if (showWishlist) {
                          setItems(prevItems => prevItems.filter(i => i.id !== item.id));
                        }
                      }}
                      onPress={() => openItemDetails(item)}
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
        </>
      )}

      <TouchableOpacity style={styles.addButton} onPress={toggleUploadView}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
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
  methodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  methodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  methodButtonText: {
    fontWeight: "600",
    fontSize: 16,
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
    paddingHorizontal: 16,
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
    marginBottom: 16,
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
    bottom: 24,
    backgroundColor: "#4CAF50",
  },
  imageContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  mainImagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
    position: "relative",
  },
  mainImagePreview: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageOverlayText: {
    color: "#fff",
    marginTop: 8,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginBottom: 16,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  picker: {
    height: 50,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 32,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});