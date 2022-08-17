import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

import { Alert } from "react-native";
import { enableNotificationPermissionStatus } from "../manageNotifications/notification";

// enable/disable notification on app in the profile notification settings
export const notificationSettings = (currentUser) => {
  Alert.alert(
    "Notification Permission",
    "Do you wish to ENABLE notification ? ",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Operation stoped"),
      },
      {
        text: "Enable",
        onPress: () => saveTokenToDB(currentUser),
      },
    ]
  );
};

const saveTokenToDB = (user) => {
  enableNotificationPermissionStatus()
    .then((token) => {
      const unsubscribe = firebase
        .firestore()
        .collection("notifications")
        .doc(user.uid)
        .set(
          {
            notificationToken: token,
          },
          { merge: true }
        );
      //  console.log(token);
      alert("Notification Enable Succefully !!");
      return unsubscribe;
    })
    .catch(() => {
      alert("Something went wrong!!, Try again");
    });
};
