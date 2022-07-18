import firebase from "firebase";
require("firebase/firestore");

export const updateLastRead = (chatName, docID) => {
  const db = firebase.firestore();
  const unsubscribe = db
    .collection("unreadMessages")
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
