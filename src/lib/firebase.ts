// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "predictai-7fhz5",
  "appId": "1:549620420833:web:7172bcacc75a5ecb1de7a0",
  "storageBucket": "predictai-7fhz5.appspot.com",
  "apiKey": "AIzaSyBzQKLu9RaqTo66uiIXrCDL8aLECfOjva8",
  "authDomain": "predictai-7fhz5.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "549620420833"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
