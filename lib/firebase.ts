// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtqIwMSqdTM-jUs1QYuBQTxveKZXsp1Qs",
  authDomain: "real-estate-d6154.firebaseapp.com",
  projectId: "real-estate-d6154",
  storageBucket: "real-estate-d6154.firebasestorage.app",
  messagingSenderId: "1016217054565",
  appId: "1:1016217054565:web:61ba77e33a4c68acf9858c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export { db, storage };