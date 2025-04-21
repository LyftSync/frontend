import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { icons } from '../../../assets/assestsIndex';

const { height } = Dimensions.get('window');
const panelHeight = height / 3;

const ModeSelectionScreen = ({ navigation }) => {

  return (
    <View
      style={[
        tw` relative bottom-60 m-2 bg-black px-5 pt-5 rounded-2xl`,


				
        { height: panelHeight },
      ]}
    >
      <Text style={[tw`text-xl font-semibold text-center mb-5`,{color:'#fff'}]}>
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
