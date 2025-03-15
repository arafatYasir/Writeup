// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIap1t60toJkkraWXFRSfxfNN1aIoKQQ0",
  authDomain: "writeup-87bd0.firebaseapp.com",
  projectId: "writeup-87bd0",
  storageBucket: "writeup-87bd0.firebasestorage.app",
  messagingSenderId: "495487296745",
  appId: "1:495487296745:web:3c692e9215e52947bf3c78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;