import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const MapStatusIndicator = ({
  isRouting,
  isFetchingDetails,
  routeErrorMsg,
  selectedPointsCount,
  isInspectingPlace,
  searchQuery,
}) => {
  let content = null;

  if (isRouting) {
    content = (
      <>
        <ActivityIndicator size="small" color="#0000ff" />
        <Text style={styles.statusText}>Calculating route...</Text>
      </>
    );
  } else if (isFetchingDetails) {
    content = (
      <>
        <ActivityIndicator size="small" color="#28a745" />
        <Text style={styles.statusText}>Getting place details...</Text>
      </>
    );
  } else if (routeErrorMsg) {
    content = (
      <Text style={[styles.statusText, styles.errorText]}>
        Route Error: {routeErrorMsg}
      </Text>
    );
  } else if (selectedPointsCount === 0 && !isInspectingPlace && !searchQuery) {
    content = (
      <Text style={styles.statusText}>Tap map or search for places</Text>
    );
  } else if (selectedPointsCount === 1) {
    content = <Text style={styles.statusText}>Select destination point</Text>;
  } else if (selectedPointsCount >= 2) {
    content = <Text style={styles.statusText}>Ready to request ride</Text>;
  } else if (isInspectingPlace) {
    content = <Text style={styles.statusText}>Inspecting location...</Text>;
  } else {
    content = <Text style={styles.statusText}> </Text>;
  }

  return <View style={styles.statusContainer}>{content}</View>;
};

const styles = StyleSheet.create({
  statusContainer: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 30,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statusText: {
    marginLeft: 5,
    fontSize: 13,
    color: "#555",
    textAlign: "center",
  },
  errorText: {
    color: "red",
  },
});

export default React.memo(MapStatusIndicator);
