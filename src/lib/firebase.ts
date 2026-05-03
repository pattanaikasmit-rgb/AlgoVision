import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCP5xHDImY4oBvVlPISwCwHornGu3piHs4",
  authDomain: "algovision-67d66.firebaseapp.com",
  projectId: "algovision-67d66",
  storageBucket: "algovision-67d66.firebasestorage.app",
  messagingSenderId: "528078903298",
  appId: "1:528078903298:web:acb5172c657186a7d0af1b",
  measurementId: "G-HJLK3C34HH"
};

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
