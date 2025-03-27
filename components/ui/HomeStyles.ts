import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4", // Slightly lighter background for a cleaner look
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  banner: {
    backgroundColor: "#e0f7e9", // Softer green for a modern feel
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1b5e20", // Darker green for better contrast
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 15,
    color: "#4a4a4a",
    lineHeight: 22,
  },
  bannerButton: {
    backgroundColor: "#43a047", // Slightly darker green for the button
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 16,
  },
  bannerButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
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
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#f0f0f0", // Neutral background for icons
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },
  featuredItems: {
    marginBottom: 24,
  },
  featuredItem: {
    width: 220,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tipCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tipIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0f7e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: "#333333",
  },
  tipText: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 20,
  },
});