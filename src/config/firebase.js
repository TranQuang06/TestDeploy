// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMBkxWWbJrmz2FYQBYRy-qOnJBulNcefU",
  authDomain: "superstars-49da9.firebaseapp.com",
  projectId: "superstars-49da9",
  storageBucket: "superstars-49da9.firebasestorage.app",
  messagingSenderId: "72925985616",
  appId: "1:72925985616:web:0740f7f12ac3673f38ca55",
  measurementId: "G-GXK40X1PXL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Analytics (optional, with browser check)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;
