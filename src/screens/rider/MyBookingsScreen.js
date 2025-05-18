import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { apiRequest } from "../../utils/api";
import { showMessage } from "react-native-flash-message";

const BookingItem = ({ item, onCancel, onNavigate }) => {
  const canCancel = item.status === "pending" || item.status === "accepted";
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onNavigate(item._id)}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>
          Ride: {item.ride.startLocation.address.substring(0, 15)}... to{" "}
          {item.ride.endLocation.address.substring(0, 15)}...
        </Text>
        <Text style={[styles.status, styles[`status_${item.status}`]]}>
          {item.status.replace(/_/g, " ")}
        </Text>
      </View>
      <Text style={styles.itemDate}>
        Departure: {new Date(item.ride.departureTime).toLocaleString()}
      </Text>
      <Text style={styles.itemText}>Driver: {item.ride.driver.name}</Text>
      <Text style={styles.itemText}>
        Seats Requested: {item.requestedSeats}
      </Text>
      {item.ride.pricePerSeat > 0 && (
        <Text style={styles.itemText}>
          Price: ${item.ride.pricePerSeat * item.requestedSeats}
        </Text>
      )}

      {canCancel && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={(e) => {
            e.stopPropagation();
            onCancel(item._id);
          }} // Prevent TouchableOpacity parent onPress
        >
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default function MyBookingsScreen() {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // bookingId being cancelled

  const fetchMyBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/api/bookings/my-requests", "GET");
      setBookings(data || []);
    } catch (error) {
      showMessage({
        message: `Error fetching bookings: ${error.message}`,
        type: "danger",
      });
      console.error("Fetch bookings error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(fetchMyBookings);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyBookings().finally(() => setRefreshing(false));
  }, [fetchMyBookings]);

  const handleCancelBooking = async (bookingId) => {
    Alert.alert(
      "Confirm Cancellation",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          onPress: async () => {
            setActionLoading(bookingId);
            try {
              await apiRequest(`/api/bookings/${bookingId}/status`, "PATCH", {
                status: "cancelled_by_rider",
              });
              showMessage({
                message: "Booking cancelled successfully!",
                type: "success",
              });
              fetchMyBookings(); // Re-fetch to update list
            } catch (error) {
              showMessage({
                message: `Failed to cancel booking: ${error.message}`,
                type: "danger",
              });
            } finally {
              setActionLoading(null);
            }
          },
        },
      ],
    );
  };

  const handleNavigateToDetails = (bookingId) => {
    navigation.navigate("BookingDetails", { bookingId });
  };

  if (loading && bookings.length === 0 && !refreshing) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <View style={styles.container}>
      {bookings.length === 0 ? (
        <Text style={styles.emptyText}>
          You have no booking requests or active bookings.
        </Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <BookingItem
              item={item}
              onCancel={handleCancelBooking}
              onNavigate={handleNavigateToDetails}
              // Pass actionLoading specific to item if needed, or disable all during one action
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
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
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 5,
  },
  itemDate: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 3,
  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    textTransform: "capitalize",
    overflow: "hidden",
  },
  status_pending: { backgroundColor: "#FFD700", color: "#503D00" },
  status_accepted: { backgroundColor: "#90EE90", color: "#003300" },
  status_rejected_by_driver: { backgroundColor: "#FFA07A", color: "#5A2D00" },
  status_cancelled_by_rider: { backgroundColor: "#D3D3D3", color: "#333333" },
  status_completed: { backgroundColor: "#ADD8E6", color: "#002233" },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#DC3545",
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});
