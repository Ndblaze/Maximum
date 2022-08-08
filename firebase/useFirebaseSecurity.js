import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

//>>>>>>>>>>>>>>.Security tips >>>>>>>>>>>>>>>>>>>>>/////////////

export const getSecurityTips = () => {
  const db = firebase.firestore();

  const unsubscribe = db
    .collection("security")
    .get()
    .then((querySnapshot) => {
      let data = querySnapshot.docs.map((doc) => {
        //console.log(doc.id);
        return doc.data();
      });
      return data;
    })
    .catch((error) => {
      //console.error("Error writing document: ", error);
    });
  return unsubscribe;
};
