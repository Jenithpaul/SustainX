import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Knowledge() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Knowledge Centre</Text>
      <Text style={styles.subtitle}>Coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
});