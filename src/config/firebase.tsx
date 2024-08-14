import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLg_LEzkkQnnd0_XxQl3Ni4cywFKAtm-U",
  authDomain: "callvideo-f389c.firebaseapp.com",
  databaseURL: "https://callvideo-f389c-default-rtdb.firebaseio.com",
  projectId: "callvideo-f389c",
  storageBucket: "callvideo-f389c.appspot.com",
  messagingSenderId: "704785985806",
  appId: "1:704785985806:web:83b192b624d650caaa275f",
  measurementId: "G-LSNFPCZ9EG",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { database,firestore};
