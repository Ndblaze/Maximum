import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

const AuthButton = ({ onPress, title, style }) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Text style={styles.button}> {title}</Text>
    </TouchableOpacity>
  );
};

export default AuthButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#8CB8B9",
    height: 50,
    width: "100%",
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
