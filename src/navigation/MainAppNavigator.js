import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeMapTab from "../HomeMapTab"; // This contains the TabLayout

// Profile Screens
import UpdateProfileScreen from "../screens/profile/UpdateProfileScreen";
import UserProfileScreen from "../screens/profile/UserProfileScreen"; // For viewing others' profiles
import UserReviewsScreen from "../screens/reviews/UserReviewsScreen";

// Ride Screens
import RideDetailsScreen from "../screens/rides/RideDetailsScreen";
import SearchRidesResultsScreen from "../screens/rides/SearchRidesResultsScreen";

// Driver Screens
import CreateRideScreen from "../screens/driver/CreateRideScreen";
import MyOfferedRidesScreen from "../screens/driver/MyOfferedRidesScreen";
import RideBookingManagementScreen from "../screens/driver/RideBookingManagementScreen";

// Rider Screens
import MyBookingsScreen from "../screens/rider/MyBookingsScreen"; // Renamed from MyBookingRequestsScreen for riders' perspective
import BookingDetailsScreen from "../screens/rider/BookingDetailsScreen";

// Review Screens
import CreateReviewScreen from "../screens/reviews/CreateReviewScreen";

const Stack = createNativeStackNavigator();

export default function MainAppNavigator() {
  return (
    <Stack.Navigator initialRouteName="AppTabs">
      <Stack.Screen
        name="AppTabs"
        component={HomeMapTab} // The component that renders BottomTabLayout
        options={{ headerShown: false }}
      />
      {/* Screens accessible from within AppTabs that need to cover the tabs */}
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfileScreen}
        options={{ title: "Update Profile" }}
      />
      <Stack.Screen
        name="RideDetails"
        component={RideDetailsScreen}
        options={{ title: "Ride Details" }}
      />
      <Stack.Screen
        name="SearchRidesResults"
        component={SearchRidesResultsScreen}
        options={{ title: "Available Rides" }}
      />
      <Stack.Screen
        name="CreateRide"
        component={CreateRideScreen}
        options={{ title: "Offer a New Ride" }}
      />
      <Stack.Screen
        name="MyOfferedRides"
        component={MyOfferedRidesScreen}
        options={{ title: "My Offered Rides" }}
      />
      <Stack.Screen
        name="RideBookingManagement"
        component={RideBookingManagementScreen}
        options={{ title: "Manage Ride Bookings" }}
      />
      <Stack.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ title: "My Bookings" }}
      />
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{ title: "Booking Details" }}
      />
      <Stack.Screen
        name="CreateReview"
        component={CreateReviewScreen}
        options={{ title: "Write a Review" }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ title: "User Profile" }}
      />
      <Stack.Screen
        name="UserReviews"
        component={UserReviewsScreen}
        options={{ title: "User Reviews" }}
      />
    </Stack.Navigator>
  );
}
