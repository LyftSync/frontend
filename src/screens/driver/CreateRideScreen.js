import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";
import { router } from "expo-router";
import { useTheme } from "react-native-paper";
import DateTimeSelector from "../../components/DateTimeSelector";

export default function CreateRideScreen() {
  const theme = useTheme();
  const [departureTime, setDepartureTime] = useState(new Date());
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState(
    new Date(new Date().getTime() + 60 * 60 * 1000)
  );
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [seatsAvailable, setSeatsAvailable] = useState("");
  const [pricePerSeat, setPricePerSeat] = useState("");

  const handleCreateRide = () => {
    if (
      !pickupLocation ||
      !destination ||
      !departureTime ||
      !estimatedArrivalTime ||
      !seatsAvailable ||
      !pricePerSeat
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const rideDetails = {
      pickupLocation,
      destination,
      departureTime: departureTime.toISOString(),
      estimatedArrivalTime: estimatedArrivalTime.toISOString(),
      seatsAvailable: parseInt(seatsAvailable),
      pricePerSeat: parseFloat(pricePerSeat),
    };

    console.log("Ride Created:", rideDetails);
    Alert.alert("Success", "Ride created successfully!");
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ 
        fontSize: 24, 
        fontWeight: "bold", 
        marginBottom: 20,
        color: theme.colors.text 
      }}>
        Create Ride
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 6, color: theme.colors.text }}>
        Pickup Location
      </Text>
      <TextInput
        value={pickupLocation}
        onChangeText={setPickupLocation}
        placeholder="Enter pickup location"
        placeholderTextColor={theme.colors.placeholder}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.outline,
          padding: 10,
          borderRadius: 6,
          marginBottom: 15,
          color: theme.colors.text,
          backgroundColor: theme.colors.surface,
        }}
      />

      <Text style={{ fontSize: 16, marginBottom: 6, color: theme.colors.text }}>
        Destination
      </Text>
      <TextInput
        value={destination}
        onChangeText={setDestination}
        placeholder="Enter destination"
        placeholderTextColor={theme.colors.placeholder}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.outline,
          padding: 10,
          borderRadius: 6,
          marginBottom: 15,
          color: theme.colors.text,
          backgroundColor: theme.colors.surface,
        }}
      />

      <DateTimeSelector
        label="Departure Time"
        value={departureTime}
        onChange={(date) => {
          setDepartureTime(date);
          if (date >= estimatedArrivalTime) {
            setEstimatedArrivalTime(new Date(date.getTime() + 60 * 60 * 1000));
          }
        }}
        minimumDate={new Date()}
      />

      <DateTimeSelector
        label="Estimated Arrival Time"
        value={estimatedArrivalTime}
        onChange={setEstimatedArrivalTime}
        minimumDate={departureTime}
      />

      <Text style={{ fontSize: 16, marginBottom: 6, color: theme.colors.text }}>
        Seats Available
      </Text>
      <TextInput
        value={seatsAvailable}
        onChangeText={setSeatsAvailable}
        placeholder="Enter number of seats"
        placeholderTextColor={theme.colors.placeholder}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: theme.colors.outline,
          padding: 10,
          borderRadius: 6,
          marginBottom: 15,
          color: theme.colors.text,
          backgroundColor: theme.colors.surface,
        }}
      />

      <Text style={{ fontSize: 16, marginBottom: 6, color: theme.colors.text }}>
        Price Per Seat (₹)
      </Text>
      <TextInput
        value={pricePerSeat}
        onChangeText={setPricePerSeat}
        placeholder="Enter price per seat"
        placeholderTextColor={theme.colors.placeholder}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: theme.colors.outline,
          padding: 10,
          borderRadius: 6,
          marginBottom: 25,
          color: theme.colors.text,
          backgroundColor: theme.colors.surface,
        }}
      />

      <TouchableOpacity
        onPress={handleCreateRide}
        style={{
          backgroundColor: theme.colors.primary,
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
          Create Ride
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
