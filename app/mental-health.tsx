import React from 'react';
import { usePathname } from 'expo-router';
import { View, Text } from 'react-native';
// Import your actual Mental Health component here

export default function MentalHealthScreen() {
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

  // Replace this with your actual Mental Health component
  // return <MentalHealthComponent previousScreen={previousScreen} />;
  
  // Placeholder implementation
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Mental Health Screen (Previous: {previousScreen || 'none'})</Text>
    </View>
  );
}
