import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import AuthButton from "../../components/Auth/AuthButton";

import Layout from "../../components/Auth/Layout";

const LinkSent = ({ navigation, route }) => {
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.lockIconContainer}>
          <View style={styles.content}>
            <Entypo name="check" size={95} color="#8CB8B9" />
          </View>
        </View>
        <Text style={styles.header}> Sent !! </Text>
        <Text style={styles.discription}>
          An email have been sent to {route.params.email} you can and reset your
          password with the link attached to the email{" "}
        </Text>
        <AuthButton
          title="Back to Login"
          onPress={() => navigation.navigate("Login")}
          style={styles.button}
        />
      </View>
    </Layout>
  );
};

export default LinkSent;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: 10,
  },
  lockIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: 170,
    height: 170,
    backgroundColor: "#e8f2f2",
    borderRadius: 110,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#8CB8B9",
    marginBottom: 10,
  },
  discription: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#4a4a4a",
    lineHeight: 25,
  },
  button: {
    marginTop: 30,
  },
});
