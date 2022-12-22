import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBWjDQEiYKdQbQNvoiVvvOn_cbufQzvWuo",
  authDomain: "collabmates-beta.firebaseapp.com",
  databaseURL: "https://collabmates-beta.firebaseio.com",
  projectId: "collabmates-beta",
  storageBucket: "collabmates-beta.appspot.com",
  messagingSenderId: "983690302378",
  appId: "1:983690302378:web:b2fa2c58f2351d5c1b91d3",
  measurementId: "G-R2PXYC9F4S",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
