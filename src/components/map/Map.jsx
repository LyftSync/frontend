// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import useMapStore from '../../stores/mapStore'; // Import the map store
//
// const Map = () => {
//   const { origin, destination, setOrigin, setDestination } = useMapStore((state) => ({
//     origin: state.origin,
//     destination: state.destination,
//     setOrigin: state.setOrigin,
//     setDestination: state.setDestination,
//   }));
//
//   const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//
//   return (
//     <View style={styles.container}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         initialRegion={{
//           latitude: origin?.latitude || 22.756864562079098,
//           longitude: origin?.longitude || 75.90712507528681,
//           latitudeDelta: 0.005,
//           longitudeDelta: 0.005,
//         }}>
//         <Marker coordinate={origin || { latitude: 22.756864562079098, longitude: 75.90712507528681 }} />
//         <Marker coordinate={destination || { latitude: 22.767864562079098, longitude: 75.92712507528681 }} />
//         <MapViewDirections
//           origin={origin || { latitude: 22.756864562079098, longitude: 75.90712507528681 }}
//           destination={destination || { latitude: 22.767864562079098, longitude: 75.92712507528681 }}
//           apikey={apiKey}
//           strokeWidth={3}
//           strokeColor="hotpink"
//         />
//       </MapView>
//     </View>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });
//
// export default Map;
// import React from 'react'
// const Map = () => {
//
//   const { origin, destination, setOrigin, setDestination } = useMapStore((state) => ({
//     origin: state.origin,
//     destination: state.destination,
//     setOrigin: state.setOrigin,
//     setDestination: state.setDestination,
//   }));
//
//   const apiKey = process.env.GOOGLE_MAPS_API_KEY;
// console.log("from map")
//   return (
//
//     <View style={{flex:'1'}}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         initialRegion={{
//           latitude: origin?.latitude || 22.756864562079098,
//           longitude: origin?.longitude || 75.90712507528681,
//           latitudeDelta: 0.005,
//           longitudeDelta: 0.005,
//         }}/>
// </View>
//
//   )
//
// }
//
// export default Map

import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import useMapStore from '../../stores/mapStore'; // Adjust path if needed

const Map = () => {
  const origin = useMapStore((state) => state.origin);
  const destination = useMapStore((state) => state.destination);
  const setOrigin = useMapStore((state) => state.setOrigin);
  const setDestination = useMapStore((state) => state.setDestination);

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

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
        <Marker coordinate={origin || fallbackOrigin} />
        <Marker coordinate={destination || fallbackDestination} />

        {origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={apiKey}
            strokeWidth={3}
            strokeColor="hotpink"
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
