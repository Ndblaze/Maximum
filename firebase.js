// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGNUVymtspSY1cIx0diKE3_Ow9ysBfb-U",
  authDomain: "max-chat-app-bbd6f.firebaseapp.com",
  projectId: "max-chat-app-bbd6f",
  storageBucket: "max-chat-app-bbd6f.appspot.com",
  messagingSenderId: "277610712584",
  appId: "1:277610712584:web:ba72755db7809885e3cbbd",
};

// Initialize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
