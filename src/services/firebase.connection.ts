
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"



const firebaseConfig = {
  apiKey: "AIzaSyBcjgaHx5js3O1S2Nh8-47b-Cs-2v5Hm64",
  authDomain: "mylink-8a758.firebaseapp.com",
  projectId: "mylink-8a758",
  storageBucket: "mylink-8a758.firebasestorage.app",
  messagingSenderId: "1045006885072",
  appId: "1:1045006885072:web:30c96f8538890c8b6cfed5",
  measurementId: "G-6EWTQM0BVN"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app)
const analytics = getAnalytics(app);

export { auth, db, analytics } 