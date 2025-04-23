// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-tMFexFekuex2TMGtMuiI6_pZw1fmdj0",
  authDomain: "online-store-98f5f.firebaseapp.com",
  projectId: "online-store-98f5f",
  storageBucket: "online-store-98f5f.appspot.com",
  messagingSenderId: "125641843923",
  appId: "1:125641843923:web:a506285cbbd6b3dd59a026",
  measurementId: "G-CBS3TLPCGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);