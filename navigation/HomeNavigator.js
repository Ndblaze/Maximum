import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Home/Home";
import Messaging from "../screens/Home/Messaging";

const Stack = createNativeStackNavigator();

export const HomeNavigator = () => (
  <Stack.Navigator mode="modal">
    <Stack.Screen
      name="Room"
      component={Home}
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen
      name="Messaging"
      component={Messaging}
      options={{
        headerBackTitleVisible: false,
      }}
    />
  </Stack.Navigator>
);

export default HomeNavigator;
