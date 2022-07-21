import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export const updateCurrentScreen = (uid, docName) => {
  //this updates the current scrren field in the notification collection
  const unsubscribe = firebase
    .firestore()
    .collection("notifications")
    .doc(uid)
    .set(
      {
        userCurrentScreen: docName,
      },
      { merge: true }
    );
  return unsubscribe;
};
