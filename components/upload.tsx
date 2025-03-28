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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import FeaturedCard from "./FeaturedCard";
import * as ImagePicker from "expo-image-picker";

interface UploadProps {
  onClose: () => void;
}

/**
 * Upload Component
 * - Allows users to upload a new item with image, title, description, etc.
 * - Uses a styling theme inspired by the Knowledge page.
 * - Calls the onClose callback when the user taps the back arrow or after a successful listing.
 */
export default function Upload({ onClose }: UploadProps) {
  const router = useRouter();

  // Component state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("https://via.placeholder.com/150");
  const [uploadMethod, setUploadMethod] = useState<"sell" | "swap" | "donate">("sell");

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
    return true;
  };

  /**
   * Launches the image picker and updates the image URL state.
   */
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
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
      const newItem = {
        image: imageUrl,
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

        {/* Image Upload Section */}
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
          <View style={styles.pickerContainer}>
            <Picker selectedValue={category} style={styles.picker} onValueChange={(itemValue) => setCategory(itemValue)}>
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
            image={imageUrl}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  headerPlaceholder: {
    width: 40,
  },
  methodContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    color: "#111827",
  },
  imageContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  mainImagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#E5E7EB",
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
});
