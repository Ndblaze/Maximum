import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

import { deleteAreadyApprovedTopic } from "../../firebase/useFirebase";

const OldTopic = () => {
  const [topicsDB, setTopicsDB] = useState([]);

  const getAllApprovedChat = () => {
    const db = firebase.firestore();

    const unsubscribe = db
      .collection("chats")
      .where("title", "==", "Matters-on-ground")
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), docID: doc.id });
        });
        //console.log(data);
        setTopicsDB(data);
      });
    return unsubscribe;
  };

  const handleTopicLongPress = (topicDetails) => {
    // console.log(topicDetails);
    Alert.alert("Decision", "are you sure you want to delete this topic", [
      {
        text: "Cancel",
        onPress: () => console.log("operation canceled"),
      },
      {
        text: "Delete",
        onPress: () => deleteAreadyApprovedTopic(topicDetails),
      },
    ]);
  };

  useEffect(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      getAllApprovedChat();
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      {topicsDB &&
        topicsDB.map((topic, index) => (
          <TouchableWithoutFeedback
            key={index}
            onLongPress={() => handleTopicLongPress(topic)}
          >
            <View style={styles.newTopic}>
              <Text style={styles.title}># {topic.chatName}</Text>
              <Text style={styles.by}>title: {topic.title} </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
    </ScrollView>
  );
};

export default OldTopic;

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
  },
  newTopic: {
    height: 70,
    borderBottomColor: "#F5F5F5",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4c4c4c",
  },
  by: {
    fontSize: 12,
    fontWeight: "700",
    fontStyle: "italic",
    color: "#c4c4c4",
  },
});
