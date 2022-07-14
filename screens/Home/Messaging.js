import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenLayout from "../../components/common/ScreenLayout";

const Messaging = ({ navigation }) => {
  return (
    <ScreenLayout>
      <Text onPress={() => navigation.navigate("Room")}>Messaging</Text>
    </ScreenLayout>
  );
};

export default Messaging;

const styles = StyleSheet.create({});
