import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

//notifications functions
import {
  sendLocalNotification,
  sendPushNotification,
} from "../manageNotifications/notification";

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




//handling the delete notification token on logout if app >>>>>>>>>>>>>>>>>>>> //////////////////

export const deletNotificationToken = (user) => {
  const db = firebase.firestore();

  const unsubscribe = db;
  db.collection("notifications")
    .doc(user.uid)
    .delete()
    .then(() => {
      //console.log("Document successfully deleted!");
      firebase.auth().signOut();
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
      alert(error);
    });

  return unsubscribe;
};

// handling adding and approving new topics  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//add a new matter
export const addNewUnapprovedMatter = (topic, user) => {
  //verify the length of the topic
  if (topic.trim().length <= 5 || topic.trim().length >= 20) {
    alert(
      "topic too short or too long, please provid a meaningfull name for your topic"
    );
    return;
  }

  //add new matter to the unApprovedMatters collection to be verified by admin
  const db = firebase.firestore();
  const unsubscribe = db
    .collection("unApprovedMatters")
    .add({
      title: "Matters-on-ground",
      chatName: topic,
      owner: user.uid,
      email: user.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then((docRef) => {
      //console.log(docRef.id);
      //send scheduled local notification
      const request = "Add Topic Request";
      const status = `your topic "${topic}" has been send to the admin for approval, This is necessary for the regulation of the app usage, be patient while your topic is been reviewed Thank you!`;
      sendLocalNotification(request, status);
    })
    .catch((error) => {
      const request = "New Matters-on-ground Request";
      const status = `Your "${topic}" was NOT send succefully please resend , Thank you!`;
      sendLocalNotification(request, status);
      //console.error("Error adding document: ", error);
    });

  return unsubscribe;
};

//on approved by the admin run function

export const addNewApprovedMatter = (topicDetails) => {
  const db = firebase.firestore();
  const unsubscribe = db
    .collection("chats")
    .add({
      title: "Matters-on-ground",
      chatName: topicDetails.chatName,
    })
    .then((docRef) => {
      //console.log(docRef.id);
      getAllUnreadMessageDoc(topicDetails, docRef.id);
      //send apporval notification to the creator of the topic that was just approved
      sendTopicApprovalNotification(topicDetails);
      //delet document after been approved
      deleteDocument(topicDetails);
    })
    .catch((error) => {
      //console.error("Error adding document: ", error);
    });

  return unsubscribe;
};

//get all the chat room uid and call the setLastRead function
const getAllUnreadMessageDoc = (topicDetails, chatID) => {
  const db = firebase.firestore();

  const unsubscribe = db
    .collection("unreadMessages")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //console.log(doc.id)
        setLastRead(doc.id, topicDetails, chatID);
      });
    })
    .catch((error) => {
      //console.error("Error writing document: ", error);
    });

  return unsubscribe;
};

//set last red chat to all unreadMessage doc after Adding a new topic(matter)
const setLastRead = (unreadMessageDocID, topicDetails, chatID) => {
  const db = firebase.firestore();

  const unsubscribe = db
    .collection("unreadMessages")
    .doc(unreadMessageDocID)
    .collection("chat-rooms")
    .doc(chatID)
    .set({
      chatName: topicDetails.chatName,
      docID: chatID,
      lastRead: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {})
    .catch((error) => {
      //console.error("Error writing document: ", error);
    });

  return unsubscribe;
};

//delet document after approval or rejection by admin
export const deleteDocument = (topicDetails) => {
  const db = firebase.firestore();

  const unsubscribe = db;
  db.collection("unApprovedMatters")
    .doc(topicDetails.docID)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });

  return unsubscribe;
};

//send a push notification to a user after their topic has been approved
const sendTopicApprovalNotification = (topicDetails) => {
  const db = firebase.firestore();

  const unsubscribe = db;
  db.collection("notifications")
    .doc(topicDetails.owner)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const batch = [
          {
            to: doc.data().notificationToken,
            subtitle: "Hurry!! 🎉🎉",
            sound: "default",
            title: "Topic Approved",
            body: `your topic "${topicDetails.chatName}" has been approved by the admin, Go start a conversation!! 🔥🔥`,
          },
        ];
        sendPushNotification(batch);
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });

  return unsubscribe;
};

//>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// handling Already approved topics  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//deleting the messages collection in the chat doc we want to delet
//NOTE: for now u have to manually delet all the messages in the chat/message collection after deleting a chat
const deleteAllMessagesInTheDoc = (topicDetails) => {
  //console.log(topicDetails);
  const db = firebase.firestore();

  const unsubscribe = db;
  db.collection("chats")
    .doc(topicDetails.docID)
    .collection("messages")
    .delete()
    .then(() => {
      //console.log("Document successfully deleted!");
      getAllDocInUnReadMeassages(topicDetails);
    })
    .then(() => {
      alert("all documents reference have been deleted successfully");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
      alert(error);
    });

  return unsubscribe;
};

//deleting already approved topic
export const deleteAreadyApprovedTopic = (topicDetails) => {
  //console.log(topicDetails);
  const db = firebase.firestore();

  const unsubscribe = db;
  db.collection("chats")
    .doc(topicDetails.docID)
    .delete()
    .then(() => {
      //console.log("Document successfully deleted!");
      getAllDocInUnReadMeassages(topicDetails);
    })
    .then(() => {
      alert("all documents reference have been deleted successfully");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
      alert("You dont have permission to delete this topic");
    });

  return unsubscribe;
};

//deleting all chat related from thr unread messages of all users
const getAllDocInUnReadMeassages = (topicDetails) => {
  const db = firebase.firestore();

  const unsubscribe = db
    .collection("unreadMessages")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //console.log(doc.id)
        deleteEachMessageRef(doc.id, topicDetails);
        return doc;
      });
    })
    .catch((error) => {
      //console.error("Error writing document: ", error);
      alert(error);
    });

  return unsubscribe;
};

//geting each message ref and deleting
const deleteEachMessageRef = (docID, topicDetails) => {
  const db = firebase.firestore();

  const unsubscribe = db;
  db.collection("unreadMessages")
    .doc(docID)
    .collection("chat-rooms")
    .doc(topicDetails.docID)
    .delete()
    .then(() => {
      //console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
      alert(error);
    });

  return unsubscribe;
};

////>>>>>>>>>>>>>>>>>>>>>>  Do this after sending a message

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

