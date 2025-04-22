import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabLayout from './navigation/tabs/TabLayout';
import ModeSelectScreen from './components/booking/ModeSelectionScreen';
import ConfirmationScreen from './components/booking/ConfirmationScreen';

const Stack = createNativeStackNavigator();

export default function HomeMapTab() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabLayout} />
      <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
    </Stack.Navigator>
  );
}
