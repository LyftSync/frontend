import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import tw from 'tailwind-react-native-classnames'
import useMapStore from '../../stores/mapStore'

const BookingPopUp = ({ onPress }) => {
  const origin = useMapStore((state) => state.origin)
  const destination = useMapStore((state) => state.destination)

  return (
    <View style={tw`absolute bottom-40 left-5 right-5 items-center`}>
      <TouchableOpacity
        onPress={onPress}
        style={tw`bg-black px-6 py-4 rounded-xl flex-row items-center`}
      >
        <Ionicons name="car-sport-outline" size={22} color="white" style={tw`mr-2`} />
        <Text style={tw`text-white text-base font-semibold`}>Confirm Mode</Text>
      </TouchableOpacity>
    </View>
  )
}

export default BookingPopUp
