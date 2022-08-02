import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const SecurityDetails = ({ navigation, route }) => {
  const { detail, imageUrl, title } = route.params.tip;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: imageUrl && imageUrl,
          }}
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.header}>{title}</Text>
        <Text style={styles.details}>{detail}</Text>
      </View>
    </View>
  );
};

export default SecurityDetails;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  detailsContainer: {
    marginTop: 20,
  },
  header: {
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 24,
    fontWeight: "bold",
    color: "#8CB8B9",
  },
  details: {
    marginVertical: 15,
    textAlign: "center",
    fontSize: 15,
    fontStyle: "italic",
    color: "#7f7f7f",
  },
  imageContainer: {
    margin: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 200,
  },
});
