import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";

const RideRequestButton = ({
  mode,
  isVisible,
  isRequesting,
  isOffering,
  isRouteCalculating,
  requestError,
  offerError,
  onPress,
}) => {
  if (!isVisible) {
    return null;
  }

  const isLoading = isRequesting || isOffering;
  const error = mode === "HIKER" ? requestError : offerError;
  const title = isLoading
    ? mode === "HIKER"
      ? "Requesting..."
      : "Offering..."
    : mode === "HIKER"
      ? "Request Ride"
      : "Offer Ride";

  const isDisabled = isLoading || isRouteCalculating;

  return (
    <View style={styles.rideButtonContainer}>
      <Button
        title={title}
        onPress={onPress}
        disabled={isDisabled}
        color={mode === "HIKER" ? "#007AFF" : "#34C759"}
      />
      {error && !isLoading && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  rideButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 5,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 13,
    marginTop: 5,
  },
});

export default React.memo(RideRequestButton);
