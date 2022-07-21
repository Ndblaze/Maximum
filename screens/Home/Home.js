import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Constants from "expo-constants";
import { useIsFocused } from "@react-navigation/native";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

import Sections from "../../components/common/Sections";
import { updateCurrentScreen } from "../../firebase/useFirebase";

const Home = ({ navigation }) => {
  //loading data for
  const [loading, setLoading] = useState(true);
  //Admin room list details
  const [adminRoomList, setAdminRoomList] = useState({ title: "Mentions" });
  const [mattersRoomList, setMattersRoomList] = useState({
    title: "Matters-on-ground",
  });
  const [hotSpotRoomList, setHotSpotRoomList] = useState({
    title: "Hot-spots",
  });

  const focused = useIsFocused();

  useEffect(() => {
    setLoading(true);
    const db = firebase.firestore();
    const unsubscribe = db.collection("chats").onSnapshot((querySnapshot) => {
      let admin = { title: "", chatRoomTitle: [] };
      let matters = { title: "", chatRoomTitle: [] };
      let hot = { title: "", chatRoomTitle: [] };

      querySnapshot.forEach((doc) => {
        const { title, chatName } = doc.data();
        if (title === "Mentions") {
          admin.chatRoomTitle.push({
            chatName: chatName,
            docID: doc.id,
          });
          admin = {
            title: title,
            chatRoomTitle: admin.chatRoomTitle,
          };
        }
        if (title === "Matters-on-ground") {
          matters.chatRoomTitle.push({
            chatName: chatName,
            docID: doc.id,
          });
          matters = {
            title: title,
            chatRoomTitle: matters.chatRoomTitle,
          };
        }
        if (title === "Hot-spots") {
          hot.chatRoomTitle.push({
            chatName: chatName,
            docID: doc.id,
          });
          hot = {
            title: title,
            chatRoomTitle: hot.chatRoomTitle,
          };
        }
      });
      // console.log(hot);
      setAdminRoomList(admin);
      setMattersRoomList(matters);
      setHotSpotRoomList(hot);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const { uid } = firebase.auth().currentUser;
    if (focused) {
      updateCurrentScreen(uid, "Room");
    }
  }, [focused]);

  return (
    <View style={styles.screen}>
      <View style={styles.headerNav}>
        <Image
          style={styles.image}
          source={require("../../assets/LogoIMG.png")}
        />
        <Text style={styles.max}>max-im-um</Text>
      </View>

      {!loading && (
        <ScrollView style={styles.mainContent}>
          <Sections sectionsObject={adminRoomList} />
          <Sections sectionsObject={mattersRoomList} />
          <Sections sectionsObject={hotSpotRoomList} />
        </ScrollView>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerNav: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#8CB8B9",
    height: 88,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    height: 35,
    width: 40,
  },
  max: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 2,
    color: "#fff",
  },
  mainContent: {
    marginTop: 20,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
