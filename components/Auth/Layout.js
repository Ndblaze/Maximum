import {
  StyleSheet,
  Keyboard,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import Constants from "expo-constants";

const Layout = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: "#fff",
  },
});
