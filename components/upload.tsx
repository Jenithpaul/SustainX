import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import FeaturedCard from "./FeaturedCard";
import * as ImagePicker from "expo-image-picker";

interface UploadProps {
  onClose: () => void;
  initialMethod?: "sell" | "swap" | "donate";
}

/**
 * Upload Component
 * - Allows users to upload a new item with up to three images, title, description, etc.
 * - Uses a styling theme inspired by the Knowledge page.
 * - Calls the onClose callback when the user taps the back arrow or after a successful listing.
 */
const Upload: React.FC<UploadProps> = ({ onClose, initialMethod = "sell" }) => {
  const router = useRouter();

  // Component state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Changed to array for multiple images (up to 3)
  const [images, setImages] = useState<string[]>([
    "https://via.placeholder.com/150",
    "",
    ""
  ]);
  const [uploadMethod, setUploadMethod] = useState<"sell" | "swap" | "donate">(initialMethod);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  /**
   * Validates the form before upload.
   */
  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert("Missing Information", "Please enter a title for your item");
      return false;
    }
    if (!description.trim()) {
      Alert.alert("Missing Information", "Please provide a description for your item");
      return false;
    }
    if (uploadMethod === "sell" && (!price || parseFloat(price) <= 0)) {
      Alert.alert("Invalid Price", "Please enter a valid price for your item");
      return false;
    }
    // Make sure at least one image is uploaded
    if (!images[0] || images[0] === "https://via.placeholder.com/150") {
      Alert.alert("Missing Information", "Please upload at least one image");
      return false;
    }
    return true;
  };

  /**
   * Launches the image picker and updates the images array at the specified index.
   */
  const selectImage = async (index: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  /**
   * Removes an image at the specified index.
   */
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = "";
    setImages(newImages);
  };

  /**
   * Handles the upload logic by validating, formatting data,
   * saving to AsyncStorage, and closing the upload view on success.
   */
  const handleUpload = async () => {
    if (!validateForm()) return;
    setIsSaving(true);
    try {
      // Format price based on upload method
      let formattedPrice = "Free";
      if (uploadMethod === "sell") {
        formattedPrice = `₹${price}`;
      } else if (uploadMethod === "swap") {
        formattedPrice = "For Swap";
      }
      
      // Filter out empty image slots
      const validImages = images.filter(img => img && img !== "https://via.placeholder.com/150");
      
      const newItem = {
        // Use first image as main image, but store all images
        image: validImages[0] || "https://via.placeholder.com/150",
        images: validImages, // Save all uploaded images
        price: formattedPrice,
        title: title.trim(),
        description: description.trim(),
        tag: category,
        negotiable: uploadMethod === "sell" ? negotiable : false,
        listedDate: new Date().toISOString(),
        type: uploadMethod,
        username: "You", // Adding default username for new listings
      };

      // Retrieve and update existing items
      const storedItemsStr = await AsyncStorage.getItem("marketplaceItems");
      const storedItems = storedItemsStr ? JSON.parse(storedItemsStr) : [];
      storedItems.unshift(newItem);
      await AsyncStorage.setItem("marketplaceItems", JSON.stringify(storedItems));
      
      // First close the upload view automatically
      onClose();
      
      // Then show success message (after view is closed)
      Alert.alert(
        "Success!", 
        "Your item has been listed on the marketplace"
      );
    } catch (error) {
      console.error("Error saving item:", error);
      Alert.alert("Error", "Failed to save your item. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Updates the upload method and resets non-sell fields.
   */
  const selectUploadMethod = (method: "sell" | "swap" | "donate"): void => {
    setUploadMethod(method);
    if (method !== "sell") {
      setPrice("");
      setNegotiable(false);
    }
  };

  /**
   * Renders a method selection button with proper styling.
   */
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
      onPress={() => selectUploadMethod(method)}
    >
      <Text style={[styles.methodButtonText, { color: uploadMethod === method ? "#fff" : "#666" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  /**
   * Renders an image picker item based on the current state.
   */
  const renderImagePicker = (index: number) => {
    const imageUrl = images[index];
    const hasImage = imageUrl && imageUrl !== "https://via.placeholder.com/150";
    
    return (
      <View style={styles.imagePickerContainer} key={`image-${index}`}>
        <TouchableOpacity
          style={styles.imagePickerPlaceholder}
          onPress={() => selectImage(index)}
        >
          {hasImage ? (
            <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
          ) : (
            <View style={styles.emptyImagePlaceholder}>
              <Ionicons name="camera" size={24} color="#999" />
              <Text style={styles.emptyImageText}>Image {index + 1}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        {hasImage && (
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => removeImage(index)}
          >
            <Ionicons name="close-circle" size={24} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Categories data
  const categories = [
    { label: "Electronics", value: "Electronics" },
    { label: "Books", value: "Books" },
    { label: "Furniture", value: "Furniture" },
    { label: "Clothes", value: "Clothes" },
    { label: "Sports", value: "Sports" },
    { label: "Others", value: "Others" },
  ];

  // Platform-specific category selector
  const renderCategorySelector = () => {
    if (Platform.OS === 'ios') {
      return (
        <>
          <TouchableOpacity 
            style={styles.categoryButton} 
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={styles.categoryButtonText}>{category}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          
          <Modal
            transparent={true}
            visible={showCategoryModal}
            animationType="slide"
            onRequestClose={() => setShowCategoryModal(false)}
          >
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Category</Text>
                  <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => {
                    setCategory(itemValue);
                    setShowCategoryModal(false);
                  }}
                >
                  {categories.map(cat => (
                    <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
                  ))}
                </Picker>
              </View>
            </SafeAreaView>
          </Modal>
        </>
      );
    } else {
      // Android picker
      return (
        <View style={styles.pickerContainer}>
          <Picker 
            selectedValue={category} 
            style={styles.picker} 
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            {categories.map(cat => (
              <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </Picker>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>List New Item</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Upload Method Selector */}
        <View style={styles.methodContainer}>
          {renderMethodButton({ method: "sell", label: "Sell", color: "#4CAF50" })}
          {renderMethodButton({ method: "swap", label: "Swap", color: "#2196F3" })}
          {renderMethodButton({ method: "donate", label: "Donate", color: "#FF9800" })}
        </View>

        {/* Multiple Image Upload Section */}
        <Text style={styles.sectionTitle}>Upload Images (Up to 3)</Text>
        <View style={styles.imageGalleryContainer}>
          {[0, 1, 2].map(index => renderImagePicker(index))}
        </View>

        {/* Item Details Section */}
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
          {renderCategorySelector()}

          {uploadMethod === "sell" && (
            <>
              <Text style={styles.inputLabel}>Price (₹)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                value={price}
                onChangeText={(text) => {
                  // Allow only numeric values
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setPrice(numericValue);
                }}
                keyboardType="numeric"
              />

              <View style={styles.checkboxContainer}>
                <Switch
                  value={negotiable}
                  onValueChange={setNegotiable}
                  trackColor={{ false: "#ccc", true: "#4CAF50" }}
                  thumbColor={negotiable ? "#fff" : "#f4f3f4"}
                />
                <Text style={styles.checkboxLabel}>Price is negotiable</Text>
              </View>
            </>
          )}
        </View>

        {/* Preview Section */}
        <Text style={styles.sectionTitle}>Preview</Text>
        <View style={styles.previewContainer}>
          <FeaturedCard
            image={images[0] || "https://via.placeholder.com/150"}
            price={
              uploadMethod === "sell"
                ? `₹${price || "0"}`
                : uploadMethod === "swap"
                ? "For Swap"
                : "Free"
            }
            title={title || "Item Title"}
            description={description || "Item Description"}
            isLiked={false}
            onLikeToggle={() => {}}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleUpload} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={styles.submitIcon} />
              <Text style={styles.submitText}>
                {uploadMethod === "sell" ? "List For Sale" : uploadMethod === "swap" ? "List For Swap" : "List For Donation"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 10,
    minWidth: 44, // Increased for better touch target
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  headerPlaceholder: {
    width: 44,
    minHeight: 44,
  },
  methodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    color: "#111827",
  },
  imageGalleryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  imagePickerContainer: {
    width: "30%", // Adjusted width for better spacing
    aspectRatio: 1, // Ensures square containers
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imagePickerPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Ensures the image fits well
  },
  emptyImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImageText: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 2,
    elevation: 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F3F4F6",
    marginBottom: 16,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#F3F4F6",
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
    color: "#111827",
  },
  previewContainer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 24,
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
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#F3F4F6",
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
});