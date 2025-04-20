import React, { useState } from 'react';
import { TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import useMapStore from '../../stores/mapStore';
import tw from 'tailwind-react-native-classnames';

const LocateMeButton = () => {
  const setOrigin = useMapStore((state) => state.setOrigin);
  const setDestination = useMapStore((state) => state.setDestination);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleLocateMe = async () => {
    if (isLoading) return; // Prevent multiple simultaneous requests
    setIsLoading(true); // Set loading state

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        setIsLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // Optional: Improve accuracy
      });
      const { latitude, longitude } = location.coords;

      let address = await Location.reverseGeocodeAsync({ latitude, longitude });
      const description = address[0]
        ? `${address[0].name || ''}, ${address[0].city || ''}, ${address[0].country || ''}`
        : 'Current Location';

      setOrigin({
        location: { lat: latitude, lng: longitude },
        description,
      });
      setDestination(null);
      console.log(`User location set as origin: ${description}`);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to fetch your location. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLocateMe}
      style={[tw`bg-black p-3 rounded-full`, styles.shadow]}
      disabled={isLoading} // Disable button during loading
    >
      {isLoading ? (
        <ActivityIndicator size={30} color="#10e3c9" /> // Show loading spinner
      ) : (
        <Ionicons name="locate" size={30} color="#10e3c9" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default LocateMeButton;
