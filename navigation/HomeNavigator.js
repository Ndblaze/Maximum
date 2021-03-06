import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Home/Home";
import Messaging from "../screens/Home/Messaging";

const Stack = createNativeStackNavigator();

export const HomeNavigator = () => {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="Room"
        component={Home}
        options={({ route }) => {
          return {
            headerShown: false,
          };
        }}
      />
      <Stack.Screen
        name="Messaging"
        component={Messaging}
        options={({ route }) => {
          return {
            headerBackTitleVisible: false,
            title: route.params.title,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          };
        }}
      />
    </Stack.Navigator>
  );
};
export default HomeNavigator;
