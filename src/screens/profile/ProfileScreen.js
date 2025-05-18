import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import useAuthStore from "../../stores/authStore";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // For icons

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout, loading, fetchUser } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    // Navigation to Auth stack is handled by AppNavigator
  };

  const handleRefreshUser = async () => {
    await fetchUser();
  };

  if (loading && !user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>User data not available.</Text>
        <Button title="Try Refresh" onPress={handleRefreshUser} />
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    );
  }

  const isDriver = user.role === "driver" || user.role === "both";
  const isRider = user.role === "rider" || user.role === "both";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            user.profilePictureUrl
              ? { uri: user.profilePictureUrl }
              : require("../../../assets/images/avatar_placeholder.png")
          } // Replace with actual placeholder
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.role}>Role: {user.role}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {user.averageRating?.toFixed(1) || "N/A"}
          </Text>
          <Text style={styles.statLabel}>Avg. Rating</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{user.totalRatings || 0}</Text>
          <Text style={styles.statLabel}>Total Ratings</Text>
        </View>
      </View>

      {isDriver && (
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user.ridesOfferedCount || 0}</Text>
            <Text style={styles.statLabel}>Rides Offered</Text>
          </View>
        </View>
      )}
      {isRider && (
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user.ridesTakenCount || 0}</Text>
            <Text style={styles.statLabel}>Rides Taken</Text>
          </View>
        </View>
      )}

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("UpdateProfile")}
        >
          <Ionicons name="person-circle-outline" size={24} color="#007AFF" />
          <Text style={styles.menuText}>Edit Profile</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#C7C7CC" />
        </TouchableOpacity>

        {isDriver && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("MyOfferedRides")}
          >
            <Ionicons name="car-sport-outline" size={24} color="#007AFF" />
            <Text style={styles.menuText}>My Offered Rides</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color="#C7C7CC"
            />
          </TouchableOpacity>
        )}

        {isRider && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("MyBookings")}
          >
            <Ionicons name="bookmarks-outline" size={24} color="#007AFF" />
            <Text style={styles.menuText}>My Bookings</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color="#C7C7CC"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigation.navigate("UserReviews", {
              userId: user._id,
              userName: user.name,
            })
          }
        >
          <Ionicons name="star-outline" size={24} color="#007AFF" />
          <Text style={styles.menuText}>My Reviews</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#C7C7CC" />
        </TouchableOpacity>

        {/* Add more menu items like Settings, Help, etc. */}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Refresh Data"
          onPress={handleRefreshUser}
          disabled={loading}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Logout"
          onPress={handleLogout}
          color="red"
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  role: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "#E0F7FA",
    borderRadius: 10,
    overflow: "hidden", // for borderRadius to work on iOS with background
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  menu: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
    color: "#333",
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
