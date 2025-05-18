import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { apiRequest } from "../../utils/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

const RideListItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.rideItem} onPress={() => onPress(item._id)}>
    <View style={styles.rideHeader}>
      <Text style={styles.rideLocation}>
        {item.startLocation.address.substring(0, 25)}... ➔{" "}
        {item.endLocation.address.substring(0, 25)}...
      </Text>
      <Text style={styles.ridePrice}>${item.pricePerSeat}</Text>
    </View>
    <Text style={styles.rideDeparture}>
      Departs: {new Date(item.departureTime).toLocaleString()}
    </Text>
    <Text style={styles.rideSeats}>Seats: {item.availableSeats}</Text>
    <View style={styles.driverInfo}>
      <Text style={styles.driverName}>Driver: {item.driver.name}</Text>
      <Text style={styles.driverRating}>
        Rating: {item.driver.averageRating?.toFixed(1) || "N/A"} (
        {item.driver.totalRatings || 0})
      </Text>
    </View>
  </TouchableOpacity>
);

export default function SearchRidesResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { searchParams } = route.params; // { fromLat, fromLng, toLat, toLng, departureAfter, seats }

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRides = useCallback(async () => {
    setLoading(true);
    try {
      // Construct query string from searchParams
      const query = new URLSearchParams(searchParams).toString();
      const results = await apiRequest(
        `/api/rides?${query}`,
        "GET",
        null,
        false,
      ); // Public endpoint
      setRides(results);
      if (results.length === 0) {
        showMessage({
          message: "No rides found matching your criteria.",
          type: "info",
        });
      }
    } catch (error) {
      showMessage({
        message: `Error searching rides: ${error.message}`,
        type: "danger",
      });
      console.error("Search rides error:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <View style={styles.container}>
      {rides.length === 0 && !loading ? (
        <Text style={styles.emptyText}>
          No rides available for your search.
        </Text>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <RideListItem
              item={item}
              onPress={(rideId) =>
                navigation.navigate("RideDetails", { rideId })
              }
            />
          )}
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
  rideItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  rideLocation: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    flex: 1, // Allow text to wrap
    marginRight: 10,
  },
  ridePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745", // Green for price
  },
  rideDeparture: {
    fontSize: 13,
    color: "#555",
    marginBottom: 5,
  },
  rideSeats: {
    fontSize: 13,
    color: "#555",
    marginBottom: 8,
  },
  driverInfo: {
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  driverName: {
    fontSize: 13,
    color: "#007BFF",
  },
  driverRating: {
    fontSize: 13,
    color: "#777",
  },
});
