import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import Layout from "../../components/Auth/Layout";
import AuthButton from "../../components/Auth/AuthButton";
import { Formik } from "formik";
import * as yup from "yup";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

import AppTextInput from "../../components/common/AppTextInput";
import ErrorMessage from "../../components/common/ErrorMessage";

const Register = ({ navigation }) => {
  const validationSchema = yup.object().shape({
    email: yup.string().required().email().label("Email"),
    password: yup.string().required().min(4).label("Password"),
    username: yup.string().required().min(4).label("Username"),
  });

  const UserInfo = (username) => {
    //console.log(username);
    //updating profile DisplayName
    const user = firebase.auth().currentUser;
    user
      .updateProfile({
        displayName: username,
      })
      .then((result) => {
        // console.log("profile");
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  };

  const validateInputs = (values) => {
    if (values) {
      // alert(values.email + values.password + values.username);
      const { email, password, username } = values;
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          // console.log(result);
          UserInfo(username);
        })
        .catch((error) => {
          alert(error);
          //console.log(error);
        });
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

        <Formik
          initialValues={{ email: "", password: "", username: "" }}
          onSubmit={(values) => validateInputs(values)}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleSubmit,
            errors,
            setFieldTouched,
            touched,
          }) => (
            <>
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="email"
                keyboardType="email-address"
                onBlur={() => setFieldTouched("email")}
                onChangeText={handleChange("email")}
                placeholder="Email"
                textContentType="emailAddress"
              />
              <ErrorMessage error={errors.email} visible={touched.email} />
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                placeholder="Password"
                onBlur={() => setFieldTouched("password")}
                onChangeText={handleChange("password")}
                secureTextEntry={true}
                textContentType="password"
              />
              <ErrorMessage
                error={errors.password}
                visible={touched.password}
              />
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="account-outline"
                placeholder="Username"
                onBlur={() => setFieldTouched("username")}
                onChangeText={handleChange("username")}
                textContentType="username"
              />
              <ErrorMessage
                error={errors.username}
                visible={touched.username}
              />
              <View style={styles.divider}></View>
              <AuthButton title="Create Now" onPress={handleSubmit} />
            </>
          )}
        </Formik>

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
    paddingTop: 20,
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
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
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
  divider: {
    marginBottom: 10,
  },
});
