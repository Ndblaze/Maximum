import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import firebase from "firebase";
require("firebase/firestore");

import Profile from "../screens/Profile/Profile";
import HomeNavigator from "./HomeNavigator";
import Security from "../screens/Security/Security";

//notification functions
import {
  registerForPushNotificationsAsync,
  handleNotificationResponse,
} from "../manageNotifications/notification";

const Tap = createBottomTabNavigator();

export const AppNavigator = () => {
  const [notificationListner, setNoftificationListner] = useState();
  //set notification token to firebase
  const setNotificationToken = () => {
    const { uid } = firebase.auth().currentUser;
    registerForPushNotificationsAsync().then((token) => {
      firebase.firestore().collection("notifications").doc(uid).set(
        {
          userID: uid,
          notificationToken: token,
        },
        { merge: true }
      );
      //  console.log(token);
    });
  };

  //function call when u receive a notification
  const handleNotification = (notification) => {
    //console.log(notification);
    setNoftificationListner({ notification: notification });
  };

  useEffect(() => {
    setNotificationToken();

    Notifications.addNotificationReceivedListener(handleNotification);
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );
  }, []);

  const getName = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    return routeName;
  };

  return (
    <Tap.Navigator>
      <Tap.Screen
        name="Home"
        component={HomeNavigator}
        options={({ route }) => ({
          tabBarStyle: {
            display: getName(route) === "Messaging" && "none",
          },
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
