import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import Listing from "../../components/common/Listing";
import ScreenLayout from "../../components/common/ScreenLayout";
import firebase from "firebase";
require("firebase/firestore");

//use firbase hooks
import { updateCurrentScreen } from "../../firebase/useFirebase";
import { getSecurityTips } from "../../firebase/useFirebaseSecurity";

const Security = () => {
  const focused = useIsFocused();
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const { uid } = firebase.auth().currentUser;
    if (focused) {
      updateCurrentScreen(uid, "Security");
    }
  }, [focused]);

  useEffect(() => {
    getTips();
  }, []);

  const getTips = async () => {
    //console.log(await getSecurityTips());
    const data = await getSecurityTips();
    setTips(data);
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        {tips &&
          tips.map((list, index) => (
            <Listing
              key={index}
              name={list.title}
              detail={list}
              screen={"SecurityDetails"}
            />
          ))}
      </View>
    </ScreenLayout>
  );
};

export default Security;

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
  },
});
