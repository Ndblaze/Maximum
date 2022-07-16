import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenLayout from "../../components/common/ScreenLayout";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const changeUsername = () => {
    const { uid } = firebase.auth().currentUser;
    // console.log(uid);
    if (newUsername.length > 3) {
      const db = firebase.firestore();
      db.collection("users")
        .doc(uid)
        .update({
          username: newUsername,
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });

      setNewUsername("");
    }
  };

  const getUsername = () => {
    const { uid } = firebase.auth().currentUser;
    // console.log(uid);
    const db = firebase.firestore();
    db.collection("users")
      .doc(uid)
      .onSnapshot((doc) => {
        // console.log("Current data: ", doc.data());
        const { email, username } = doc.data();
        setUsername(username);
        setEmail(email);
      });
  };

  useEffect(() => {
    getUsername();
  }, []);

  return (
    <ScreenLayout style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.photo}>
          <Text style={styles.firstLetter}>
            {username ? username.charAt(0) : ""}
          </Text>
        </View>
        <Text style={styles.username}>{username}</Text>
      </View>

      <Text style={styles.label}>Edit Username</Text>
      <TextInput
        maxLength={20}
        style={styles.newUsername}
        defaultValue={newUsername}
        onChangeText={(text) => setNewUsername(text)}
      />

      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.save} onPress={() => changeUsername()}>
          <Text style={styles.buttonText}> Save Changes </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.saveContainer, { marginTop: 50 }]}>
        <TouchableOpacity
          style={[styles.save, { backgroundColor: "tomato" }]}
          onPress={() => firebase.auth().signOut()}
        >
          <Text style={styles.buttonText}> Logout </Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

export default Profile;

const styles = StyleSheet.create({
  screen: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  photo: {
    height: 200,
    width: 200,
    borderRadius: 100,
    backgroundColor: "#F5F5F5",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  firstLetter: {
    fontSize: 80,
    fontWeight: "600",
  },
  username: {
    fontSize: 30,
    fontWeight: "600",
  },
  label: {
    fontSize: 15,
    color: "#A1A1A1",
    marginTop: 40,
  },
  newUsername: {
    width: "100%",
    height: 50,
    paddingLeft: 10,
    fontSize: 18,
    borderRadius: 10,
    marginTop: 7,
    backgroundColor: "#F3F2F2",
    marginBottom: 10,
  },
  saveContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  save: {
    backgroundColor: "#000",
    width: "65%",
    height: 45,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#fff",
  },
});
