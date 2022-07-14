import { StyleSheet, View } from "react-native";
import React from "react";
import PhoneInput from "react-native-phone-number-input";

const PhoneNumberInput = ({ phoneNumber, setPhoneNumber }) => {
  return (
    <View style={styles.container}>
      <PhoneInput
        defaultValue={phoneNumber}
        defaultCode="DZ"
        withShadow
        containerStyle={styles.field}
        textContainerStyle={styles.input}
        onChangeFormattedText={(text) => setPhoneNumber(text)}
        withDarkTheme
      />
    </View>
  );
};

export default PhoneNumberInput;

const styles = StyleSheet.create({
  container: {
    marginTop: 7,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  field: {
    width: "100%",
    borderRadius: 20,
  },
  input: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#F3F2F2",
  },
});
