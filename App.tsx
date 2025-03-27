// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import Header from "./components/Header";
// import ProfilePage from "./components/ProfilePage"; // Correct the import path
// import { View, Text, StyleSheet } from "react-native";
// import { ThemeProvider } from "./contexts/ThemeContext"; // Import ThemeProvider

// const Stack = createStackNavigator();

// function HomeScreen({ navigation }: any) {
//   const handleProfilePress = () => {
//     navigation.navigate("ProfilePage"); // Navigate to ProfilePage
//   };

//   return (
//     <View style={styles.container}>
//       <Header onProfilePress={handleProfilePress} /> {/* Pass the handler */}
//       <View style={styles.content}>
//         <Text>Welcome to SustainX!</Text>
//       </View>
//     </View>
//   );
// }

// export default function App() {
//   return (
//     <ThemeProvider>
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="ProfilePage" component={ProfilePage} /> {/* Ensure ProfilePage is registered */}
//       </Stack.Navigator>
//     </NavigationContainer>
//     </ThemeProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
