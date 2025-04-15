
// import { StyleSheet, View, SafeAreaView } from 'react-native';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import useMapStore from '../../stores/mapStore'
//
// const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//
// const SearchBox = () => {
//   const setOrigin = useMapStore((state) => state.setOrigin);
//   const setDestination = useMapStore((state) => state.setDestination);
//
//   return (
//     <SafeAreaView className="h-full w-max justify-between bg-gray-50">
//       <View>
//         <GooglePlacesAutocomplete
//           placeholder="Kaha Jaoge"
//           styles={{
//             container: {
//               flex: 1,
//             },
//             textInput: {
//               fontSize: 18,
//             },
//           }}
//           returnKeyType="search"
//           nearbyPlacesAPI="GooglePlacesSearch"
//           fetchDetails={true}
//           onPress={(data, details = null) => {
//             setOrigin({
//               location: details.geometry.location,
//               description: data.description,
//             });
//             setDestination(null);
//             console.log(`the data is ${data}, details: ${details}`);
//           }}
//           minLength={3}
//           query={{
//             key: apiKey,
//             language: 'en',
//           }}
//           requestUrl={{
//             url: 'https://maps.googleapis.com/maps/api',
//             useOnPlatform: 'all',
//           }}
//           debounce={400}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };
////
// export default SearchBox;
import { View, Text } from 'react-native'
import React from 'react'

const SearchBox = () => {
  return (
    <View>
      <Text>SearchBox</Text>
    </View>
  )
}

export default SearchBox
