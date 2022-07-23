import * as Notifications from "expo-notifications";
import Device from "expo-device";
import { Linking, Platform } from "react-native";
//import { Expo } from 'expo-server-sdk';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

//static option for HTTP notification sending
const headers = {
  Accept: "application/json",
  "Accept-Encoding": "gzip, deflate",
  "Content-Type": "application/json",
};

export async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  //console.log(token);

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

//send notification to an array of tokens
export const sendPushNotification = async (batch) => {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(batch),
  })
    .then((response) => response.json())
    .then(({ data }) => {
      if (data) {
        //console.log(data);
        const ids = data.map((res) => {
          if (res.id) {
            const id = res.id;
            return id;
          }
        });

        {
          ids ? confirmationOfPushNotifucation(ids) : "";
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

//follow up request to make sure our notification was send succefully

const confirmationOfPushNotifucation = async (ids) => {
  //console.log(ids)
  await fetch("https://exp.host/--/api/v2/push/getReceipts", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      ids: ids,
    }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      //.log(responseJson);
    })
    .catch((error) => {
      console.log(error);
    });
};

//local scheduled notification
export const sendLocalNotification = (title, topic) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      sound: "default",
      body: topic,
    },
    trigger: {
      seconds: 3,
    },
  });
};
