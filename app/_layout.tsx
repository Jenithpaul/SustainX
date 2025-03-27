import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaView, Platform, StatusBar, StyleSheet, View } from 'react-native';
import Header from '../components/Header';
import BottomNavbar from '../components/BottomNavbar';

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Remove onProfilePress to use Header's default navigation */}
        <Header />
        <View style={styles.content}>
          <Slot />
        </View>
        <BottomNavbar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});
