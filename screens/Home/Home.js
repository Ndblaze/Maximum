import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";

const Sections = ({ sectionsArray }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.division}>
      {sectionsArray.map((room) => (
        <>
          <View style={styles.divisionTitleContainer}>
            <Text style={styles.divisionTitle}> {room.title} </Text>
          </View>
          {room.chartRoomTitle.map((chats) => (
            <Text
              onPress={() =>
                navigation.navigate("Messaging", { title: "#" + "  " + chats })
              }
              style={styles.divisionRoom}
            >
              # {"   "}
              {chats}
            </Text>
          ))}
        </>
      ))}
    </View>
  );
};

const Home = ({ navigation }) => {
  //Admin room list details
  const [adminRoomList, setAdminRoomList] = useState([
    {
      title: "Mentions",
      nameDB: "announcements",
      chartRoomTitle: ["announcements"],
    },
  ]);
  const [mattersRoomList, setMattersRoomList] = useState([
    {
      title: "Matters-on-groung",
      nameDB: "MattersOnGround",
      chartRoomTitle: ["boys-are-scum"],
    },
  ]);
  const [hotSpotRoomList, setHotSpotRoomList] = useState([
    {
      title: "Hot-spots",
      nameDB: "HotSpots",
      chartRoomTitle: [
        "Bejaia",
        "Boumerdes",
        "Oran",
        "Tizi",
        "Constantine",
        "Mostaganem",
      ],
    },
  ]);

  return (
    <View style={styles.screen}>
      <View style={styles.headerNav}>
        <Image
          style={styles.image}
          source={require("../../assets/LogoIMG.png")}
        />
        <Text style={styles.max}>max-im-um</Text>
      </View>

      <View style={styles.mainContent}>
        <Sections sectionsArray={adminRoomList} />
        <Sections sectionsArray={mattersRoomList} />
        <Sections sectionsArray={hotSpotRoomList} />
      </View>
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
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    height: 35,
    width: 40,
  },
  max: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 2,
    color: "#fff",
  },
  mainContent: {
    marginTop: 40,
    paddingLeft: 10,
    paddingRight: 10,
  },
  division: {
    marginBottom: 20,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderBottomColor: "#F5F5F5",
  },
  divisionTitleContainer: {},
  divisionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  divisionRoom: {
    fontSize: 18,
    fontWeight: "600",
    color: "#c4c4c4",
    paddingTop: 20,
    paddingLeft: 30,
  },
});
