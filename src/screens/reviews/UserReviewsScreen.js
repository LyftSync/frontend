import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { apiRequest } from "../../utils/api";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import { Ionicons } from "@expo/vector-icons"; // For star icons

const ReviewItem = ({ item }) => {
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color="#FFD700" // Gold color for stars
        />,
      );
    }
    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };

  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>{item.reviewer.name}</Text>
        {renderStars(item.rating)}
      </View>
      <Text style={styles.reviewDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      {item.comment && <Text style={styles.reviewComment}>{item.comment}</Text>}
      <Text style={styles.reviewType}>
        Review Type:{" "}
        {item.reviewType === "driver_review" ? "Driver Review" : "Rider Review"}
      </Text>
      {item.ride && (
        <Text style={styles.rideContext}>
          Ride: {item.ride.startLocation?.address?.substring(0, 15)}.. to{" "}
          {item.ride.endLocation?.address?.substring(0, 15)}.. on{" "}
          {new Date(item.ride.departureTime).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
};

export default function UserReviewsScreen() {
  const route = useRoute();
  const { userId, userName } = route.params;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest(
        `/api/users/${userId}/reviews`,
        "GET",
        null,
        false,
      ); // Public endpoint
      setReviews(data);
    } catch (error) {
      showMessage({
        message: `Error fetching reviews: ${error.message}`,
        type: "danger",
      });
      console.error("Fetch user reviews error:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserReviews();
  }, [fetchUserReviews]);

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Reviews for {userName || `User ${userId.substring(0, 6)}...`}
      </Text>
      {reviews.length === 0 ? (
        <Text style={styles.emptyText}>No reviews yet for this user.</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ReviewItem item={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#666",
  },
  reviewItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  reviewDate: {
    fontSize: 12,
    color: "#777",
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 5,
  },
  reviewType: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#888",
    marginTop: 5,
  },
  rideContext: {
    fontSize: 11,
    color: "#AAA",
    marginTop: 3,
  },
});
