import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import DateTimeSelector from "../../components/DateTimeSelector";

export default function CreateRideScreen() {
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

    // Handle ride submission logic here
    console.log("Ride Created:", rideDetails);
    Alert.alert("Success", "Ride created successfully!");
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Create Ride
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 6 }}>Pickup Location</Text>
      <TextInput
        value={pickupLocation}
        onChangeText={setPickupLocation}
        placeholder="Enter pickup location"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 6,
          marginBottom: 15,
        }}
      />

      <Text style={{ fontSize: 16, marginBottom: 6 }}>Destination</Text>
      <TextInput
        value={destination}
        onChangeText={setDestination}
        placeholder="Enter destination"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 6,
          marginBottom: 15,
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

      <Text style={{ fontSize: 16, marginBottom: 6 }}>Seats Available</Text>
      <TextInput
        value={seatsAvailable}
        onChangeText={setSeatsAvailable}
        placeholder="Enter number of seats"
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 6,
          marginBottom: 15,
        }}
      />

      <Text style={{ fontSize: 16, marginBottom: 6 }}>Price Per Seat (₹)</Text>
      <TextInput
        value={pricePerSeat}
        onChangeText={setPricePerSeat}
        placeholder="Enter price per seat"
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 6,
          marginBottom: 25,
        }}
      />

      <TouchableOpacity
        onPress={handleCreateRide}
        style={{
          backgroundColor: "#007bff",
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
