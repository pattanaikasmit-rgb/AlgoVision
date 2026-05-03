import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCP5xHDImY4oBvVlPISwCwHornGu3piHs4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "algovision-67d66.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "algovision-67d66",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "algovision-67d66.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "528078903298",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:528078903298:web:acb5172c657186a7d0af1b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HJLK3C34HH"
};

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
