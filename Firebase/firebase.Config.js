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
  apiKey: "AIzaSyB6nokx86DHWEClnuIw9kXpF89qgE4gt1k",
  authDomain: "samirest-grill-alpha.firebaseapp.com",
  projectId: "samirest-grill-alpha",
  storageBucket: "samirest-grill-alpha.appspot.com",
  messagingSenderId: "671197766386",
  appId: "1:671197766386:web:5d29bedc439a79f285e66b",
  measurementId: "G-KQRPW5XEZJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { db, storage, auth };
