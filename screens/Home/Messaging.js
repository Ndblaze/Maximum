import { StyleSheet, Text, View } from "react-native";
import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import firebase from "firebase";
require("firebase/firestore");

const Messaging = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#8CB8B9",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
        }}
      />
    );
  };
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{ marginBottom: 5, marginRight: 5 }}
            size={32}
            color={"#8CB8B9"}
          />
        </View>
      </Send>
    );
  };
  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color={"#333"} />;
  };

  //console.log(route.params);

  const getUsername = () => {
    const { uid } = firebase.auth().currentUser;
    // console.log(uid);
    const db = firebase.firestore();
    db.collection("users")
      .doc(uid)
      .onSnapshot((doc) => {
        const { username } = doc.data();
        // console.log(username);
        setUsername(username);
      });
  };

  const sendMessage = (chat) => {
    // console.log(chat);
    getUsername();
    const db = firebase.firestore();
    db.collection("chats")
      .doc(route.params.docID)
      .collection("messages")
      .add({
        _id: chat._id,
        text: chat.text,
        createdAt: chat.createdAt.toString(),
        user: {
          _id: firebase.auth().currentUser.uid,
          name: username,
        },
      })
      .then((docRef) => {
        //console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        //console.error("Error adding document: ", error);
      });
  };

  useLayoutEffect(() => {
    const db = firebase.firestore();
    db.collection("chats")
      .doc(route.params.docID)
      .collection("messages")
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return doc.data();
        });

        // console.log(data);
        setMessages(data);
      });
  }, []);

  const onSend = useCallback((messages = []) => {
    sendMessage(messages[0]);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <GiftedChat
      messages={messages && messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: firebase.auth().currentUser.uid,
      }}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
    />
  );
};

export default Messaging;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
