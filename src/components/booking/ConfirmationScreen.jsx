import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import { CheckCircle2, Home } from 'lucide-react-native';

const ConfirmationScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={tw`flex-1 justify-center items-center bg-white px-5`}>
      <CheckCircle2 size={80} color="#10B981" style={tw`mb-6`} />
      <Text style={tw`text-2xl font-bold text-center mb-2`}>
        Ride Confirmed!
      </Text>
      <Text style={tw`text-lg text-gray-600 text-center mb-8`}>
        Testing Ride, Fetching Rides, List of Available Rides
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Tabs')}
        style={tw`flex-row items-center bg-black px-6 py-3 rounded-full`}
      >
        <Home color="white" size={20} style={tw`mr-2`} />
        <Text style={tw`text-white text-lg`}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmationScreen;
