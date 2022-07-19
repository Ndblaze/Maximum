import {
  StyleSheet,
  Text,
  Alert,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Badge } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
require("firebase/firestore");

const UnreadMessages = ({ roomID }) => {
  const [unread, setUnread] = useState(20);

  //load page before showing contents
  const [load, setLoad] = useState(false);

  //get last read chat
  const getLastRead = (roomID) => {
    const { uid } = firebase.auth().currentUser;
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("unreadMessages")
      .doc(uid)
      .collection("chat-rooms")
      .doc(roomID)
      .onSnapshot((doc) => {
        //check if doc data exists befor calling the other functions
        if (doc.data()) {
          const lastRead = doc.data().lastRead;
          //console.log(lastRead?.valueOf());
          getLastMessages(roomID, lastRead?.valueOf());
        }
      });

    return unsubscribe;
  };

  //getLastMessages twenty messages
  const getLastMessages = (roomID, lastRead) => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("chats")
      .doc(roomID)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .limit(20)
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return doc.data().timestamp;
        });
        // console.log(data);
        calculateNumberOfUnread(data, lastRead);
      });

    return unsubscribe;
  };

  //calculate Number Of Unread messages
  const calculateNumberOfUnread = (twentyMessages, lastRead) => {
    const numberOfUnread = twentyMessages.filter((message) => {
      return message?.valueOf() > lastRead;
    });

    //console.log(numberOfUnread.length);
    setUnread(numberOfUnread.length);
    setLoad(true);
  };

  useEffect(() => {
    getLastRead(roomID);
  }, []);

  return (
    <>
      {load && (
        <Badge
          size={17}
          children={unread >= 20 ? `${unread}+` : unread}
          visible={unread == 0 ? false : true}
        />
      )}
    </>
  );
};

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
        //console.log(docRef.id);
        getAllUnreadMessageDoc(topic, docRef.id)
      })
      .catch((error) => {
        //console.error("Error adding document: ", error);
      });
  };

  //get all the chat room uid and call the setLastRead function
  const getAllUnreadMessageDoc = (chatName, chatID) => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("unreadMessages")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log('called');
          console.log(doc.id);
         // setLastRead(doc.id, chatName, chatID);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    return unsubscribe;
  };

  //set last red chat to all unreadMessage doc after Adding a new topic(matter)
  const setLastRead = (unreadMessageDocID, chatName, chatID) => {
    const db = firebase.firestore();

    const unsubscribe = db
      .collection("unreadMessages")
      .doc(unreadMessageDocID)
      .collection("chat-rooms")
      .doc(chatID)
      .set({
        chatName: chatName,
        docID: chatID,
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

  //Re-set last red chat after clicking on a particular chat
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
          sectionsObject.chatRoomTitle.map(({ chatName, docID }) => (
            <TouchableWithoutFeedback
              key={docID}
              onPress={() => handleChatPress(chatName, docID)}
            >
              <View style={styles.chatTitle}>
                <Text style={styles.divisionRoom}>
                  # {"   "}
                  {chatName}
                </Text>
                {docID && <UnreadMessages roomID={docID} />}
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
