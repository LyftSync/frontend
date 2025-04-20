import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import useMapStore from '../../stores/mapStore';
import tw from 'tailwind-react-native-classnames';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect, useRef } from 'react';

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

const SearchBox = () => {
  const setOrigin = useMapStore((state) => state.setOrigin);
  const setDestination = useMapStore((state) => state.setDestination);
  const origin = useMapStore((state) => state.origin);
  const autocompleteRef = useRef(null); // Ref to control GooglePlacesAutocomplete

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, { duration: 300 }),
    transform: [{ translateY: withTiming(translateY.value, { duration: 300 }) }],
  }));

  useEffect(() => {
    if (origin?.location?.lat && origin?.location?.lng && origin?.description) {
      // Update autocomplete input with origin description
      autocompleteRef.current?.setAddressText(origin.description);
      opacity.value = 1; // Show destination input
      translateY.value = 0; // Slide to original position
    } else {
      // Clear autocomplete input when origin is null
      autocompleteRef.current?.setAddressText('');
      opacity.value = 0; // Hide destination input
      translateY.value = 20; // Slide down
    }
  }, [origin]);

  return (
    <SafeAreaView style={[tw`bg-black rounded-2xl`, styles.container]}>
      <View style={styles.searchWrapper}>
        <GooglePlacesAutocomplete
          ref={autocompleteRef}
          placeholder="Kaha Jaoge?"
          styles={searchStyles}
          returnKeyType="search"
          nearbyPlacesAPI="GooglePlacesSearch"
          fetchDetails={true}
          onPress={(data, details = null) => {
            if (details?.geometry?.location) {
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              });
              setDestination(null);
            }
          }}
          minLength={3}
          query={{
            key: apiKey,
            language: 'en',
          }}
          requestUrl={{
            url: 'https://maps.googleapis.com/maps/api',
            useOnPlatform: 'all',
          }}
          debounce={2000}
        />
      </View>
      {origin && (
        <Animated.View style={[animatedStyles, styles.searchWrapper]}>
          <GooglePlacesAutocomplete
            placeholder="Kaha Tak Jaoge?"
            styles={searchStyles}
            returnKeyType="search"
            nearbyPlacesAPI="GooglePlacesSearch"
            fetchDetails={true}
            onPress={(data, details = null) => {
              if (details?.geometry?.location) {
                setDestination({
                  location: details.geometry.location,
                  description: data.description,
                });
              }
            }}
            minLength={3}
            query={{
              key: apiKey,
              language: 'en',
            }}
            requestUrl={{
              url: 'https://maps.googleapis.com/maps/api',
              useOnPlatform: 'all',
            }}
            debounce={2000}
          />
        </Animated.View>
      )}
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
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
});

export default SearchBox;
