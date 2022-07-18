import {
  StyleSheet,
  Text,
  Alert,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { Badge } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
require("firebase/firestore");

const Sections = ({ sectionsObject }) => {
  const navigation = useNavigation();

  const addNewMatter = (topic) => {
    if (topic.trim().length <= 5 || topic.trim().length >= 20) {
      alert(
        "topic too short or too long, please provid a meaningfull name for your topic"
      );
      return;
    }

    const db = firebase.firestore();
    db.collection("chats")
      .add({
        title: "Matters-on-ground",
        chatName: topic,
      })
      .then((docRef) => {
        //console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        //console.error("Error adding document: ", error);
      });
  };

  //update last red chat
  const updateLastRead = (chatName, docID) => {
    const { uid } = firebase.auth().currentUser;
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("unreadMessages")
      .doc(uid)
      .collection("chat-rooms")
      .doc(docID)
      .set({
        chatName: chatName,
        docID: docID,
        lastRead: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        //console.log("Document successfully written!");
      })
      .catch((error) => {
        //console.error("Error writing document: ", error);
      });

    return unsubscribe;
  };

  //action when you click on a chat
  const handleChatPress = (chatName, docID) => {
    navigation.navigate("Messaging", {
      title: "#" + "  " + chatName,
      docID: docID,
    });

    //update lastRead
    updateLastRead(chatName, docID);
  };

  return (
    <View style={styles.division}>
      <View key={sectionsObject.title}>
        <View style={styles.divisionTitleContainer}>
          <Text style={styles.divisionTitle}> {sectionsObject.title} </Text>
        </View>
        {sectionsObject.chatRoomTitle &&
          sectionsObject.chatRoomTitle.map(({ chatName, docID, unread }) => (
            <TouchableWithoutFeedback
              key={docID}
              onPress={() => handleChatPress(chatName, docID)}
            >
              <View style={styles.chatTitle}>
                <Text style={styles.divisionRoom}>
                  # {"   "}
                  {chatName}
                </Text>

                <Badge>{unread}</Badge>
              </View>
            </TouchableWithoutFeedback>
          ))}
        {sectionsObject.title === "Matters-on-ground" && (
          <Text
            style={styles.addTopic}
            onPress={() =>
              Alert.prompt("Matters", "Enter new topic here", [
                {
                  text: "Cancel",
                  onPress: () => console.log("operation canceled"),
                },
                {
                  text: "Submit",
                  onPress: (text) => addNewMatter(text),
                },
              ])
            }
          >
            <Ionicons name="add" size={20} color="tomato" /> {"  "}
            Add topic
          </Text>
        )}
      </View>
    </View>
  );
};

export default Sections;

const styles = StyleSheet.create({
  division: {
    marginBottom: 20,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderBottomColor: "#F5F5F5",
  },
  divisionTitleContainer: {},
  divisionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  divisionRoom: {
    fontSize: 18,
    fontWeight: "600",
    color: "#c4c4c4",
    paddingTop: 20,
    paddingLeft: 30,
  },
  addTopic: {
    fontSize: 16,
    fontWeight: "600",
    color: "tomato",
    paddingTop: 20,
    paddingLeft: 24,
    fontStyle: "italic",
  },
  chatTitle: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
