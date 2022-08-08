import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import Layout from "../../components/Auth/Layout";
import AuthButton from "../../components/Auth/AuthButton";
import { Formik } from "formik";
import * as yup from "yup";
import firebase from "firebase";

import AppTextInput from "../../components/common/AppTextInput";
import ErrorMessage from "../../components/common/ErrorMessage";

const ForgotPassword = ({ navigation }) => {
  const validationSchema = yup.object().shape({
    email: yup.string().required().email().label("Email"),
  });

  const sendEmail = (values) => {
    if (values) {
      //console.log(values);
      firebase
        .auth()
        .sendPasswordResetEmail(values.email)
        .then(() => {
          navigation.navigate("LinkSent", { email: values.email });
        })
        .catch((error) => {
          //console.log(error);
          alert(error);
        });
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.header}>Forgot Password</Text>
        <View style={styles.lockIconContainer}>
          <View style={styles.content}>
            <Entypo name="lock" size={95} color="#8CB8B9" />
          </View>
        </View>
        <Text style={styles.discription}>
          Please Enter Your Email Address To Recieve a Link to Reset Your
          Password
        </Text>

        <Formik
          initialValues={{ email: "" }}
          onSubmit={(values) => sendEmail(values)}
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
              <AuthButton
                title="Send Email"
                onPress={handleSubmit}
                style={styles.button}
              />
            </>
          )}
        </Formik>
      </View>
    </Layout>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    flex: 1,
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#4a4a4a",
    marginBottom: 35,
    textAlign: "center",
  },
  lockIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: 170,
    height: 170,
    backgroundColor: "#e8f2f2",
    borderRadius: 110,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  discription: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 20,
  },
  button: {
    marginTop: 30,
  },
});
