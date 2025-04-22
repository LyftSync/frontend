import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, Pressable } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { icons } from '../../../assets/assestsIndex';
import { X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ Import this

const { height } = Dimensions.get('window');
const panelHeight = height / 3;

const ModeSelectionScreen = ({ onSelect }) => {
  const navigation = useNavigation(); // ✅ Use this instead of props.navigation

  const handleSelect = (mode) => {
    onSelect?.(mode);
  };

  return (
    <View
      style={[
        tw`m-2 px-5 pt-5 rounded-2xl`,
        {
          height: panelHeight,
          backgroundColor: 'rgba(0,0,0,0.9)',
        },
      ]}
    >
      <Pressable
        onPress={() => navigation.goBack()} // ✅ no error now
        style={tw`absolute top-2 right-4 z-10`}
      >
        <X size={25} color="white" />
      </Pressable>

      <Text style={[tw`text-xl font-semibold text-center mb-5`, { color: '#fff' }]}>
        Choose Your Ride Mode
      </Text>

      <TouchableOpacity
        style={tw`bg-gray-100 rounded-xl p-4 mb-4 flex-row items-center`}
        onPress={() => handleSelect('Ride')}
      >
        <Image
          source={icons.bottomleft}
          style={{ width: 60, height: 60, marginRight: 20 }}
          resizeMode="contain"
        />
        <Text style={tw`text-lg font-medium`}>Ride</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-gray-100 rounded-xl p-4 flex-row items-center`}
        onPress={() => handleSelect('Share')}
      >
        <Image
          source={icons.bottomright}
          style={{ width: 60, height: 60, marginRight: 20 }}
          resizeMode="contain"
        />
        <Text style={tw`text-lg font-medium`}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModeSelectionScreen;
