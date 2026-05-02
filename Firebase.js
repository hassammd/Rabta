// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzwr41i5MVPFz_kT-jn8EmPLH8x5CBEp4",
  authDomain: "rabta-1fd16.firebaseapp.com",
  projectId: "rabta-1fd16",
  storageBucket: "rabta-1fd16.firebasestorage.app",
  messagingSenderId: "698650096580",
  appId: "1:698650096580:web:9e9fd63ddb14d2b3726a91",
  measurementId: "G-4THBBPPVRY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
