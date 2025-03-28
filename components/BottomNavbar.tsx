import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';

const BottomNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { 
      name: 'Home', 
      icon: 'home-outline', 
      route: '/(tabs)/Home'
    },
    { 
      name: 'Marketplace', 
      icon: 'basket-outline', 
      route: '/(tabs)/Marketplace'
    },
    { 
      name: 'Messages', 
      icon: 'chatbubbles-outline', 
      route: '/(tabs)/Messages'
    },
    { 
      name: 'Knowledge', 
      icon: 'book-outline', 
      route: '/(tabs)/Knowledge'
    }
  ];

  return (
    <View style={styles.navbar}>
      {navigationItems.map((item) => (
        <TouchableOpacity 
          key={item.name}
          style={styles.navItem}
          onPress={() => router.push(item.route)}
        >
          <Ionicons 
            name={item.icon as any} 
            size={24} 
            color={pathname.includes(item.name) ? '#4CAF50' : 'gray'} 
          />
          <Text 
            style={[
              styles.navItemText, 
              pathname.includes(item.name) ? styles.activeText : styles.inactiveText
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemText: {
    marginTop: 4,
    fontSize: 12,
  },
  activeText: {
    color: '#4CAF50',
  },
  inactiveText: {
    color: 'gray',
  },
});

export default BottomNavbar;