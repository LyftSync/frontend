import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import useMapStore from '../../stores/mapStore';
import tw from 'tailwind-react-native-classnames';
import { useEffect, useRef } from 'react';
import 'react-native-get-random-values'
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

const SearchBox = () => {
  if (!apiKey) {
    console.error('Google Maps API key is not set');
    return <Text style={styles.errorText}>API Key Missing</Text>;
  }

  // Access store with fallback
  const store = useMapStore();
  if (!store || !store.setOrigin || !store.setDestination) {
    console.error('Map store is not initialized');
    return <Text style={styles.errorText}>Map Store Error</Text>;
  }

  const { setOrigin, setDestination, origin } = store;
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (origin?.location?.lat && origin?.location?.lng && origin?.description) {
      autocompleteRef.current?.setAddressText(origin.description);
    } else {
      autocompleteRef.current?.setAddressText('');
    }
  }, [origin]);

  return (
    <SafeAreaView style={[tw`bg-black rounded-2xl`, styles.container]}>
      <View style={styles.searchWrapper}>
<GooglePlacesAutocomplete
  ref={autocompleteRef}
  placeholder="Kaha Jaoge?"
  onPress={(data, details = null) => {
    console.log('Data:', data, 'Details:', details);
  }}
  query={{
    key: apiKey,
    language: 'en',
  }}
  onFail={(error) => console.error('GooglePlacesAutocomplete error:', error)}
/>
      </View>
    </SafeAreaView>
  );
};

const searchStyles = {
  container: {
    flex: 0,
    width: '100%',
    height: '45%',
  },
  textInput: {
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listView: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 7,
  },
  searchWrapper: {
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchBox;
