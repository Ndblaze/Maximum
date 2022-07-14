import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import Layout from "../../components/Auth/Layout";
import AuthButton from "../../components/Auth/AuthButton";
import PhoneNumberInput from "../../components/Auth/PhoneNumberInput";
import { isValidNumber } from "react-native-phone-number-input";

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const sendCode = () => {
    const isValid = isValidNumber(phoneNumber);
    if (isValid) {
      navigation.navigate("NumberVerification");
    } else {
      alert("Error: Provide a valid phone number");
    }
  };

  return (
    <Layout>
      <View style={styles.content}>
        <Text style={styles.header}>Login Account</Text>
        <Text style={styles.body}>Hello, welcome back to your account !!</Text>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../../assets/loginIMG.png")}
          />
        </View>
        <Text style={styles.body}>Phone Number</Text>

        <PhoneNumberInput
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
        <AuthButton title="Request Code" onPress={() => sendCode()} />
        <View style={styles.register}>
          <Text>Not registered yet? </Text>
          <Text
            style={styles.registerNow}
            onPress={() => navigation.navigate("Register")}
          >
            Register Now!!
          </Text>
        </View>
      </View>
    </Layout>
  );
};

export default Login;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 7,
  },
  body: {
    fontSize: 15,
    color: "#A1A1A1",
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 170,
    height: 170,
  },
  register: {
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  registerNow: {
    color: "#FF7B7B",
    fontWeight: "bold",
  },
});
