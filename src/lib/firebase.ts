import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration for harielxavierphotography-18d17 project
const firebaseConfig = {
  apiKey: "AIzaSyAXW2TqnlSymyfdZULM4NN3gfSG_imcv0U",
  authDomain: "harielxavierphotography-18d17.firebaseapp.com",
  projectId: "harielxavierphotography-18d17",
  storageBucket: "harielxavierphotography-18d17.firebasestorage.app",
  messagingSenderId: "195040006099",
  appId: "1:195040006099:web:4d670ea2b5d859ab606926",
  measurementId: "G-SB0Q9ER7KW"
};

// Initialize Firebase - prevent duplicate app instances
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally (it may not be supported in all environments)
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

// Export the app instance for other uses if needed
export default app;