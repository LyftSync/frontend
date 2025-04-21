import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const ModeSelectScreen = ({ navigation }) => (
  <View style={styles.screen}>
    <Text style={styles.title}>Choose Your Ride Modee</Text>
    <Button
      title="Continue"
      onPress={() => navigation.navigate('Confirmation')}
    />
  </View>
);

const ConfirmationScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Confirm Booking</Text>
  </View>
);

const BookingFlow = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default BookingFlow;
