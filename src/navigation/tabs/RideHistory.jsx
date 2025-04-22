import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../stores/authStore'; // adjust path as needed

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const { user } = useAuthStore();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRides = async () => {
      const fetchedRides = [
        { id: '1', date: '2025-04-20', status: 'Completed', distance: '15 km', price: '$10' },
        { id: '2', date: '2025-04-18', status: 'Completed', distance: '10 km', price: '$7' },
        { id: '3', date: '2025-04-15', status: 'Cancelled', distance: '12 km', price: '$8' },
      ];
      setRides(fetchedRides);
    };

    fetchRides();
  }, []);

  const renderItem = ({ item }) => (
    <View style={tw`bg-white p-4 mb-4 rounded-lg shadow-md`}>
      <Text style={tw`text-lg font-semibold`}>Ride Date: {item.date}</Text>
      <Text style={tw`text-md text-gray-600`}>Status: {item.status}</Text>
      <Text style={tw`text-md text-gray-600`}>Distance: {item.distance}</Text>
      <Text style={tw`text-md text-gray-600`}>Price: {item.price}</Text>

      <TouchableOpacity
        style={tw`mt-4 bg-black px-6 py-2 rounded-2xl`}
        onPress={() => navigation.navigate('RideDetails', { rideId: item.id })}
      >
        <Text style={tw`text-white text-lg`}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-gray-100 px-4 py-6`}>
      <Text style={tw`text-2xl font-bold text-center mb-6`}>Ride History, just a test page</Text>

      <FlatList
        data={rides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default RideHistory;
