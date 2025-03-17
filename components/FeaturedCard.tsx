import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

interface FeaturedCardProps {
  image: string;
  price: string;
  title: string;
  description: string;
  isLiked: boolean;
  onLikeToggle: () => void;
  onPress?: () => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ 
  image, 
  price, 
  title, 
  description, 
  isLiked,
  onLikeToggle,
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: image }} 
          style={styles.image} 
          resizeMode="cover"
        />
        {price.includes("For Swap") && (
          <View style={[styles.badge, styles.swapBadge]}>
            <Text style={styles.badgeText}>Swap</Text>
          </View>
        )}
        {price === "Free" && (
          <View style={[styles.badge, styles.donateBadge]}>
            <Text style={styles.badgeText}>Free</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {price}
          </Text>
          <TouchableOpacity onPress={onLikeToggle} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <FontAwesome name={isLiked ? "heart" : "heart-o"} size={20} color={isLiked ? "#F44336" : "#666"} />
          </TouchableOpacity>
        </View>
        
        <Text 
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        
        <Text 
          style={styles.description}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 150,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  swapBadge: {
    backgroundColor: "rgba(33, 150, 243, 0.85)",
  },
  donateBadge: {
    backgroundColor: "rgba(255, 152, 0, 0.85)",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default FeaturedCard;