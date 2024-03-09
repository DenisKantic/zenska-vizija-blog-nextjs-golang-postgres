import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBfUc-nbbmdQGfgZgNWQMaRog1J9S9HK9s",
  authDomain: "zenska-vizija.firebaseapp.com",
  projectId: "zenska-vizija",
  storageBucket: "zenska-vizija.appspot.com",
  messagingSenderId: "184948142781",
  appId: "1:184948142781:web:fa464606f9874b68677dd4",
  measurementId: "G-FNJ09EF8NB"
};

// Initialize Firebase
const app = getApps().length? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app); // s obzirom da cemo koristiti auth, moramo ga importovati i upotrijebiti
const db = getFirestore(app);
const storage = getStorage(app);

export {app, auth, db, storage} // koristit cemo oba, "app" za samu inicijalizaciju sa firebase i "auth" za auth login