import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  tags: string[];
  showWishlist: boolean;
  toggleWishlist: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  tags = ["All", "Electronics", "Books", "Furniture", "Clothes", "Others"],
  showWishlist,
  toggleWishlist
}) => {
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
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
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.categoryChip,
              selectedTag === tag && styles.selectedCategoryChip
            ]}
            onPress={() => setSelectedTag(tag)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedTag === tag && styles.selectedCategoryText
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  wishlistButton: {
    marginLeft: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginHorizontal: 4,
  },
  selectedCategoryChip: {
    backgroundColor: "#4CAF50",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default SearchBar;