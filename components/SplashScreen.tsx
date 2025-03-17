// filepath: trialll1/components/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent({ onFinish }: { onFinish: () => void }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(0, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    }, () => {
      SplashScreen.hideAsync();
      onFinish();
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image source={require('../assets/images/SustainX.png')} style={styles.image} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: 200,
    height: 200,
  },
});