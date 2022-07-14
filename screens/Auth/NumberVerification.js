import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import React, { useState } from "react";
import Layout from "../../components/Auth/Layout";
import { AntDesign } from "@expo/vector-icons";
import AuthButton from "../../components/Auth/AuthButton";

const NumberVerification = () => {
  const [code, setCode] = useState("");

  const validateCode = () => {
    //validate the code sent in this part and move to the next screen


    //next screen if valid
    alert(code)
  };

  return (
    <Layout>
      <View style={styles.content}>
        <AntDesign name="arrowleft" size={24} color="black" />
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../../assets/verificationIMG.png")}
          />
        </View>
        <Text style={styles.header}>Verification Code</Text>
        <Text style={styles.body}>
          We have sent a 6-digite verification code to the Mobile Number below
        </Text>
        <Text style={styles.number}>+213798735261</Text>
        <View style={styles.code}>
          <TextInput
            keyboardType="numeric"
            style={styles.codeNumber}
            defaultValue={code}
            onChangeText={(text) => setCode(text)}
          />
        </View>

        <AuthButton title="Submit" onPress={() => validateCode()} />
      </View>
    </Layout>
  );
}; 

export default NumberVerification;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 170,
    height: 170,
  },
  header: {
    marginTop: 5,
    fontSize: 27,
    fontWeight: "bold",
    textAlign: "center",
  },
  body: {
    fontSize: 17,
    marginTop: 5,
    color: "#A1A1A1",
    textAlign: "center",
  },
  number: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FF7B7B",
  },
  code: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 35,
    height: 40,
  },
  codeNumber: {
    fontSize: 17,
    textAlign: "center",
    borderColor: "#fff",
    borderBottomColor: "#A1A1A1",
    borderWidth: 2,
    height: 40,
    width: 160,
  },
});
