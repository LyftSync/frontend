import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useAuthStore from "../stores/authStore";
import { apiRequest } from "../utils/api";
import { showMessage } from "react-native-flash-message";

const BookingItem = ({ item, onPress, itemType }) => {
  const commonDetails = itemType === "booking" ? item.ride : item;
  const driverName =
    itemType === "booking"
      ? commonDetails?.driver?.name
      : useAuthStore.getState().user?.name;
  const riderName =
    itemType === "booking"
      ? useAuthStore.getState().user?.name
      : item.rider?.name;

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onPress(item)}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>
          {commonDetails?.startLocation?.address?.substring(0, 20) || "Origin"}{" "}
          to{" "}
          {commonDetails?.endLocation?.address?.substring(0, 20) ||
            "Destination"}
        </Text>
        <Text style={[styles.status, styles[`status_${item.status}`]]}>
          {item.status.replace(/_/g, " ")}
        </Text>
      </View>
      <Text style={styles.itemDate}>
        {new Date(commonDetails?.departureTime).toLocaleString()}
      </Text>
      {itemType === "booking" && driverName && (
        <Text style={styles.itemText}>Driver: {driverName}</Text>
      )}
      {itemType === "offeredRide" && item.passengers?.length > 0 && (
        <Text style={styles.itemText}>
          Passengers: {item.passengers.length}
        </Text>
      )}
      {itemType === "offeredRide" && item.passengers?.length === 0 && (
        <Text style={styles.itemText}>No passengers booked yet</Text>
      )}
      {item.requestedSeats && (
        <Text style={styles.itemText}>Seats: {item.requestedSeats}</Text>
      )}
      {commonDetails?.pricePerSeat > 0 && (
        <Text style={styles.itemText}>
          Price: ${commonDetails.pricePerSeat}/seat
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default function ActivityScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [offeredRides, setOfferedRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(
    user?.role === "driver" || user?.role === "both" ? "offered" : "bookings",
  );

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch bookings if user is a rider or both
      if (user.role === "rider" || user.role === "both") {
        const bookingData = await apiRequest(
          "/api/bookings/my-requests",
          "GET",
        );
        setBookings(bookingData || []);
      }
      // Fetch offered rides if user is a driver or both
      if (user.role === "driver" || user.role === "both") {
        const offeredRidesData = await apiRequest(
          "/api/rides/my-offered",
          "GET",
        );
        setOfferedRides(offeredRidesData || []);
      }
    } catch (error) {
      showMessage({
        message: `Error fetching data: ${error.message}`,
        type: "danger",
      });
      console.error("Fetch data error:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, [fetchData]);

  const handleBookingPress = (booking) => {
    navigation.navigate("BookingDetails", { bookingId: booking._id });
  };

  const handleOfferedRidePress = (ride) => {
    // Navigate to a screen to manage the offered ride, e.g., view bookings for it, update status
    navigation.navigate("RideDetails", { rideId: ride._id });
  };

  const renderContent = () => {
    if (
      loading &&
      !refreshing &&
      bookings.length === 0 &&
      offeredRides.length === 0
    ) {
      return (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 20 }}
        />
      );
    }

    if (activeTab === "bookings") {
      if (!bookings || bookings.length === 0) {
        return (
          <Text style={styles.emptyText}>You have no booking requests.</Text>
        );
      }
      return (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <BookingItem
              item={item}
              onPress={handleBookingPress}
              itemType="booking"
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      );
    }

    if (activeTab === "offered") {
      if (!offeredRides || offeredRides.length === 0) {
        return (
          <Text style={styles.emptyText}>You have not offered any rides.</Text>
        );
      }
      return (
        <FlatList
          data={offeredRides}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <BookingItem
              item={item}
              onPress={handleOfferedRidePress}
              itemType="offeredRide"
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      );
    }
    return null;
  };

  const showBookingsTab = user?.role === "rider" || user?.role === "both";
  const showOfferedTab = user?.role === "driver" || user?.role === "both";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Activity</Text>
      {showBookingsTab && showOfferedTab && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "bookings" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("bookings")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "bookings" && styles.activeTabButtonText,
              ]}
            >
              My Bookings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "offered" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("offered")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "offered" && styles.activeTabButtonText,
              ]}
            >
              My Offered Rides
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 10, // Adjust as needed if header is present
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: "#007AFF",
  },
  tabButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  activeTabButtonText: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingBottom: 80, // To avoid overlap with bottom tab navigator
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
    fontSize: 16,
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
    overflow: "hidden", // For borderRadius on iOS
  },
  status_pending: { backgroundColor: "#FFD700", color: "#503D00" }, // Gold
  status_accepted: { backgroundColor: "#90EE90", color: "#003300" }, // LightGreen
  status_rejected_by_driver: { backgroundColor: "#FFA07A", color: "#5A2D00" }, // LightSalmon
  status_cancelled_by_rider: { backgroundColor: "#D3D3D3", color: "#333333" }, // LightGray
  status_completed: { backgroundColor: "#ADD8E6", color: "#002233" }, // LightBlue
  status_active: { backgroundColor: "#20B2AA", color: "#FFFFFF" }, // LightSeaGreen
  status_cancelled_by_driver: { backgroundColor: "#F08080", color: "#FFFFFF" }, // LightCoral (for offered rides)
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
});
