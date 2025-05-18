import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import useAuthStore from "../stores/authStore";

import AuthNavigator from "./AuthNavigator";
import MainAppNavigator from "./MainAppNavigator"; // Changed from HomeMapTab

export default function AppNavigator() {
  const { isAuthenticated, token, fetchUser, user } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      // If token exists but user data is not loaded, fetch it
      fetchUser().catch((err) => {
        console.log(
          "AppNavigator: Failed to fetch user on startup",
          err.message,
        );
        // If fetchUser fails (e.g. token expired), authStore's handleUnauthorized might be called
        // or we might need to explicitly logout here depending on authStore's behavior
      });
    }
  }, [token, user, fetchUser]);

  console.log("AppNavigator rendering, isAuthenticated:", isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainAppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
