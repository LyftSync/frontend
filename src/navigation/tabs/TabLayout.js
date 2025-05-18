import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, Text } from "react-native"; // Added Text
import { icons } from "../../../assets/assestsIndex";

// Tab Screens
import Home from "./Home"; // Map, Search etc.
// import Wallet from './Wallet' // Currently commented out
import ActivityScreen from "../../screens/ActivityScreen"; // Replaces RideHistory
import ProfileScreen from "../../screens/profile/ProfileScreen"; // Replaces HomeScreen
import CreateRideScreen from "../../screens/driver/CreateRideScreen";

import useAuthStore from "../../stores/authStore";

const Tab = createBottomTabNavigator();

const TabIcon = ({ source, focused, label }) => (
  <View
    style={{
      alignItems: "center",
      justifyContent: "center",
      padding: focused ? 8 : 6,
      backgroundColor: focused ? "#10e3c0" : "transparent",
      borderRadius: focused ? 15 : 0, // more rounded when focused
      minWidth: 60, // ensure enough space for icon and label
    }}
  >
    <Image
      source={icons[source]} // Assuming icons is an object with keys matching source string
      style={{
        width: focused ? 28 : 25,
        height: focused ? 28 : 25,
        tintColor: focused ? "white" : "#A0A0A0",
      }}
      resizeMode="contain"
    />
    {focused && (
      <Text style={{ color: "white", fontSize: 10, marginTop: 2 }}>
        {label}
      </Text>
    )}
  </View>
);

export default function TabLayout() {
  const { user } = useAuthStore();
  const isDriver = user && (user.role === "driver" || user.role === "both");

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // We use custom label in TabIcon
        tabBarStyle: {
          backgroundColor: "#010101", // Darker background
          height: 75, // Slightly taller
          borderTopWidth: 0, // Remove top border
          // borderRadius: 25, // Apply to all corners
          // marginHorizontal: 10, // Add some horizontal margin
          // marginBottom: 10, // Add some bottom margin
          // position: 'absolute', // If you want it floating
          // elevation: 5, // Shadow for Android
          // shadowColor: '#000', // Shadow for iOS
          // shadowOffset: { width: 0, height: -3 },
          // shadowOpacity: 0.1,
          // shadowRadius: 3,

          borderTopLeftRadius: 20, // from user's original style
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
        name="FindRide" // Renamed from Home for clarity
        component={Home} // This is the map screen from ./Home.jsx
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source="home" label="Find" focused={focused} />
          ),
        }}
      />

      {isDriver && (
        <Tab.Screen
          name="OfferRideTab" // Differentiate from CreateRideScreen if it's just a tab leading to it
          component={CreateRideScreen} // Or a stack navigator if more driver actions are here
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon source="offer_ride" label="Offer" focused={focused} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Activity" // Renamed from RideHistory
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source="list" label="Activity" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab" // Renamed from HomeScreen
        component={ProfileScreen} // Points to the actual profile screen
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon source="profile" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
