import React from 'react';
import { usePathname } from 'expo-router';
import { View, Text } from 'react-native';
// Import your actual Podcasts component here

export default function PodcastsScreen() {
  const pathname = usePathname();
  
  // Extract and validate the tab name from the current path
  let previousScreen = null;
  if (pathname.includes('/(tabs)/')) {
    // Extract the tab name after /(tabs)/
    const tabMatch = pathname.match(/\/\(tabs\)\/([^/]+)/);
    if (tabMatch && tabMatch[1]) {
      previousScreen = tabMatch[1];
    }
  }

  // Replace this with your actual Podcasts component
  // return <PodcastsComponent previousScreen={previousScreen} />;
  
  // Placeholder implementation
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Podcasts Screen (Previous: {previousScreen || 'none'})</Text>
    </View>
  );
}
