import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // Add storage if needed

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADWHMSFjymx4atQqUOnH0L1JgpU3Ybbks",
  authDomain: "halthapp-8c746.firebaseapp.com",
  projectId: "halthapp-8c746",
  storageBucket: "halthapp-8c746.firebasestorage.app",
  messagingSenderId: "499246299584",
  appId: "1:499246299584:web:bff4330503ced0b450f025",
  measurementId: "G-TF9RDTT73W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);  // Add this if you are using Firebase Storage

export { auth, db, storage };  // Export services you need
