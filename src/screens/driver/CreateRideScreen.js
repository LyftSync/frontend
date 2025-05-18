import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from "react-native";
import { apiRequest } from "../../utils/api";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import useMapStore from "../../stores/mapStore"; // To potentially use selected locations

export default function CreateRideScreen() {
  const navigation = useNavigation();
  // const { origin, destination } = useMapStore(); // Get locations from mapStore

  // For manual input if mapStore locations aren't used or for overrides
  const [startAddress, setStartAddress] = useState("");
  const [startLat, setStartLat] = useState("");
  const [startLng, setStartLng] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [endLat, setEndLat] = useState("");
  const [endLng, setEndLng] = useState("");

  const [departureTime, setDepartureTime] = useState(
    new Date(Date.now() + 3600 * 1000),
  ); // Default to 1 hour from now
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState(
    new Date(Date.now() + 7200 * 1000),
  ); // Default to 2 hours from now
  const [availableSeats, setAvailableSeats] = useState("1");
  const [pricePerSeat, setPricePerSeat] = useState("0");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);

  // TODO: Integrate with mapStore if origin/destination are selected on map first
  // useEffect(() => {
  //   if (origin) {
  //     setStartAddress(origin.description || '');
  //     setStartLat(origin.location.lat.toString());
  //     setStartLng(origin.location.lng.toString());
  //   }
  //   if (destination) {
  //     setEndAddress(destination.description || '');
  //     setEndLat(destination.location.lat.toString());
  //     setEndLng(destination.location.lng.toString());
  //   }
  // }, [origin, destination]);

  const handleCreateRide = async () => {
    if (
      !startAddress ||
      !startLat ||
      !startLng ||
      !endAddress ||
      !endLat ||
      !endLng
    ) {
      showMessage({
        message:
          "Start and End location details (address, lat, lng) are required.",
        type: "danger",
      });
      return;
    }
    if (new Date(departureTime) < new Date()) {
      showMessage({
        message: "Departure time cannot be in the past.",
        type: "danger",
      });
      return;
    }
    if (new Date(estimatedArrivalTime) < new Date(departureTime)) {
      showMessage({
        message: "Estimated arrival time cannot be before departure time.",
        type: "danger",
      });
      return;
    }
    if (parseInt(availableSeats) < 1) {
      showMessage({
        message: "Available seats must be at least 1.",
        type: "danger",
      });
      return;
    }

    setLoading(true);
    const rideData = {
      startLocation: {
        address: startAddress,
        coordinates: [parseFloat(startLng), parseFloat(startLat)],
      },
      endLocation: {
        address: endAddress,
        coordinates: [parseFloat(endLng), parseFloat(endLat)],
      },
      departureTime: departureTime.toISOString(),
      estimatedArrivalTime: estimatedArrivalTime.toISOString(),
      availableSeats: parseInt(availableSeats),
      pricePerSeat: parseFloat(pricePerSeat),
      notes,
    };

    try {
      await apiRequest("/api/rides", "POST", rideData);
      showMessage({ message: "Ride created successfully!", type: "success" });
      // Optionally, clear mapStore locations
      // useMapStore.getState().resetLocations();
      navigation.goBack(); // Or navigate to My Offered Rides
    } catch (error) {
      showMessage({
        message: `Error creating ride: ${error.message}`,
        type: "danger",
      });
      console.error("Create ride error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDateTimeChange = (event, selectedDate, type) => {
    const currentDate =
      selectedDate ||
      (type === "departure" ? departureTime : estimatedArrivalTime);
    if (type === "departure") {
      setShowDeparturePicker(Platform.OS === "ios");
      setDepartureTime(currentDate);
      // Automatically set arrival time if not set or if it's before new departure time
      if (currentDate >= estimatedArrivalTime) {
        setEstimatedArrivalTime(new Date(currentDate.getTime() + 3600 * 1000)); // 1 hour later
      }
    } else {
      setShowArrivalPicker(Platform.OS === "ios");
      setEstimatedArrivalTime(currentDate);
    }
  };

  const showPicker = (type) => {
    if (type === "departure") setShowDeparturePicker(true);
    else setShowArrivalPicker(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Offer a New Ride</Text>

      <Text style={styles.label}>Start Location Address</Text>
      <TextInput
        style={styles.input}
        value={startAddress}
        onChangeText={setStartAddress}
        placeholder="e.g., 123 Main St, City"
      />
      <View style={styles.latLngContainer}>
        <TextInput
          style={[styles.input, styles.latLngInput]}
          value={startLat}
          onChangeText={setStartLat}
          placeholder="Start Lat"
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.latLngInput]}
          value={startLng}
          onChangeText={setStartLng}
          placeholder="Start Lng"
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.label}>End Location Address</Text>
      <TextInput
        style={styles.input}
        value={endAddress}
        onChangeText={setEndAddress}
        placeholder="e.g., 456 Market Ave, Town"
      />
      <View style={styles.latLngContainer}>
        <TextInput
          style={[styles.input, styles.latLngInput]}
          value={endLat}
          onChangeText={setEndLat}
          placeholder="End Lat"
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.latLngInput]}
          value={endLng}
          onChangeText={setEndLng}
          placeholder="End Lng"
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.label}>Departure Time</Text>
      <TouchableOpacity
        onPress={() => showPicker("departure")}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>{departureTime.toLocaleString()}</Text>
      </TouchableOpacity>
      {showDeparturePicker && (
        <DateTimePicker
          testID="departureTimePicker"
          value={departureTime}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={(event, date) => onDateTimeChange(event, date, "departure")}
          minimumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Estimated Arrival Time</Text>
      <TouchableOpacity
        onPress={() => showPicker("arrival")}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>
          {estimatedArrivalTime.toLocaleString()}
        </Text>
      </TouchableOpacity>
      {showArrivalPicker && (
        <DateTimePicker
          testID="estimatedArrivalTimePicker"
          value={estimatedArrivalTime}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={(event, date) => onDateTimeChange(event, date, "arrival")}
          minimumDate={departureTime}
        />
      )}

      <Text style={styles.label}>Available Seats</Text>
      <TextInput
        style={styles.input}
        value={availableSeats}
        onChangeText={setAvailableSeats}
        placeholder="Number of seats"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Price Per Seat ($)</Text>
      <TextInput
        style={styles.input}
        value={pricePerSeat}
        onChangeText={setPricePerSeat}
        placeholder="Amount in USD"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Notes (Optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={notes}
        onChangeText={setNotes}
        placeholder="e.g., Cash only, specific pickup instructions"
        multiline
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginVertical: 20 }}
        />
      ) : (
        <Button title="Create Ride Offer" onPress={handleCreateRide} />
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
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
  latLngContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  latLngInput: {
    width: "48%",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dateButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
});
