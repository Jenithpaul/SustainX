import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the tabs/Home screen
  return <Redirect href="/(tabs)/Home" />;
}