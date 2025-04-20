import React, { useRef } from 'react'
import { View, SafeAreaView } from 'react-native'
import SearchBox from '../../components/map/SearchBox'
import Map from '../../components/map/Map'
import LocateMeButton from '../../components/map/LocateMeButton'
import BookingPopUp from '../../components/map/BookingPopUp'
import BookingBottomSheet from '../../components/map/BookingBottomSheet'

const Home = () => {
  const sheetRef = useRef(null)

  const openBottomSheet = () => {
    sheetRef.current?.expand()
  }

  return (
    <View style={{ flex: 1 }}>
      <Map />

      <SafeAreaView style={{ position: 'absolute', left: 10, right: 10, top: 10 }}>
        <SearchBox />
      </SafeAreaView>

      <BookingPopUp onPress={openBottomSheet} />

      <View style={{ position: 'absolute', bottom: 100, right: 25 }}>
        <LocateMeButton />
      </View>

      <BookingBottomSheet ref={sheetRef} />
    </View>
  )
}

export default Home
