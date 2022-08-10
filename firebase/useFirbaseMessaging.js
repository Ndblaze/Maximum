import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

//notifications functions
import {
  sendLocalNotification,
  sendPushNotification,
} from "../manageNotifications/notification";

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>///////////////////////
export const sendMessage = (chat, route) => {
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
        _id: chat.user._id,
        name: chat.user.name,
      },
    })
    .then((docRef) => {
      updateLastRead(route.params.docID, chat.user._id);
      //console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      //console.error("Error adding document: ", error);
    });

  return unsubscribe;
};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//update last red chat
const updateLastRead = (docID, uid) => {
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

// >>> Precaution purposes >>>>>
//this is just to add a field inside so as to make this document appear in query snapshots
export const initializeMyUnreadMessages = (uid) => {
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

//notify all users after a send of message
export const notifyUsers = (message, user, route) => {
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
            subtitle: user.displayName,
            sound: "default",
            data: {
              docID: route.params.docID,
              title: route.params.title,
            },
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
