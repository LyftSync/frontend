// import React from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
//
// import LoginScreen from "../screens/LoginScreen";
// import RegisterScreen from "../screens/RegisterScreen";
//
// const Stack = createNativeStackNavigator();
//
// export default function AuthNavigator() {
//   return (
//     <Stack.Navigator
//       independent={true}
// 	initialRouteName="Login"
//       screenOptions={{ headerShown: false }}
//     >
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Register" component={RegisterScreen} />
//     </Stack.Navigator>
//   );
// }
import { View, Text } from 'react-native'
const AuthNavigator = () => {
  return (
    <View>
      <Text>AuthNavigator</Text>
    </View>
  )
}

export default AuthNavigator
