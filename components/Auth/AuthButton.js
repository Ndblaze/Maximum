import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import React from "react";

const AuthButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.button}> {title}</Text>
    </TouchableOpacity>
  );
};

export default AuthButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#8CB8B9",
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    fontWeight: "700",
    fontSize: 16,
    color: "#fff",
  },
});
