
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './Home'
import Wallet from './Wallet'
import RideHistory from './RideHistory'
import Profile from './Profile'
import { Image, View } from 'react-native'
import { icons } from '../../../assets/assestsIndex' 
import HomeScreen from '../../screens/HomeScreen'

const Tab = createBottomTabNavigator()

const TabIcon = ({ source, focused }) => (
  <View style={{ padding: 10, backgroundColor: focused ? '#444' : 'transparent', borderRadius: 999 }}>
    <Image source={source} style={{ width: 24, height: 24, tintColor: 'white' }} resizeMode="contain" />
  </View>
)

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#333',
          height: 80,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          marginHorizontal: 20,
          marginBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon source={icons.home} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon source={icons.wallet} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="RideHistory"
        component={RideHistory}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon source={icons.list} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon source={icons.profile} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  )
}
