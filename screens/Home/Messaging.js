import { Alert, ImageBackground, StyleSheet, Text, View } from "react-native";
import React, {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import * as Clipboard from "expo-clipboard";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { Linking } from "react-native";
import firebase from "firebase";
require("firebase/firestore");

//firebase hooks
import { updateCurrentScreen } from "../../firebase/useFirebase";
import {
  sendMessage,
  initializeMyUnreadMessages,
  notifyUsers,
} from "../../firebase/useFirbaseMessaging";

const renderBubble = (props) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#8CB8B9",
          opacity: 0.7,
          //paddingVertical: 0
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

//call a highlighted number
const callNumber = (phoneNumber) => {
  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (!supported) {
        Alert.alert("Phone number is not available");
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch((err) => console.log(err));
};

const copyUserNameWhenPressAvatar = async () => {
  const username = firebase.auth().currentUser.displayName;
  await Clipboard.setStringAsync(`#${username}`).then(() => {
    alert(`username copied: "${username}"`);
  });
};

//>>>>>>>>>>>>>>>>>>> beginning of component  >>>>>>>>>>>>>>>>>>>>>>>
const Messaging = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [orderLimit, setOrderLimit] = useState(250);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      const user = firebase.auth().currentUser;
      setCurrentUser(user);
      updateCurrentScreen(user.uid, route.params.docID);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useLayoutEffect(() => {
    const { uid } = firebase.auth().currentUser;
    initializeMyUnreadMessages(uid);
    getMessages();
  }, []);

  const getMessages = () => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.docID)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .limit(orderLimit)
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return doc.data();
        });

        // console.log(data);
        setMessages(data);
      });
    setLoading(false);

    return unsubscribe;
  };

  const onSend = useCallback((messages = []) => {
    sendMessage(messages[0], route);
    //notify all users of messages after each send
    notifyUsers(messages[0], currentUser, route);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <ImageBackground
      source={{
        uri: "https://firebasestorage.googleapis.com/v0/b/max-chat-app-bbd6f.appspot.com/o/chatBackground.png?alt=media&token=9149225d-e482-4d26-9aea-c2b94a2cac82",
      }}
      style={{ flex: 1 }}
    >
      <GiftedChat
        messages={messages && messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: firebase.auth().currentUser.uid,
          name: firebase.auth().currentUser.displayName,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderUsernameOnMessage
        bottomOffset={40}
        onPressAvatar={() => copyUserNameWhenPressAvatar()}
        textInputProps={{ marginRight: 20 }}
        minInputToolbarHeight={50}
        onLoadEarlier={() => {
          setLoading(true);
          setOrderLimit(orderLimit * 2);
          getMessages();
        }}
        isLoadingEarlier={loading}
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        loadEarlier
        parsePatterns={(linkStyle) => [
          {
            type: "phone",
            style: linkStyle,
            onPress: (phoneNumber) => callNumber(`tel:${phoneNumber}`),
          },
          {
            pattern: /#(\w+)/,
            style: styles.hashTag,
            onPress: () => Alert.alert("Hash-Tag"),
          },
          {
            type: "url",
            style: styles.hashTag,
            //onPress: (url) => openURL(url),
          },
        ]}
      />
      <View style={styles.bottomDivission}></View>
    </ImageBackground>
  );
};

export default Messaging;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  hashTag: {
    color: "tomato",
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
  bottomDivission: {
    backgroundColor: "#fff",
    height: 35,
    width: "100%",
  },
});
