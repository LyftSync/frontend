import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import useAuthStore from "../stores/authStore";

import AuthNavigator from "./AuthNavigator";
import HomeMapTab from "../HomeMapTab"
export default function AppNavigator() {
  const { isAuthenticated } = useAuthStore();

  console.log("AppNavigator rendering, isAuthenticated:", isAuthenticated);

  return (
    <NavigationContainer>

      {isAuthenticated ? <HomeMapTab /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
