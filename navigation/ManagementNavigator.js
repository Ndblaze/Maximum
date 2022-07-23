import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Management from "../screens/Admin/Management";
import NewTopic from "../screens/Admin/NewTopic";
import SecurityTips from "../screens/Admin/SecurityTips";
import OldTopic from "../screens/Admin/OldTopic";

const Stack = createNativeStackNavigator();

const ManagementNavigator = () => {
  return (
    <Stack.Navigator mode="modal" initialRouteName="AdminManagement">
      <Stack.Screen
        name="AdminManagement"
        component={Management}
        options={({ route }) => {
          return {
            title: "Admin Management",
            headerStyle: {
              backgroundColor: "#8CB8B9",
            },
            headerTintColor: "white",
          };
        }}
      />
      <Stack.Screen
        name="NewTopics"
        component={NewTopic}
        options={({ route }) => {
          return {
            title: "New Topics",
            headerStyle: {
              backgroundColor: "#8CB8B9",
            },
            headerTintColor: "white",
          };
        }}
      />
      <Stack.Screen
        name="OldTopics"
        component={OldTopic}
        options={({ route }) => {
          return {
            title: "Available Topics",
            headerStyle: {
              backgroundColor: "#8CB8B9",
            },
            headerTintColor: "white",
          };
        }}
      />
      <Stack.Screen
        name="SecurityTips"
        component={SecurityTips}
        options={({ route }) => {
          return {
            title: "Security Tips",
            headerStyle: {
              backgroundColor: "#8CB8B9",
            },
            headerTintColor: "white",
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default ManagementNavigator;
