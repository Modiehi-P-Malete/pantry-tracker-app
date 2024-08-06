// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXvDOncWvTwz3FLrztmfMvDxC2Z4Qixgo",
  authDomain: "pantry-tracker-app-99e99.firebaseapp.com",
  projectId: "pantry-tracker-app-99e99",
  storageBucket: "pantry-tracker-app-99e99.appspot.com",
  messagingSenderId: "9093090093",
  appId: "1:9093090093:web:b1fd930042d03f67d761a4",
  measurementId: "G-728MFLJMXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };