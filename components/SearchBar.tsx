// components/SearchBar.tsx
import React from "react";
import { View, TextInput, TouchableOpacity, ScrollView, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSearchBarStyles } from "../ui/SearchBarStyle"; // Import dynamic styles

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  tags?: string[];
  showWishlist: boolean;
  toggleWishlist: () => void;
}

/**
 * SearchBar Component: A reusable search bar with category filters and wishlist toggle.
 */
const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  tags = ["All", "Electronics", "Books", "Furniture", "Clothes", "Others"],
  showWishlist,
  toggleWishlist
}) => {
  const styles = useSearchBarStyles();

  // Clears the search input field
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <View style={styles.container}>
      {/* Search Input Field */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for items..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Wishlist Toggle Button */}
        <TouchableOpacity onPress={toggleWishlist} style={styles.wishlistButton}>
          <Ionicons name={showWishlist ? "heart" : "heart-outline"} size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {tags.map((tag) => {
          const isSelected = selectedTag === tag;

          return (
            <TouchableOpacity
              key={tag}
              style={[styles.categoryChip, isSelected && styles.selectedCategoryChip]}
              onPress={() => setSelectedTag(tag)}
            >
              <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SearchBar;
