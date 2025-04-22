import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Bug } from 'lucide-react-native';
import tw from 'tailwind-react-native-classnames';
import useAuthStore from '../../stores/authStore'; 

const Profile = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout(); 
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={[tw`flex-1 justify-center items-center bg-white`]}>
      <Text style={tw`text-2xl font-bold mb-4`}>
        Username: {user?.username || 'N/A'}
      </Text>
      <Text style={tw`text-xl mb-6`}>
        Phone: {user?.phoneNumber || 'N/A'}
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        style={[tw`flex-row items-center bg-black px-5 py-3 rounded-2xl`]}
      >
        <Bug color="white" size={20} style={tw`mr-2`} />
        <Text style={tw`text-white text-lg`}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
