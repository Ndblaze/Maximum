import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Listing from "../../components/common/Listing";

const Management = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Listing name={"Manage Approved Topics"} screen={"OldTopics"} />

      <Listing name={"New Topic Requests"} screen={"NewTopics"} />

      <Listing name={"Manage Security Tips"} screen={"SecurityTips"} />
    </View>
  );
};

export default Management;

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
  },
});
