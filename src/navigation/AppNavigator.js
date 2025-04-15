import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import useAuthStore from "../stores/authStore";

import AuthNavigator from "./AuthNavigator";
import MainAppNavigator from "./MainAppNavigator";
import HomeMapTab from "../HomeMapTab"
export default function AppNavigator() {
  const { isAuthenticated } = useAuthStore();

  console.log("AppNavigator rendering, isAuthenticated:", isAuthenticated);

  return (
    <NavigationContainer>
      {/* {isAuthenticated ? <MainAppNavigator /> : <AuthNavigator />} */}

      {isAuthenticated ? <HomeMapTab /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
