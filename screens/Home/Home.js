import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import Constants from "expo-constants";

const Home = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <View style={styles.headerNav}>
        <Image
          style={styles.image}
          source={require("../../assets/LogoIMG.png")}
        />
        <Text style={styles.max} >max-imu-m</Text>
      </View>
      <Text onPress={() => navigation.navigate("Messaging")}>Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerNav: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#8CB8B9",
    height: 88,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: "center"
  },
  image: {
    height: 35,
    width: 40,
  },
  max:{
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 2,
    color: '#fff',
  }
});
