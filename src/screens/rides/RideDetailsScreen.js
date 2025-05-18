import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import { apiRequest } from "../../utils/api";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import useAuthStore from "../../stores/authStore";
import { showMessage } from "react-native-flash-message";

export default function RideDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { rideId } = route.params;
  const { user } = useAuthStore();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [userBooking, setUserBooking] = useState(null); // To check if current user has booked this ride

  const fetchRideDetails = useCallback(async () => {
    setLoading(true);
    try {
      const rideData = await apiRequest(
        `/api/rides/${rideId}`,
        "GET",
        null,
        false,
      ); // public access for details
      setRide(rideData);
      if (user && rideData) {
        // If user is logged in, check their booking status for this ride
        const bookings = await apiRequest("/api/bookings/my-requests", "GET");
        const existingBooking = bookings.find(
          (b) =>
            b.ride._id === rideId && ["pending", "accepted"].includes(b.status),
        );
        setUserBooking(existingBooking);
      }
    } catch (error) {
      showMessage({
        message: `Error fetching ride details: ${error.message}`,
        type: "danger",
      });
      console.error("Fetch ride details error:", error);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [rideId, user, navigation]);

  useFocusEffect(fetchRideDetails);

  const handleBookRide = async () => {
    if (!user) {
      showMessage({ message: "Please login to book a ride.", type: "info" });
      navigation.navigate("Login"); // Assuming Login is in AuthNavigator accessible globally or part of current stack
      return;
    }
    if (user._id === ride?.driver?._id) {
      showMessage({
        message: "You cannot book your own ride.",
        type: "warning",
      });
      return;
    }
    if (userBooking) {
      showMessage({
        message: "You already have an active booking for this ride.",
        type: "info",
      });
      return;
    }

    setBookingLoading(true);
    try {
      // Defaulting to 1 seat for now. Could add an input for this.
      const bookingData = await apiRequest(
        `/api/rides/${rideId}/bookings`,
        "POST",
        { requestedSeats: 1 },
      );
      showMessage({
        message: "Booking request sent successfully!",
        type: "success",
      });
      setUserBooking(bookingData); // Update local state
      // fetchRideDetails(); // Re-fetch to update available seats, etc. but might be too slow. Driver actions update seats.
    } catch (error) {
      showMessage({
        message: `Booking failed: ${error.message}`,
        type: "danger",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!userBooking) {
      showMessage({
        message: "No active booking found to cancel.",
        type: "warning",
      });
      return;
    }
    setBookingLoading(true);
    try {
      await apiRequest(`/api/bookings/${userBooking._id}/status`, "PATCH", {
        status: "cancelled_by_rider",
      });
      showMessage({
        message: "Booking cancelled successfully!",
        type: "success",
      });
      setUserBooking(null); // Clear local state
      // fetchRideDetails(); // Re-fetch
    } catch (error) {
      showMessage({
        message: `Failed to cancel booking: ${error.message}`,
        type: "danger",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleUpdateRideStatus = async (newStatus) => {
    Alert.alert(
      "Confirm Status Change",
      `Are you sure you want to change ride status to "${newStatus.replace("_", " ")}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setStatusUpdateLoading(true);
            try {
              const updatedRide = await apiRequest(
                `/api/rides/${rideId}/status`,
                "PATCH",
                { status: newStatus },
              );
              setRide(updatedRide); // Update local ride state
              showMessage({
                message: `Ride status updated to ${newStatus}!`,
                type: "success",
              });
            } catch (error) {
              showMessage({
                message: `Failed to update ride status: ${error.message}`,
                type: "danger",
              });
            } finally {
              setStatusUpdateLoading(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <ActivityIndicator style={styles.centered} size="large" color="#007AFF" />
    );
  }

  if (!ride) {
    return (
      <View style={styles.centered}>
        <Text>Ride not found.</Text>
      </View>
    );
  }

  const isDriverOfThisRide = user && user._id === ride.driver._id;
  const canBook =
    ride.status === "pending" && ride.availableSeats > 0 && !isDriverOfThisRide;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ride Details</Text>
        <InfoRow label="From" value={ride.startLocation.address} />
        <InfoRow label="To" value={ride.endLocation.address} />
        <InfoRow
          label="Departure"
          value={new Date(ride.departureTime).toLocaleString()}
        />
        <InfoRow
          label="Est. Arrival"
          value={
            ride.estimatedArrivalTime
              ? new Date(ride.estimatedArrivalTime).toLocaleString()
              : "N/A"
          }
        />
        <InfoRow
          label="Status"
          value={ride.status.replace(/_/g, " ")}
          style={styles[`status_${ride.status}`]}
        />
        <InfoRow
          label="Seats Available"
          value={ride.availableSeats.toString()}
        />
        <InfoRow label="Price per Seat" value={`$${ride.pricePerSeat}`} />
        {ride.notes && <InfoRow label="Notes" value={ride.notes} />}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Driver Information</Text>
        <InfoRow label="Name" value={ride.driver.name} />
        {/* Can add onPress to navigate to driver's public profile */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserProfile", { userId: ride.driver._id })
          }
        >
          <Text style={styles.linkText}>View Driver's Profile</Text>
        </TouchableOpacity>
        {isDriverOfThisRide && (
          <InfoRow label="Phone (Visible to you)" value={ride.driver.phone} />
        )}
      </View>

      {/* Rider Actions */}
      {!isDriverOfThisRide && user && canBook && !userBooking && (
        <View style={styles.actionButton}>
          <Button
            title="Book 1 Seat"
            onPress={handleBookRide}
            disabled={bookingLoading}
            color="#28A745"
          />
          {bookingLoading && <ActivityIndicator style={{ marginTop: 5 }} />}
        </View>
      )}
      {!isDriverOfThisRide &&
        user &&
        userBooking &&
        ["pending", "accepted"].includes(userBooking.status) && (
          <View style={styles.actionButton}>
            <Text style={styles.infoText}>
              Your booking status: {userBooking.status}
            </Text>
            <Button
              title="Cancel My Booking"
              onPress={handleCancelBooking}
              disabled={bookingLoading}
              color="#DC3545"
            />
            {bookingLoading && <ActivityIndicator style={{ marginTop: 5 }} />}
          </View>
        )}

      {/* Driver Actions */}
      {isDriverOfThisRide && (
        <View style={styles.card}>
          <Text style={styles.title}>Driver Controls</Text>
          {ride.status === "pending" && (
            <>
              <Button
                title="Start Ride"
                onPress={() => handleUpdateRideStatus("active")}
                disabled={statusUpdateLoading}
              />
              <View style={{ marginVertical: 5 }} />
              <Button
                title="Edit Ride"
                onPress={() =>
                  navigation.navigate("CreateRide", {
                    rideIdToEdit: ride._id,
                    rideData: ride,
                  })
                }
                color="#FFC107"
              />
              <View style={{ marginVertical: 5 }} />
              <Button
                title="Cancel Ride"
                onPress={() => handleUpdateRideStatus("cancelled_by_driver")}
                color="#DC3545"
                disabled={statusUpdateLoading}
              />
            </>
          )}
          {ride.status === "active" && (
            <>
              <Button
                title="Complete Ride"
                onPress={() => handleUpdateRideStatus("completed")}
                disabled={statusUpdateLoading}
              />
              <View style={{ marginVertical: 5 }} />
              <Button
                title="Cancel Ride (Emergency)"
                onPress={() => handleUpdateRideStatus("cancelled_by_driver")}
                color="#DC3545"
                disabled={statusUpdateLoading}
              />
            </>
          )}
          {(ride.status === "completed" ||
            ride.status === "cancelled_by_driver") && (
            <Text style={styles.infoText}>
              This ride is {ride.status.replace("_", " ")}.
            </Text>
          )}
          {statusUpdateLoading && (
            <ActivityIndicator style={{ marginTop: 10 }} />
          )}
          <View style={{ marginVertical: 5 }} />
          <Button
            title="View Booking Requests"
            onPress={() =>
              navigation.navigate("RideBookingManagement", { rideId: ride._id })
            }
          />
        </View>
      )}

      {/* Allow review if ride is completed and user was part of it */}
      {ride.status === "completed" &&
        user &&
        (isDriverOfThisRide || userBooking?.status === "completed") && ( // Driver can review riders, rider can review driver
          <View style={styles.actionButton}>
            <Button
              title={isDriverOfThisRide ? "Review Passengers" : "Review Driver"}
              onPress={() =>
                navigation.navigate("CreateReview", {
                  rideId: ride._id,
                  // If current user is driver, they pick a passenger to review.
                  // If current user is rider, reviewee is the driver.
                  revieweeId: isDriverOfThisRide ? null : ride.driver._id, // null if driver needs to pick passenger
                  defaultReviewType: isDriverOfThisRide
                    ? "rider_review"
                    : "driver_review",
                })
              }
              color="#17A2B8"
            />
          </View>
        )}

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const InfoRow = ({ label, value, style }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={[styles.value, style]}>{value}</Text>
  </View>
);

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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  label: {
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
  },
  value: {
    fontSize: 15,
    color: "#333",
    textAlign: "right",
    flexShrink: 1, // Allows text to wrap if too long
  },
  status_pending: { color: "#FFA500", fontWeight: "bold" }, // Orange
  status_active: { color: "#28A745", fontWeight: "bold" }, // Green
  status_completed: { color: "#007BFF", fontWeight: "bold" }, // Blue
  status_cancelled_by_driver: { color: "#DC3545", fontWeight: "bold" }, // Red
  status_cancelled_by_system: { color: "#6C757D", fontWeight: "bold" }, // Gray
  actionButton: {
    marginHorizontal: 10,
    marginVertical: 15,
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    color: "#007BFF",
    marginVertical: 10,
  },
  linkText: {
    color: "#007BFF",
    textDecorationLine: "underline",
    paddingVertical: 5,
    fontSize: 15,
  },
});
