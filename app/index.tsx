import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  // Initial app launch redirects to Home tab
  return <Redirect href="/(tabs)/Home" />;
}
