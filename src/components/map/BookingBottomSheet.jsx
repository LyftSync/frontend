
import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

const ModeSelectScreen = () => (
  <View style={{ padding: 20 }}>
    <Text style={{ fontSize: 18 }}>Choose Your Ride Mode</Text>
  </View>
)

const ConfirmationScreen = () => (
  <View style={{ padding: 20 }}>
    <Text style={{ fontSize: 18 }}>Confirm Booking</Text>
  </View>
)

const BookingBottomSheet = React.forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ['50%', '80%'], [])

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
			<Text style={{fontSize:30}}>shettttttttt</Text>
      {/* <NavigationContainer independent={true}> */}
      {/*   <Stack.Navigator screenOptions={{ headerShown: false }}> */}
      {/*     <Stack.Screen name="ModeSelect" component={ModeSelectScreen} /> */}
      {/*     <Stack.Screen name="Confirmation" component={ConfirmationScreen} /> */}
      {/*   </Stack.Navigator> */}
      {/* </NavigationContainer> */}
    </BottomSheet>
  )
})

export default BookingBottomSheet
