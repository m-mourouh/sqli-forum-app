import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
  getFirestore,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import {getStorage} from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBgWD4bWalIbx8ys3ShLrBEj2dAHblD-Ek",
  authDomain: "sqli-16f9c.firebaseapp.com",
  projectId: "sqli-16f9c",
  storageBucket: "sqli-16f9c.appspot.com",
  messagingSenderId: "510689944571",
  appId: "1:510689944571:web:67ce48d47191284f9de15e"
};
// initialize firebase
const app = initializeApp(firebaseConfig);
// authentication service
const auth = getAuth();
// firestore service
const db = getFirestore(app);
const storage = getStorage(app);
export {
  auth,
  db,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  storage
};
