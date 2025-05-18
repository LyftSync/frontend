import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Use a picker for rating
import { apiRequest } from "../../utils/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import useAuthStore from "../../stores/authStore";

export default function CreateReviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    rideId,
    revieweeId: initialRevieweeId,
    defaultReviewType,
  } = route.params; // revieweeId might be null if driver reviews passenger
  const { user } = useAuthStore();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewType, setReviewType] = useState(
    defaultReviewType || "driver_review",
  );
  const [revieweeId, setRevieweeId] = useState(initialRevieweeId);
  const [passengers, setPassengers] = useState([]); // For driver to select a passenger

  const [loading, setLoading] = useState(false);
  const [rideDetails, setRideDetails] = useState(null);

  useEffect(() => {
    setReviewType(defaultReviewType);
    setRevieweeId(initialRevieweeId);

    const fetchRideAndPassengers = async () => {
      if (!rideId) return;
      setLoading(true);
      try {
        const rideData = await apiRequest(
          `/api/rides/${rideId}`,
          "GET",
          null,
          false,
        );
        setRideDetails(rideData);
        if (
          defaultReviewType === "rider_review" &&
          rideData &&
          rideData.passengers
        ) {
          // Fetch details for passengers to allow selection
          const passengerDetailsPromises = rideData.passengers.map((pId) =>
            apiRequest(`/api/users/${pId}`, "GET", null, false),
          );
          const passengerFullDetails = await Promise.all(
            passengerDetailsPromises,
          );
          setPassengers(passengerFullDetails.filter((p) => p)); // filter out any null responses
        }
      } catch (error) {
        showMessage({
          message: `Error fetching ride data: ${error.message}`,
          type: "danger",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRideAndPassengers();
  }, [rideId, defaultReviewType, initialRevieweeId]);

  const handleSubmitReview = async () => {
    if (!revieweeId && reviewType === "rider_review") {
      showMessage({
        message: "Please select a passenger to review.",
        type: "warning",
      });
      return;
    }
    if (!revieweeId) {
      // Should not happen if logic is correct, but as a safeguard
      showMessage({ message: "Reviewee is not specified.", type: "warning" });
      return;
    }

    setLoading(true);
    const reviewData = {
      rideId,
      revieweeId,
      rating: Number(rating),
      comment,
      reviewType,
    };

    try {
      await apiRequest("/api/reviews", "POST", reviewData);
      showMessage({
        message: "Review submitted successfully!",
        type: "success",
      });
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: `Error submitting review: ${error.message}`,
        type: "danger",
      });
      console.error("Submit review error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !rideDetails) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Write a Review</Text>

      {rideDetails && (
        <View style={styles.rideInfo}>
          <Text>
            For ride from {rideDetails.startLocation.address.substring(0, 20)}
            ...
          </Text>
          <Text>To {rideDetails.endLocation.address.substring(0, 20)}...</Text>
          <Text>
            On {new Date(rideDetails.departureTime).toLocaleDateString()}
          </Text>
        </View>
      )}

      {/* If current user is driver and reviewing a rider */}
      {reviewType === "rider_review" && passengers.length > 0 && (
        <>
          <Text style={styles.label}>Select Passenger to Review:</Text>
          <Picker
            selectedValue={revieweeId}
            onValueChange={(itemValue) => setRevieweeId(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="-- Select a Passenger --" value={null} />
            {passengers.map((p) => (
              <Picker.Item
                key={p._id}
                label={`${p.name} (UID: ...${p._id.slice(-4)})`}
                value={p._id}
              />
            ))}
          </Picker>
        </>
      )}
      {reviewType === "rider_review" &&
        passengers.length === 0 &&
        rideDetails &&
        user?._id === rideDetails?.driver?._id && (
          <Text style={styles.infoText}>
            No completed passenger bookings on this ride to review.
          </Text>
        )}

      {/* If current user is rider and reviewing the driver */}
      {reviewType === "driver_review" && rideDetails?.driver && (
        <Text style={styles.label}>
          Reviewing Driver: {rideDetails.driver.name}
        </Text>
      )}

      <Text style={styles.label}>Rating (1-5):</Text>
      <Picker
        selectedValue={rating}
        onValueChange={(itemValue) => setRating(itemValue)}
        style={styles.picker}
      >
        {[1, 2, 3, 4, 5].map((r) => (
          <Picker.Item key={r} label={r.toString()} value={r} />
        ))}
      </Picker>

      <Text style={styles.label}>Comment (Optional):</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={comment}
        onChangeText={setComment}
        placeholder="Share your experience..."
        multiline
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginVertical: 20 }}
        />
      ) : (
        <Button
          title="Submit Review"
          onPress={handleSubmitReview}
          disabled={
            !revieweeId ||
            (reviewType === "rider_review" &&
              passengers.length === 0 &&
              !initialRevieweeId)
          }
        />
      )}
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  rideInfo: {
    padding: 10,
    backgroundColor: "#EFEFEF",
    borderRadius: 5,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  picker: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: "grey",
    textAlign: "center",
    marginVertical: 10,
  },
});
