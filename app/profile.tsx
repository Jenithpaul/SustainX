import React from 'react';
import ProfilePage from '../components/ProfilePage';
import { usePathname } from 'expo-router';

export default function ProfileScreen() {
  const pathname = usePathname();
  
  // Extract and validate the tab name from the current path
  let currentTab = null;
  if (pathname.includes('/(tabs)/')) {
    // Extract the tab name after /(tabs)/
    const tabMatch = pathname.match(/\/\(tabs\)\/([^/]+)/);
    if (tabMatch && tabMatch[1]) {
      currentTab = tabMatch[1];
    }
  }

  return <ProfilePage previousScreen={currentTab} />;
}