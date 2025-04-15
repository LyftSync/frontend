import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import SearchBox from '../../components/map/SearchBox'
import Map from "../../components/map/Map"
const Home = () => {
  return (

    <View>

      <View style={{ width: '100%', height: '100%' }}>
        <Map />
      </View>

      <SafeAreaView
        style={{
          position: 'absolute',
          left: 10,
          right: 10,
          top: 10,
          bottom: 0,
        }}>
        <SearchBox />
      </SafeAreaView>
      {/* <View style={{ flex: 1 }}>
        <LocateMe />
      </View> */}
    </View>
  )
}

export default Home
