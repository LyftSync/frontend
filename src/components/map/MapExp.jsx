// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { MapView, Marker, Polyline } from 'expo-maps';
// import useMapStore from '../../stores/mapStore'; // Import your Zustand store
//
// const Map = () => {
//   const { origin, destination } = useMapStore((state) => ({
//     origin: state.origin,
//     destination: state.destination,
//   }));
//
//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: origin?.latitude || 22.756864562079098,
//           longitude: origin?.longitude || 75.90712507528681,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//       >
//         <Marker coordinate={origin || { latitude: 22.756864562079098, longitude: 75.90712507528681 }} />
//         <Marker coordinate={destination || { latitude: 22.767864562079098, longitude: 75.92712507528681 }} />
//
//         {/* Example static Polyline; for real directions, you need Google Directions API fetch logic */}
//         <Polyline
//           coordinates={[
//             origin || { latitude: 22.756864562079098, longitude: 75.90712507528681 },
//             destination || { latitude: 22.767864562079098, longitude: 75.92712507528681 }
//           ]}
//           strokeColor="hotpink"
//           strokeWidth={3}
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
//     flex: 1,
//   },
// });
//
// export default Map;
