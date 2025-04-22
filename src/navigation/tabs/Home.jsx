import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import SearchBox from '../../components/map/SearchBox';
import Map from '../../components/map/Map';
import LocateMeButton from '../../components/map/LocateMeButton';
import BookingPopUp from '../../components/map/BookingPopUp';
import ModeSelectionScreen from '../../components/booking/ModeSelectionScreen';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();
  const [showBookingPopUp, setShowBookingPopUp] = useState(true);
  const [showModeSelect, setShowModeSelect] = useState(false);

  const toggleModeSelection = () => {
    setShowBookingPopUp(false);
    setShowModeSelect(true);
  };

  const handleSelectMode = () => {
    setShowModeSelect(false);
    setShowBookingPopUp(true); // Optionally bring back popup or navigate
    navigation.navigate('Confirmation'); // or any screen
  };

  return (
    <View style={{ flex: 1 }}>
      <Map />

      <SafeAreaView style={{ position: 'absolute', left: 10, right: 10, top: 10 }}>
        <SearchBox />
      </SafeAreaView>

      {showBookingPopUp && (
        <BookingPopUp onPress={toggleModeSelection} />
      )}

      <View style={{ position: 'absolute', bottom: 100, right: 25 }}>
        <LocateMeButton />
      </View>

      {showModeSelect && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
          }}
        >
          <ModeSelectionScreen onSelect={handleSelectMode} />
        </View>
      )}
    </View>
  );
};

export default Home;
