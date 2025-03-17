import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EcoCampus</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
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

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: "#e0f7fa" }]}>
              <Ionicons name="swap-horizontal" size={24} color="#00838f" />
            </View>
            <Text style={styles.actionText}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: "#e8f5e9" }]}>
              <Ionicons name="cash" size={24} color="#2e7d32" />
            </View>
            <Text style={styles.actionText}>Sell</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: "#fff3e0" }]}>
              <Ionicons name="gift" size={24} color="#e65100" />
            </View>
            <Text style={styles.actionText}>Donate</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Featured Items</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredItems}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.featuredItem}>
              <View style={styles.itemImageContainer}>
                <View style={styles.itemImage} />
              </View>
              <Text style={styles.itemName}>Study Desk</Text>
              <Text style={styles.itemPrice}>$45</Text>
            </View>
          ))}
        </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  banner: {
    backgroundColor: "#e8f5e9",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  bannerSubtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
  },
  bannerButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 16,
  },
  bannerButtonText: {
    color: "white",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    alignItems: "center",
    width: "30%",
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  featuredItems: {
    marginBottom: 24,
  },
  featuredItem: {
    width: 150,
    marginRight: 12,
  },
  itemImageContainer: {
    width: 150,
    height: 150,
    backgroundColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ddd",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  tipCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    marginBottom: 16,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
  },
});