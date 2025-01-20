import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBT1XSU9ZyetFYK9pcHOB5k3W2RXTQ8Za4",

  authDomain: "blockchain-explorer-9fccd.firebaseapp.com",

  projectId: "blockchain-explorer-9fccd",

  storageBucket: "blockchain-explorer-9fccd.firebasestorage.app",

  messagingSenderId: "895311210077",

  appId: "1:895311210077:web:1e8cd17d8e0fb991ea4fb4",

  measurementId: "G-RC3WGE9YSR",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };
