import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import React, { useState } from "react";
import Layout from "../../components/Auth/Layout";
import AuthButton from "../../components/Auth/AuthButton";
import PhoneNumberInput from "../../components/Auth/PhoneNumberInput";
import { isValidNumber } from "react-native-phone-number-input";

const Register = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const validateInputs = () => {
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
        <Text style={styles.header}>Create Account</Text>
        <Text style={styles.body}>
          Hello, welcome, register to join the gist!!
        </Text>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../../assets/createIMG.png")}
          />
        </View>

        <Text style={styles.body}>Username</Text>
        <TextInput
          style={styles.username}
          defaultValue={username}
          onChangeText={(text) => setUsername(text)}
        />

        <Text style={styles.body}>Phone Number</Text>
        <PhoneNumberInput
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
        <AuthButton title="Create Now" onPress={() => validateInputs()} />
        <View style={styles.register}>
          <Text>I have an account? </Text>
          <Text
            style={styles.registerNow}
            onPress={() => navigation.navigate("Login")}
          >
            Login!!
          </Text>
        </View>
      </View>
    </Layout>
  );
};

export default Register;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    marginTop: 10,
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
    width: 230,
    height: 170,
  },
  username: {
    width: "100%",
    height: 50,
    paddingLeft: 20,
    fontSize: 18,
    borderRadius: 20,
    marginTop: 7,
    backgroundColor: "#F3F2F2",
    marginBottom: 10,
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
