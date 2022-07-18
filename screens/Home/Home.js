import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Constants from "expo-constants";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

import Sections from "../../components/common/Sections";

const Home = ({ navigation }) => {
  //Admin room list details
  const [adminRoomList, setAdminRoomList] = useState({ title: "Mentions" });
  const [mattersRoomList, setMattersRoomList] = useState({
    title: "Matters-on-ground",
  });
  const [hotSpotRoomList, setHotSpotRoomList] = useState({
    title: "Hot-spots",
  });

  const [unreadMessagesList, setUnreadMessagesList] = useState([]);
  const [messageLastRead, setMessageLastRead] = useState([]);

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db.collection("chats").onSnapshot((querySnapshot) => {
      let admin = { title: "", chatRoomTitle: [] };
      let matters = { title: "", chatRoomTitle: [] };
      let hot = { title: "", chatRoomTitle: [] };

      querySnapshot.forEach((doc) => {
        const { title, chatName } = doc.data();

        if (title === "Mentions") {
          admin.chatRoomTitle.push({ chatName: chatName, docID: doc.id });
          admin = {
            title: title,
            chatRoomTitle: admin.chatRoomTitle,
          };
        }
        if (title === "Matters-on-ground") {
          matters.chatRoomTitle.push({ chatName: chatName, docID: doc.id });
          matters = {
            title: title,
            chatRoomTitle: matters.chatRoomTitle,
          };
        }
        if (title === "Hot-spots") {
          hot.chatRoomTitle.push({ chatName: chatName, docID: doc.id });
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
    });

    return unsubscribe;
  }, []);

  //useEffect to get the last read for messages
  useEffect(() => {
    const { uid } = firebase.auth().currentUser;

    const db = firebase.firestore();
    const unsubscribe = db
      .collection("unreadMessages")
      .doc(uid)
      .collection("chat-rooms")
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const { chatName, lastRead, docID } = doc.data();
          const seconds = lastRead?.seconds;
          return { chatName, docID, seconds };
        });

        setMessageLastRead(data);
      });

    return unsubscribe;
  }, []);

  //get the last 20 messages and compare with the last time opened
  useEffect(() => {
    if (messageLastRead) {
      let data = [];
      const db = firebase.firestore();
      messageLastRead.forEach((unread) => {
        //console.log(unread);
        db.collection("chats")
          .doc(unread.docID)
          .collection("messages")
          .orderBy("timestamp", "asc")
          .limit(20)
          .onSnapshot((querySnapshot) => {
            let obj = {};
            querySnapshot.docs.map((doc, index) => {
              const realDate = doc.data().timestamp?.seconds;
              if (realDate * 1000 > unread.seconds * 1000) {
                obj = { ...unread, length: index + 1 };
                return;
              }
            });
            //conditional seting if object is not empty
            {
              obj.hasOwnProperty("length") && data.push(obj);
            }
            //set the unread list
            setUnreadMessagesList(data);
           // console.log(data);

          });
      });
    }
  }, [messageLastRead]);

  return (
    <View style={styles.screen}>
      <View style={styles.headerNav}>
        <Image
          style={styles.image}
          source={require("../../assets/LogoIMG.png")}
        />
        <Text style={styles.max}>max-im-um</Text>
      </View>

      <ScrollView style={styles.mainContent}>
        <Sections sectionsObject={adminRoomList} unreadMessagesList={unreadMessagesList} />
        <Sections sectionsObject={mattersRoomList} unreadMessagesList={unreadMessagesList} />
        <Sections sectionsObject={hotSpotRoomList} unreadMessagesList={unreadMessagesList} />
      </ScrollView>
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
