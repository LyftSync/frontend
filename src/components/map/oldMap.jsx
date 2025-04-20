import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import useMapStore from '../../stores/mapStore'; // Adjust path if needed

import {  

GOOGLE_MAPS_API_KEY
} from '@env';
const Map = () => {
  const origin = useMapStore((state) => state.origin);
  const destination = useMapStore((state) => state.destination);
  const setOrigin = useMapStore((state) => state.setOrigin);
  const setDestination = useMapStore((state) => state.setDestination);

  const apiKey = GOOGLE_MAPS_API_KEY;

  const fallbackOrigin = { latitude: 22.756864562079098, longitude: 75.90712507528681 };
  const fallbackDestination = { latitude: 22.767864562079098, longitude: 75.92712507528681 };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: origin?.latitude || fallbackOrigin.latitude,
          longitude: origin?.longitude || fallbackOrigin.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {/* <Marker coordinate={origin || fallbackOrigin} /> */}
        {/* <Marker coordinate={destination || fallbackDestination} /> */}
        {/**/}
        {origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={apiKey}
            strokeWidth={3}
            strokeColor="#10e3c0"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
