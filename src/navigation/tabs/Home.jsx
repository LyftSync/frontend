import React, { useRef, useState } from "react";
import { View, SafeAreaView, Button, StyleSheet } from "react-native";
import SearchBox from "../../components/map/SearchBox";
import Map from "../../components/map/Map";
import LocateMeButton from "../../components/map/LocateMeButton";
// import BookingPopUp from '../../components/map/BookingPopUp' // Original, might be replaced by direct search button
// import BookingBottomSheet from '../../components/map/BookingBottomSheet' // Original, might be used for ride options
import useMapStore from "../../stores/mapStore";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

const Home = () => {
  const navigation = useNavigation();
  const { origin, destination } = useMapStore();
  // const sheetRef = useRef(null)

  // const openBottomSheet = () => {
  //   sheetRef.current?.expand()
  // }

  const handleSearchRides = () => {
    if (
      !origin ||
      !origin.location ||
      !origin.location.lat ||
      !origin.location.lng
    ) {
      showMessage({
        message: "Please set an origin location.",
        type: "warning",
      });
      return;
    }
    // Destination is optional for initial search, backend might list all rides from origin
    // Or we can make destination mandatory here. For now, let's make it optional.

    const searchParams = {
      fromLat: origin.location.lat,
      fromLng: origin.location.lng,
      seats: 1, // Default seats
      departureAfter: new Date().toISOString(), // Rides departing from now
    };
    if (
      destination &&
      destination.location &&
      destination.location.lat &&
      destination.location.lng
    ) {
      searchParams.toLat = destination.location.lat;
      searchParams.toLng = destination.location.lng;
    }

    navigation.navigate("SearchRidesResults", { searchParams });
  };

  return (
    <View style={{ flex: 1 }}>
      <Map />

      <SafeAreaView style={styles.searchBoxContainer}>
        <SearchBox />
      </SafeAreaView>

      {/* Replace BookingPopUp with a clear "Find Rides" button if origin is set */}
      {origin && (
        <View style={styles.findRideButtonContainer}>
          <Button
            title={
              destination
                ? "Find Rides (Origin & Dest. Set)"
                : "Find Rides from Origin"
            }
            onPress={handleSearchRides}
            color="#007AFF"
          />
        </View>
      )}

      <View style={styles.locateMeButtonContainer}>
        <LocateMeButton />
      </View>

      {/* <BookingBottomSheet ref={sheetRef} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBoxContainer: {
    position: "absolute",
    left: 10,
    right: 10,
    top: 10, // Adjust based on status bar height or safe area insets
    zIndex: 1, // Ensure it's above the map
  },
  findRideButtonContainer: {
    position: "absolute",
    bottom: 100, // Adjust to be above tab bar
    left: 20,
    right: 20,
    zIndex: 1,
  },
  locateMeButtonContainer: {
    position: "absolute",
    bottom: 100, // Adjust to be above tab bar if findRide button isn't shown, or position elsewhere
    right: 20,
    zIndex: 1,
  },
});

export default Home;
