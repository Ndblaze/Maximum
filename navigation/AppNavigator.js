import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Admin } from "../config/env";
import navigation from "./rootNavigation";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import firebase from "firebase";
require("firebase/firestore");

import Profile from "../screens/Profile/Profile";
import HomeNavigator from "./HomeNavigator";
import Security from "../screens/Security/Security";
import ManagementNavigator from "./ManagementNavigator";

//notification functions
import { registerForPushNotificationsAsync } from "../manageNotifications/notification";

const Tap = createBottomTabNavigator();

export const AppNavigator = () => {
  const [notificationListner, setNoftificationListner] = useState();
  const [currentUser, setCurrentUser] = useState({});

  //set notification token to firebase
  const setNotificationToken = () => {
    const { uid } = firebase.auth().currentUser;
    registerForPushNotificationsAsync().then((token) => {
      const unsubscribe = firebase
        .firestore()
        .collection("notifications")
        .doc(uid)
        .set(
          {
            userID: uid,
            notificationToken: token,
            userCurrentScreen: "none",
          },
          { merge: true }
        );
      //  console.log(token);
      return unsubscribe;
    });
  };

  //function call when u receive a notification
  const handleNotification = (notification) => {
    //console.log(notification);
    setNoftificationListner({ notification: notification });
  };

  //function call when u tap on a notification
  const handleNotificationResponse = (response) => {
    const {
      notification: {
        request: {
          content: { data },
        },
      },
    } = response;

    if (data) {
      //if data navigate to the room page them navigate to the specified room
      navigation.navigate("Room");
      navigation.navigate("Messaging", {
        title: data.title,
        docID: data.docID,
      });

      Notifications.dismissNotificationAsync()
      
    }
  };

  useEffect(() => {
    setNotificationToken();

    Notifications.addNotificationReceivedListener(handleNotification);
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    const user = firebase.auth().currentUser;
    setCurrentUser(user);
  }, []);

  const getName = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    return routeName;
  };

  return (
    <Tap.Navigator initialRouteName="Home">
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
        name="Admin"
        component={ManagementNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="rule" size={size} color={color} />
          ),
          title: "Admin",
          headerShown: false,
          tabBarActiveTintColor: "#8CB8B9",
          tabBarItemStyle: {
            display: currentUser.email === Admin ? "block" : "none",
          },
        }}
      />
      <Tap.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
          title: "My Profile",
          headerStyle: {
            backgroundColor: "#8CB8B9",
          },
          tabBarActiveTintColor: "#8CB8B9",
          headerTintColor: "white",
        }}
      />
    </Tap.Navigator>
  );
};
