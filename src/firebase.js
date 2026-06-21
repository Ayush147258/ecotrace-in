import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYTVQPcrPlRa8e3cJyR1rU_iVPYP56kLo",
  authDomain: "ecotracein.firebaseapp.com",
  projectId: "ecotracein",
  storageBucket: "ecotracein.firebasestorage.app",
  messagingSenderId: "693563699489",
  appId: "1:693563699489:web:635e01079881b7c8bb0e60",
  measurementId: "G-GL5EWBBVPT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
