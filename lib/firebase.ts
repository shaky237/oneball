import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjzy_KYIFrYa6Ayv6567lj8584TGs7fkE",
  authDomain: "oneball-ebcbc.firebaseapp.com",
  projectId: "oneball-ebcbc",
  storageBucket: "oneball-ebcbc.firebasestorage.app",
  messagingSenderId: "853161015572",
  appId: "1:853161015572:web:f469af713236277702aa01",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);