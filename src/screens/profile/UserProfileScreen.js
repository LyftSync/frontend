import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Button,
} from "react-native";
import { apiRequest } from "../../utils/api";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import { Ionicons } from "@expo/vector-icons"; // For icons

export default function UserProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await apiRequest(
        `/api/users/${userId}`,
        "GET",
        null,
        false,
      ); // public endpoint
      setProfileUser(userData);
    } catch (error) {
      showMessage({
        message: `Error fetching user profile: ${error.message}`,
        type: "danger",
      });
      console.error("Fetch user profile error:", error);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [userId, navigation]);

  useFocusEffect(fetchUserProfile);

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  if (!profileUser) {
    return (
      <View style={styles.centered}>
        <Text>User profile not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            profileUser.profilePictureUrl
              ? { uri: profileUser.profilePictureUrl }
              : require("../../../assets/images/avatar_placeholder.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{profileUser.name}</Text>
        <Text style={styles.role}>Role: {profileUser.role}</Text>
        <Text style={styles.joinedDate}>
          Joined: {new Date(profileUser.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {profileUser.averageRating?.toFixed(1) || "N/A"}
          </Text>
          <Text style={styles.statLabel}>Avg. Rating</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{profileUser.totalRatings || 0}</Text>
          <Text style={styles.statLabel}>Total Ratings</Text>
        </View>
      </View>

      {(profileUser.role === "driver" || profileUser.role === "both") && (
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {profileUser.ridesOfferedCount || 0}
            </Text>
            <Text style={styles.statLabel}>Rides Offered</Text>
          </View>
        </View>
      )}
      {(profileUser.role === "rider" || profileUser.role === "both") && (
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {profileUser.ridesTakenCount || 0}
            </Text>
            <Text style={styles.statLabel}>Rides Taken</Text>
          </View>
        </View>
      )}

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigation.navigate("UserReviews", {
              userId: profileUser._id,
              userName: profileUser.name,
            })
          }
        >
          <Ionicons name="star-half-outline" size={24} color="#007AFF" />
          <Text style={styles.menuText}>
            View Reviews for {profileUser.name.split(" ")[0]}
          </Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#C7C7CC" />
        </TouchableOpacity>
      </View>
      <View style={{ height: 30 }} />
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
  role: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "#E0F7FA",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 5,
  },
  joinedDate: {
    fontSize: 13,
    color: "#777",
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
});
