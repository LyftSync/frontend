import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import { apiRequest } from "../../utils/api";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

const BookingRequestItem = ({ item, onAccept, onReject, loadingAction }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.riderName}>Rider: {item.rider.name}</Text>
    <Text style={styles.seatsRequested}>
      Seats Requested: {item.requestedSeats}
    </Text>
    <Text style={styles.itemStatus}>
      Status: {item.status.replace(/_/g, " ")}
    </Text>
    {item.rider.averageRating > 0 && (
      <Text>
        Rider Rating: {item.rider.averageRating.toFixed(1)} (
        {item.rider.totalRatings})
      </Text>
    )}

    {item.status === "pending" && (
      <View style={styles.actionsContainer}>
        <Button
          title="Accept"
          onPress={() => onAccept(item._id)}
          disabled={loadingAction}
          color="green"
        />
        <View style={{ width: 10 }} />
        <Button
          title="Reject"
          onPress={() => onReject(item._id)}
          disabled={loadingAction}
          color="red"
        />
      </View>
    )}
    {item.status === "accepted" && ( // Option to reject an already accepted booking (driver change of plans)
      <View style={styles.actionsContainer}>
        <Button
          title="Cancel This Booking"
          onPress={() => onReject(item._id, true)}
          disabled={loadingAction}
          color="orange"
        />
      </View>
    )}
  </View>
);

export default function RideBookingManagementScreen() {
  const route = useRoute();
  const { rideId } = route.params;
  const [bookings, setBookings] = useState([]);
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookingsForRide = useCallback(async () => {
    setLoading(true);
    try {
      // Also fetch ride details to check available seats
      const rideData = await apiRequest(
        `/api/rides/${rideId}`,
        "GET",
        null,
        false,
      );
      setRide(rideData);

      const data = await apiRequest(`/api/rides/${rideId}/bookings`, "GET");
      setBookings(data);
    } catch (error) {
      showMessage({
        message: `Error fetching bookings: ${error.message}`,
        type: "danger",
      });
      console.error("Fetch bookings error:", error);
    } finally {
      setLoading(false);
    }
  }, [rideId]);

  useFocusEffect(fetchBookingsForRide);

  const handleBookingAction = async (
    bookingId,
    newStatus,
    isCancellingAccepted = false,
  ) => {
    const bookingToUpdate = bookings.find((b) => b._id === bookingId);
    if (!bookingToUpdate) return;

    if (
      newStatus === "accepted" &&
      ride &&
      ride.availableSeats < bookingToUpdate.requestedSeats
    ) {
      showMessage({
        message:
          "Not enough seats available on the ride to accept this booking.",
        type: "danger",
      });
      return;
    }

    const confirmMessage = isCancellingAccepted
      ? "Are you sure you want to cancel this accepted booking? The rider will be notified."
      : `Are you sure you want to ${newStatus === "accepted" ? "accept" : "reject"} this booking?`;

    Alert.alert("Confirm Action", confirmMessage, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          setActionLoading(true);
          try {
            await apiRequest(`/api/bookings/${bookingId}/status`, "PATCH", {
              status: newStatus,
            });
            showMessage({
              message: `Booking ${newStatus === "accepted" ? "accepted" : "rejected"}!`,
              type: "success",
            });
            fetchBookingsForRide(); // Re-fetch to update list and ride details (seats)
          } catch (error) {
            showMessage({
              message: `Failed to update booking: ${error.message}`,
              type: "danger",
            });
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Manage Bookings for Ride</Text>
      {ride && (
        <Text style={styles.seatsInfo}>
          Available Seats on Ride: {ride.availableSeats}
        </Text>
      )}
      {bookings.length === 0 ? (
        <Text style={styles.emptyText}>
          No booking requests for this ride yet.
        </Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BookingRequestItem
              item={item}
              onAccept={(bookingId) =>
                handleBookingAction(bookingId, "accepted")
              }
              onReject={(bookingId, isCancelling) =>
                handleBookingAction(
                  bookingId,
                  "rejected_by_driver",
                  isCancelling,
                )
              }
              loadingAction={actionLoading}
            />
          )}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  seatsInfo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#007AFF",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#666",
  },
  itemContainer: {
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
  riderName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  seatsRequested: {
    fontSize: 14,
    marginVertical: 4,
  },
  itemStatus: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#555",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
