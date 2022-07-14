import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Auth/Login'
import Register from '../screens/Auth/Register'
import NumberVerification from '../screens/Auth/NumberVerification'

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="NumberVerification" component={NumberVerification} />
    </Stack.Navigator>
  );
    
  export default AuthNavigator;