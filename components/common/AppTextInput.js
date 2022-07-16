import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform } from "react-native";


const AppTextInput = ({ icon, width = "100%", height, ...otherprops }) => {
  return (
    <View style={[styles.container, { width }]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color= "#6e6969"
          style={styles.icon} 
        />
      )}
      <TextInput 
        width={width}
        height={height}
        placeholderTextColor= "#6e6969"
        style={styles.text}
        {...otherprops}
      />
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f4f4",
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 15,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    color: "#0c0c0c",
  },
});
