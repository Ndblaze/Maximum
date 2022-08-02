import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Security from "../screens/Security/Security";
import SecurityDetails from "../screens/Security/SecurityDetails";

const Stack = createNativeStackNavigator();

export const SecurityNavigator = () => {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="SecurityHome"
        component={Security}
        options={({ route }) => {
          return {
            title: "Security and Privacy",
            headerStyle: {
              backgroundColor: "#8CB8B9",
            },
            headerTintColor: "white",
          };
        }}
      />
      <Stack.Screen
        name="SecurityDetails"
        component={SecurityDetails}
        options={({ route }) => {
          return {
            headerBackTitleVisible: false,
            title: "Security Details",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          };
        }}
      />
    </Stack.Navigator>
  );
};
export default SecurityNavigator;
