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

export default function BookingDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingId } = route.params;
  const { user } = useAuthStore();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookingDetails = useCallback(async () => {
    setLoading(true);
    try {
      const bookingData = await apiRequest(`/api/bookings/${bookingId}`, "GET");
      setBooking(bookingData);
    } catch (error) {
      showMessage({
        message: `Error fetching booking details: ${error.message}`,
        type: "danger",
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [bookingId, navigation]);

  useFocusEffect(fetchBookingDetails);

  const handleCancelBookingByRider = async () => {
    if (
      !booking ||
      (booking.status !== "pending" && booking.status !== "accepted")
    ) {
      showMessage({
        message: "Booking cannot be cancelled in its current state.",
        type: "warning",
      });
      return;
    }
    Alert.alert(
      "Confirm Cancellation",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          onPress: async () => {
            setActionLoading(true);
            try {
              const updatedBooking = await apiRequest(
                `/api/bookings/${booking._id}/status`,
                "PATCH",
                { status: "cancelled_by_rider" },
              );
              setBooking(updatedBooking);
              showMessage({
                message: "Booking cancelled successfully!",
                type: "success",
              });
            } catch (error) {
              showMessage({
                message: `Failed to cancel booking: ${error.message}`,
                type: "danger",
              });
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleUpdateBookingByDriver = async (newStatus) => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${newStatus === "accepted" ? "accept" : "reject"} this booking?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setActionLoading(true);
            try {
              const updatedBooking = await apiRequest(
                `/api/bookings/${booking._id}/status`,
                "PATCH",
                { status: newStatus },
              );
              setBooking(updatedBooking);
              showMessage({
                message: `Booking ${newStatus === "accepted" ? "accepted" : "rejected"}!`,
                type: "success",
              });
            } catch (error) {
              showMessage({
                message: `Failed to update booking status: ${error.message}`,
                type: "danger",
              });
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  if (!booking) {
    return (
      <View style={styles.centered}>
        <Text>Booking not found.</Text>
      </View>
    );
  }

  const isRiderOfThisBooking = user && user._id === booking.rider._id;
  const isDriverOfAssociatedRide = user && user._id === booking.ride.driver._id;
  const ride = booking.ride;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Booking Summary</Text>
        <InfoRow
          label="Status"
          value={booking.status.replace(/_/g, " ")}
          style={styles[`status_${booking.status}`]}
        />
        <InfoRow
          label="Requested Seats"
          value={booking.requestedSeats.toString()}
        />
        <InfoRow
          label="Booking Time"
          value={new Date(booking.bookingTime).toLocaleString()}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Ride Information</Text>
        <InfoRow label="From" value={ride.startLocation.address} />
        <InfoRow label="To" value={ride.endLocation.address} />
        <InfoRow
          label="Departure"
          value={new Date(ride.departureTime).toLocaleString()}
        />
        <InfoRow label="Price per Seat" value={`$${ride.pricePerSeat}`} />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("RideDetails", { rideId: ride._id })
          }
        >
          <Text style={styles.linkText}>View Full Ride Details</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Participants</Text>
        <InfoRow label="Rider" value={booking.rider.name} />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserProfile", { userId: booking.rider._id })
          }
        >
          <Text style={styles.linkText}>View Rider's Profile</Text>
        </TouchableOpacity>
        <InfoRow label="Driver" value={ride.driver.name} />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserProfile", { userId: ride.driver._id })
          }
        >
          <Text style={styles.linkText}>View Driver's Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      {isRiderOfThisBooking &&
        (booking.status === "pending" || booking.status === "accepted") && (
          <View style={styles.actionButton}>
            <Button
              title="Cancel My Booking"
              onPress={handleCancelBookingByRider}
              disabled={actionLoading}
              color="#DC3545"
            />
          </View>
        )}

      {isDriverOfAssociatedRide && booking.status === "pending" && (
        <View style={styles.driverActions}>
          <Button
            title="Accept Booking"
            onPress={() => handleUpdateBookingByDriver("accepted")}
            disabled={actionLoading}
            color="green"
          />
          <View style={{ width: 15 }} />
          <Button
            title="Reject Booking"
            onPress={() => handleUpdateBookingByDriver("rejected_by_driver")}
            disabled={actionLoading}
            color="red"
          />
        </View>
      )}
      {isDriverOfAssociatedRide &&
        booking.status === "accepted" &&
        ride.status !== "completed" &&
        ride.status !== "active" && ( // Driver can cancel an accepted booking if ride not started/completed
          <View style={styles.actionButton}>
            <Button
              title="Cancel This Accepted Booking"
              onPress={() => handleUpdateBookingByDriver("rejected_by_driver")}
              disabled={actionLoading}
              color="orange"
            />
          </View>
        )}

      {actionLoading && <ActivityIndicator style={{ marginTop: 10 }} />}

      {/* Review options if ride and booking are completed */}
      {booking.status === "completed" && ride.status === "completed" && (
        <View style={styles.actionButton}>
          <Button
            title={
              isRiderOfThisBooking
                ? "Review Driver"
                : isDriverOfAssociatedRide
                  ? "Review Rider"
                  : ""
            }
            onPress={() =>
              navigation.navigate("CreateReview", {
                rideId: ride._id,
                revieweeId: isRiderOfThisBooking
                  ? ride.driver._id
                  : isDriverOfAssociatedRide
                    ? booking.rider._id
                    : null,
                defaultReviewType: isRiderOfThisBooking
                  ? "driver_review"
                  : isDriverOfAssociatedRide
                    ? "rider_review"
                    : null,
              })
            }
            color="#17A2B8"
            disabled={!isRiderOfThisBooking && !isDriverOfAssociatedRide}
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
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
    flexShrink: 1,
  },
  status_pending: { color: "#FFA500", fontWeight: "bold" },
  status_accepted: { color: "#28A745", fontWeight: "bold" },
  status_rejected_by_driver: { color: "#DC3545", fontWeight: "bold" },
  status_cancelled_by_rider: { color: "#6C757D", fontWeight: "bold" },
  status_completed: { color: "#007BFF", fontWeight: "bold" },
  actionButton: {
    marginHorizontal: 10,
    marginVertical: 15,
  },
  driverActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 10,
    marginVertical: 15,
  },
  linkText: {
    color: "#007BFF",
    textDecorationLine: "underline",
    paddingVertical: 5,
    fontSize: 15,
  },
});
