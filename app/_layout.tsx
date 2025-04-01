// Modified _layout.tsx
import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaView, Platform, StatusBar, View } from 'react-native';
import BottomNavbar from '../components/BottomNavbar';
import { ThemeProvider, useThemeContext } from '../contexts/ThemeContext';

const MainLayout = () => {
  const { colors } = useThemeContext();
  
  return (
    // <SafeAreaView style={{ 
    //   flex: 1, 
    //   backgroundColor: colors.backgroundSecondary,
    //   paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    // }}>
      <View style={{ 
        flex: 1, 
        backgroundColor: colors.background 
      }}>
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
        <BottomNavbar />
      </View>
    // </SafeAreaView>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
  );
}