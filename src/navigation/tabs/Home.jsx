import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import SearchBox from '../../components/map/SearchBox';
import Map from '../../components/map/Map';
import LocateMeButton from '../../components/map/LocateMeButton';
import BookingPopUp from '../../components/map/BookingPopUp';
import ModeSelectionScreen from '../../components/booking/ModeSelectionScreen';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [showModeSelect, setShowModeSelect] = useState(false);
  const navigation = useNavigation();

  const handleSelectMode = () => {
    setShowModeSelect(false);
    navigation.navigate('ModeSelectionScreen');
  };

  return (
    <View style={{ flex: 1 }}>
      <Map />

      <SafeAreaView style={{ position: 'absolute', left: 10, right: 10, top: 10 }}>
        <SearchBox />
      </SafeAreaView>

      <BookingPopUp onPress={() => setShowModeSelect(true)} />

      <View style={{ position: 'absolute', bottom: 100, right: 25 }}>
        <LocateMeButton />
      </View>

      {showModeSelect && <ModeSelectionScreen onSelect={handleSelectMode} />}
    </View>
  );
};

export default Home;
