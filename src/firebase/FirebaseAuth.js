// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBz3IceaUc9O59Qh2rCHnsm498GdDsB7vA",
  authDomain: "shopco84.firebaseapp.com",
  projectId: "shopco84",
  storageBucket: "shopco84.firebasestorage.app",
  messagingSenderId: "1084634622326",
  appId: "1:1084634622326:web:416d3f800d0eb2bf65f257",
  measurementId: "G-GR7W7MCLS2"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth()
const provider = new GoogleAuthProvider()

export { auth,provider}