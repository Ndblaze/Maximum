import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Home/Home";
import Messaging from "../screens/Home/Messaging";

const Stack = createNativeStackNavigator();

export const HomeNavigator = ({ setMessagingUI }) => {
  //remove and seet tab Bottoms
  const checkName = (name) => {
    if (name === "Messaging") {
      setMessagingUI(true);
      return;
    }
    setMessagingUI(false);
  };

  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="Room"
        component={Home}
        options={({ route }) => {
          checkName(route.name);
          return {
            headerShown: false,
          };
        }}
      />
      <Stack.Screen
        name="Messaging"
        component={Messaging}
        options={({ route }) => {
          checkName(route.name);
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
