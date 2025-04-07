import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from "../ui/ThemeProvider";

interface FeaturedCardProps {
  image: string;
  price: string;
  title: string;
  description: string;
  isLiked: boolean;
  negotiable?: boolean;
  onLikeToggle: () => void;
  onPress?: () => void;
  onImagePress?: () => void;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ 
  image, 
  price, 
  title, 
  description, 
  isLiked,
  negotiable,
  onLikeToggle,
  onPress,
  onImagePress
}) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);
  
  // Fallback image URL - use a reliable placeholder service
  const fallbackImage = "https://via.placeholder.com/300x200/cccccc/666666?text=No+Image";
  
  // Safe image press handler
  const handleImagePress = () => {
    try {
      if (onImagePress) onImagePress();
    } catch (error) {
      console.error("Error handling image press:", error);
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {onImagePress ? (
          <TouchableOpacity onPress={handleImagePress} activeOpacity={0.9}>
            <Image 
              source={{ uri: imageError ? fallbackImage : image }} 
              style={styles.image} 
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          </TouchableOpacity>
        ) : (
          <Image 
            source={{ uri: imageError ? fallbackImage : image }} 
            style={styles.image} 
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        )}
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

      <View style={[styles.contentContainer, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.primary }]}>{price}</Text>
          {negotiable && (
            <View style={styles.negotiableBadge}>
              <Text style={[styles.negotiableText, { color: theme.textSecondary }]}>Negotiable</Text>
            </View>
          )}
          <TouchableOpacity onPress={onLikeToggle} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <FontAwesome name={isLiked ? "heart" : "heart-o"} size={20} color={isLiked ? "#F44336" : theme.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <Text 
          style={[styles.title, { color: theme.textPrimary }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        
        <Text 
          style={[styles.description, { color: theme.textSecondary }]}
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
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    // Glass morph effect: semi-transparent background with a subtle border
    borderWidth: 1,
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
  },
  negotiableBadge: {
    backgroundColor: "rgba(227, 242, 253, 0.85)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  negotiableText: {
    fontSize: 10,
    fontWeight: "500",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default FeaturedCard;
