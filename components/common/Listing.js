import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Listing = ({ name, screen, detail }) => {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate(screen, { tip: detail })}
    >
      <View style={styles.newTopic}>
        <Text style={styles.title}>{name}</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#c4c4c4" />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Listing;

const styles = StyleSheet.create({
  newTopic: {
    height: 70,
    borderBottomColor: "#F5F5F5",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4c4c4c",
  },
});
