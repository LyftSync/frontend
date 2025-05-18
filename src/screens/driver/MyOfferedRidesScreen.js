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
import { apiRequest } from "../../utils/api";
import { showMessage } from "react-native-flash-message";

const RideItem = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.itemContainer}
    onPress={() => onPress(item._id)}
  >
    <View style={styles.itemHeader}>
      <Text style={styles.itemTitle}>
        {item.startLocation.address.substring(0, 20)}... to{" "}
        {item.endLocation.address.substring(0, 20)}...
      </Text>
      <Text style={[styles.status, styles[`status_${item.status}`]]}>
        {item.status.replace(/_/g, " ")}
      </Text>
    </View>
    <Text style={styles.itemDate}>
      Departure: {new Date(item.departureTime).toLocaleString()}
    </Text>
    <Text style={styles.itemText}>Seats Available: {item.availableSeats}</Text>
    <Text style={styles.itemText}>Price: ${item.pricePerSeat}</Text>
    <Text style={styles.itemText}>Passengers: {item.passengers.length}</Text>
  </TouchableOpacity>
);

export default function MyOfferedRidesScreen() {
  const navigation = useNavigation();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyOfferedRides = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/api/rides/my-offered", "GET");
      setRides(data || []);
    } catch (error) {
      showMessage({
        message: `Error fetching offered rides: ${error.message}`,
        type: "danger",
      });
      console.error("Fetch offered rides error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(fetchMyOfferedRides);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyOfferedRides().finally(() => setRefreshing(false));
  }, [fetchMyOfferedRides]);

  const handleRidePress = (rideId) => {
    navigation.navigate("RideDetails", { rideId });
  };

  if (loading && rides.length === 0 && !refreshing) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <View style={styles.container}>
      {rides.length === 0 ? (
        <Text style={styles.emptyText}>You haven't offered any rides yet.</Text>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <RideItem item={item} onPress={handleRidePress} />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateRide")}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
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
    overflow: "hidden",
  },
  status_pending: { backgroundColor: "#FFD700", color: "#503D00" },
  status_active: { backgroundColor: "#90EE90", color: "#003300" },
  status_completed: { backgroundColor: "#ADD8E6", color: "#002233" },
  status_cancelled_by_driver: { backgroundColor: "#FFA07A", color: "#5A2D00" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: "white",
  },
});
