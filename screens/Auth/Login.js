import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import Layout from "../../components/Auth/Layout";
import AuthButton from "../../components/Auth/AuthButton";
import { Formik } from "formik";
import * as yup from "yup";
import firebase from "firebase";

import AppText from "../../components/common/AppText";
import AppTextInput from "../../components/common/AppTextInput";
import ErrorMessage from "../../components/common/ErrorMessage";

const Login = ({ navigation }) => {
  const validationSchema = yup.object().shape({
    email: yup.string().required().email().label("Email"),
    password: yup.string().required().min(4).label("Password"),
  });

  const sendCode = (values) => {
    if (values) {
      // alert(values.email + values.password);
      const { email, password } = values;
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((result) => {
          //console.log(result);
        })
        .catch((error) => {
          //console.log(error);
          alert(error);
        });
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

        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => sendCode(values)}
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
              <View>
                <AppText style={styles.text}> Forgot password? </AppText>
              </View>
              <AuthButton title="Request Code" onPress={handleSubmit} />
            </>
          )}
        </Formik>
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
    paddingTop: 10,
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
    width: 150,
    height: 150,
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
  text: {
    textAlign: "left",
    color: "#6e6969",
    marginVertical: 10,
    fontSize: 15,
  },
});
