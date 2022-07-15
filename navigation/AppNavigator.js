import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

import Profile from "../screens/Profile/Profile";
import HomeNavigator from "./HomeNavigator";
import Security from "../screens/Security/Security";

const Tap = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <Tap.Navigator>
      <Tap.Screen
        name="Home"
        component={HomeNavigator}
        options={({ route }) => ({
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarActiveTintColor: "#8CB8B9",
          headerShown: false,
        })}
      />
      <Tap.Screen
        name="Security"
        component={Security}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="security" size={size} color={color} />
          ),
          title: "Security Tips",
          headerStyle: {
            backgroundColor: "#8CB8B9",
          },
          tabBarActiveTintColor: "#8CB8B9",
          headerTintColor: "white",
        }}
      />
      <Tap.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
          tabBarActiveTintColor: "#8CB8B9",
          title: "My Profile",
        }}
      />
    </Tap.Navigator>
  );
};
