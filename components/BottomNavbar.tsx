// components/BottomNavbar.tsx
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useBottomNavbarStyles } from "../ui/bottomNavBarStyle"; // Import dynamic styles

/**
 * BottomNavbar Component: A bottom navigation bar with dynamic theming.
 */
const BottomNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const styles = useBottomNavbarStyles();

  // Define navigation items with icons and routes
  const navigationItems = [
    { name: "Home", icon: "home-outline", route: "/(tabs)/Home" },
    { name: "Marketplace", icon: "basket-outline", route: "/(tabs)/Marketplace" },
    { name: "Messages", icon: "chatbubbles-outline", route: "/(tabs)/Messages" },
    { name: "Knowledge", icon: "book-outline", route: "/(tabs)/Knowledge" },
  ];

  return (
    <View style={styles.navbar}>
      {navigationItems.map((item) => {
        const isActive = pathname.includes(item.name); // Check if tab is active

        return (
          <TouchableOpacity 
            key={item.name} 
            style={styles.navItem} 
            onPress={() => router.push(item.route)}
          >
            <Ionicons 
              name={item.icon as any} 
              size={24} 
              color={isActive ? styles.activeText.color : styles.inactiveText.color}
            />
            <Text 
              style={[
                styles.navItemText,
                isActive ? styles.activeText : styles.inactiveText
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavbar;
