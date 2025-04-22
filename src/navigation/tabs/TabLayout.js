import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import RideHistory from "./RideHistory";
import Profile from "./Profile";
import { Image, View } from "react-native";
import { icons } from "../../../assets/assestsIndex";
import HomeScreen from "../../screens/HomeScreen";

const Tab = createBottomTabNavigator();

const TabIcon = ({ source, focused }) => (
  <View
    style={{
      padding: 10,
      backgroundColor: focused ? "#10e3c0" : "transparent",
      borderRadius: 999,
    }}
  >
    <Image
      source={source}
      style={{ width: 30, height: 30, tintColor: "white" }}
      resizeMode="contain"
    />
  </View>
);

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#010",
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          position: "absolute",
          marginHorizontal: 20,
          marginBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="RideHistory"
        component={RideHistory}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.list} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="HomeScreen"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.profile} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
