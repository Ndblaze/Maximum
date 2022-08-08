import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

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
