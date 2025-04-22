import React,{useRef, useEffect} from 'react';

import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import useMapStore from '../../stores/mapStore'; // Adjust path if needed
import { GOOGLE_MAPS_API_KEY } from '@env';

const Map = () => {
  const origin = useMapStore((state) => state.origin);
  const destination = useMapStore((state) => state.destination);
  const apikey = GOOGLE_MAPS_API_KEY
  const fallbackOrigin = {
    location: { lat: 22.7196, lng: 75.8577 },
    description: 'Default Origin',
  };
	const mapRef = useRef(null)

	useEffect(()=>{
		if(!origin && !destination) return null

		mapRef.current.fitToSuppliedMarkers(['origin','destination'],{

      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
		})

		
	},[origin,destination])



  // Transform origin and destination to MapView-compatible format
  const originCoords = origin?.location?.lat && origin?.location?.lng
    ? { latitude: origin.location.lat, longitude: origin.location.lng }
    : { latitude: fallbackOrigin.location.lat, longitude: fallbackOrigin.location.lng };

  const destinationCoords = destination?.location?.lat && destination?.location?.lng
    ? { latitude: destination.location.lat, longitude: destination.location.lng }
    : null;

  // Determine if we have valid coordinates for rendering
  const hasValidOrigin = !!origin?.location?.lat && !!origin?.location?.lng;
  const hasValidDestination = !!destination?.location?.lat && !!destination?.location?.lng;

  return (
    <View style={styles.container}>
      <MapView
		ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: originCoords.latitude,
          longitude: originCoords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        // region={hasValidOrigin ? {
        //   latitude: originCoords.latitude,
        //   longitude: originCoords.longitude,
        //   latitudeDelta: 0.005,
        //   longitudeDelta: 0.005,
        // } : undefined}
      >
        {/* Origin Marker */}
        {hasValidOrigin && (
          <Marker
            coordinate={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            title="Origin"
            description={origin.description || 'Starting Point'}
            pinColor="red"
			identifier="origin"
          />
        )}

        {/* Destination Marker */}
        {hasValidDestination && (
          <Marker
            coordinate={{
              latitude: destination.location.lat,
              longitude: destination.location.lng,
            }}
            title="Destination"
            description={destination.description || 'End Point'}
            pinColor="blue"
			identifier="destination"
          />
        )}

        {/* Route between origin and destination */}
        {hasValidOrigin && hasValidDestination && (
          <MapViewDirections
            origin={originCoords}
            destination={destinationCoords}
            apikey={apikey}
            strokeWidth={3}
            strokeColor="blue"
            mode="DRIVING"
            onError={(error) => console.error('MapViewDirections Error:', error)}
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
