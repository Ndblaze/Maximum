import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./navigation/AuthNavigator";
import { AppNavigator } from "./navigation/AppNavigator";
import navigationTheme from "./navigation/navigationTheme";

import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCGNUVymtspSY1cIx0diKE3_Ow9ysBfb-U",
  authDomain: "max-chat-app-bbd6f.firebaseapp.com",
  projectId: "max-chat-app-bbd6f",
  storageBucket: "max-chat-app-bbd6f.appspot.com",
  messagingSenderId: "277610712584",
  appId: "1:277610712584:web:ba72755db7809885e3cbbd",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  const [user, setUser] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(true);
        // console.log("innnnnn");
      } else {
        setUser(false);
        // console.log("outttt");
      }
    });
  }, []);

  return (
    <NavigationContainer theme={navigationTheme}>
      {/* <AuthNavigator /> */}
      {user ? <AppNavigator /> : <AuthNavigator />}
      {/* <AppNavigator /> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
