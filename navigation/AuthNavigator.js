import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Auth/Login'
import Register from '../screens/Auth/Register'
import ForgotPassword from '../screens/Auth/ForgotPassword'
import LinkSent from '../screens/Auth/LinkSent'

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}> 
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="LinkSent" component={LinkSent} />
    </Stack.Navigator>
  );
    
  export default AuthNavigator;