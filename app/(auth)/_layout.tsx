import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          title: "Login",
          presentation: "modal",
          headerTitleAlign: "center" 
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: "Register",
          presentation: "modal",
          headerTitleAlign: "center" 
        }} 
      />
    </Stack>
  );
}