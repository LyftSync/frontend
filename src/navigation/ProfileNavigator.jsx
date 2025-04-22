import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./tabs/Profile";
import RegisterScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
	<Stack.Navigator
	  independent={true}
	initialRouteName="Login"
	  screenOptions={{ headerShown: false }}
	>
	  <Stack.Screen name="Profile" component={Profile} />
	  <Stack.Screen name="HomeScreen" component={HomeScreen} />
	</Stack.Navigator>
  );
}

