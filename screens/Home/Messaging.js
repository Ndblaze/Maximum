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

//notification functions
import { sendPushNotification } from "../../manageNotifications/notification";

//firebase hooks
import { updateCurrentScreen } from "../../firebase/useFirebase";

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

const Messaging = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [orderLimit, setOrderLimit] = useState(250);
  const [loading, setLoading] = useState(false);

  //console.log(route)

  // >>> Precaution purposes >>>>>
  //this is just to add a field inside so as to make this document appear in query snapshots
  const initializeMyUnreadMessages = (uid) => {
    const db = firebase.firestore();

    const unsubscribe = db
      .collection("unreadMessages")
      .doc(uid)
      .set({
        docID: uid,
      })
      .then(() => {
        //console.log("Document successfully written!");
      })
      .catch((error) => {
        //console.error("Error writing document: ", error);
      });

    return unsubscribe;
  };

  //update last red chat
  const updateLastRead = (docID) => {
    const { uid } = firebase.auth().currentUser;
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("unreadMessages")
      .doc(uid)
      .collection("chat-rooms")
      .doc(docID)
      .update({
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

  const sendMessage = (chat) => {
    const { displayName, uid } = firebase.auth().currentUser;
    // console.log(chat);
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.docID)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        _id: chat._id,
        text: chat.text,
        createdAt: chat.createdAt.toString(),
        user: {
          _id: uid,
          name: displayName,
        },
      })
      .then((docRef) => {
        updateLastRead(route.params.docID);
        //console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        //console.error("Error adding document: ", error);
      });

    return unsubscribe;
  };

  useEffect(() => {
    const { uid } = firebase.auth().currentUser;
    updateCurrentScreen(uid, route.params.docID);
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

  const notifyUsers = (message) => {
    const { uid, displayName } = firebase.auth().currentUser;
    //add if uid dont send push notification
    const unsubscribe = firebase.firestore();
    unsubscribe
      .collection("notifications")
      .where("userCurrentScreen", "!=", route.params.docID)
      .get()
      .then((querySnapshot) => {
        let numberOfDocs = 0;
        let batch = [];
        querySnapshot.forEach((doc) => {
          numberOfDocs++;
          if (numberOfDocs === 90) {
            sendPushNotification(batch);
            batch = [];
            numberOfDocs = 0;
          } else {
            //console.log(doc.data().notificationToken);
            batch.push({
              to: doc.data().notificationToken,
              subtitle: displayName,
              sound: "default",
              data: { navigateTo: "Messaging" },
              title: route.params.title,
              body: message.text,
            });
          }
        });
        //sending the remaining not up to 90 // if number of docs not up to 90
        if (numberOfDocs > 0) {
          sendPushNotification(batch);
          batch = [];
          numberOfDocs = 0;
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const onSend = useCallback((messages = []) => {
    sendMessage(messages[0]);
    notifyUsers(messages[0]);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);


  // getItemLayout = (data, index) => ({
  //   length: 33,
  //   offset: 33 * index,
  //   index,
  // });

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
        }}
        // listViewProps={{
        //   getItemLayout: this.getItemLayout,
        //   initialScrollIndex: 19,
        // }}
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
