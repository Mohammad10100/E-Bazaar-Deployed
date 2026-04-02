import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyByM5BOEIhDcRfJpTlNpMDpvC5q-4k-TAA",
//   authDomain: "ebazaar-final.firebaseapp.com",
//   projectId: "ebazaar-final",
//   storageBucket: "ebazaar-final.appspot.com",
//   messagingSenderId: "193130422804",
//   appId: "1:193130422804:web:325f0d99a3089e1c80bd01"
// };
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app)


