import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FeaturedCard from "../../components/FeaturedCard";
import styles from "../../components/ui/HomeStyles"; // Adjust the import path as necessary

interface FeaturedItem {
  image: string;
  price: string;
  title: string;
  description: string;
  isLiked?: boolean;
}

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem("marketplaceItems");
        if (storedItems) {
          const parsedItems: FeaturedItem[] = JSON.parse(storedItems);
          setFeaturedItems(parsedItems.slice(0, 3)); // Display the first 3 items as featured
        }
      } catch (error) {
        console.error("Error loading featured items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedItems();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Make Your Campus Greener</Text>
          <Text style={styles.bannerSubtitle}>
            Swap, sell, or donate items. Join the circular economy!
          </Text>
          <TouchableOpacity 
            style={styles.bannerButton}
            onPress={() => router.push("/(auth)/Login")}
          >
            <Text style={styles.bannerButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

 {/* Quick Actions */}

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push({ pathname: "/(tabs)/Marketplace", params: { method: "swap" } })} // Pass method as a parameter
          >
            <View style={[styles.actionIcon, { backgroundColor: "#e0f7fa" }]}>
              <Ionicons name="swap-horizontal" size={24} color="#00838f" />
            </View>
            <Text style={styles.actionText}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push({ pathname: "/(tabs)/Marketplace", params: { method: "sell" } })} // Pass method as a parameter
          >
            <View style={[styles.actionIcon, { backgroundColor: "#e8f5e9" }]}>
              <Ionicons name="cash" size={24} color="#2e7d32" />
            </View>
            <Text style={styles.actionText}>Sell</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push({ pathname: "/(tabs)/Marketplace", params: { method: "donate" } })} // Pass method as a parameter
          >
            <View style={[styles.actionIcon, { backgroundColor: "#fff3e0" }]}>
              <Ionicons name="gift" size={24} color="#e65100" />
            </View>
            <Text style={styles.actionText}>Donate</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Featured Items</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredItems}>
            {featuredItems.map((item, index) => (
              <View key={`featured-${index}`} style={styles.featuredItem}>
                <FeaturedCard
                  image={item.image}
                  price={item.price}
                  title={item.title}
                  description={item.description}
                  isLiked={item.isLiked ?? false}
                  onLikeToggle={() => {}}
                  onPress={() => router.push("/(tabs)/Marketplace")}
                />
              </View>
            ))}
          </ScrollView>
        )}
{/* KnowledgeCentre Suggestions */}
        <Text style={styles.sectionTitle}>Sustainability Tips</Text>
        <View style={styles.tipCard}>
          <View style={styles.tipIconContainer}>
            <Ionicons name="leaf" size={24} color="#4CAF50" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Reduce Water Usage</Text>
            <Text style={styles.tipText}>Turn off the tap while brushing teeth to save up to 8 gallons of water daily.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

