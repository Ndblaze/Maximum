import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import ScreenLayout from "../../components/common/ScreenLayout";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

//use firbase hooks
import { updateCurrentScreen } from "../../firebase/useFirebase";

const Security = () => {
  const focused = useIsFocused();

  useEffect(() => {
    const { uid } = firebase.auth().currentUser;
    if (focused) {
      updateCurrentScreen(uid, "Security");
    }
  }, [focused]);
  return (
    <ScreenLayout>
      <Text>Security</Text>
    </ScreenLayout>
  );
};

export default Security;

const styles = StyleSheet.create({});
