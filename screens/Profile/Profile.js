import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import ScreenLayout from "../../components/common/ScreenLayout";
import { EvilIcons } from "@expo/vector-icons";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

//use firebase hooks
import {
  updateCurrentScreen,
  deletNotificationToken,
} from "../../firebase/useFirebase";

const Profile = () => {
  const [user, setUser] = useState({});
  const [newUsername, setNewUsername] = useState("");

  const focused = useIsFocused();

  const changeUsername = () => {
    if (newUsername.length > 3) {
      const user = firebase.auth().currentUser;
      //console.log(user);
      user
        .updateProfile({
          displayName: newUsername,
        })
        .then((result) => {
          getUsername();
          setNewUsername("");
          // console.log("profile");
        })
        .catch((error) => {
          // An error occurred
        });
    }
  };

  const getUsername = () => {
    const user = firebase.auth().currentUser;
    setUser(user);
  };

  useEffect(() => {
    getUsername();
  }, []);

  useEffect(() => {
    const { uid } = firebase.auth().currentUser;
    if (focused) {
      updateCurrentScreen(uid, "Profile");
    }
  }, [focused]);

  return (
    <ScreenLayout style={styles.screen}>
      <ScrollView style={styles.scrollview}>
        <View style={styles.container}>
          <View style={styles.photo}>
            <Text style={styles.firstLetter}>
              {user.displayName ? user.displayName.charAt(0) : ""}
            </Text>
          </View>
          <Text style={styles.username}>
            {user.displayName && user.displayName}
          </Text>
        </View>

        <Text style={styles.label}>Edit Username</Text>
        <TextInput
          maxLength={20}
          style={styles.newUsername}
          defaultValue={newUsername}
          onChangeText={(text) => setNewUsername(text)}
        />

        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={styles.save}
            onPress={() => changeUsername()}
          >
            <Text style={styles.buttonText}> Save Changes </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.saveContainer, { marginTop: 40 }]}>
          <TouchableOpacity
            style={[styles.save, { backgroundColor: "tomato" }]}
            onPress={() => deletNotificationToken(user)}
          >
            <Text style={styles.buttonText}> Logout </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

export default Profile;

const styles = StyleSheet.create({
  screen: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  scrollview: {
    height: "100%",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  photo: {
    height: 150,
    width: 150,
    borderRadius: 100,
    backgroundColor: "#F5F5F5",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  firstLetter: {
    fontSize: 70,
    fontWeight: "600",
  },
  username: {
    fontSize: 25,
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
