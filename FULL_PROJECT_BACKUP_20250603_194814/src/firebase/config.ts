import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: "AIzaSyAXW2TqnlSymyfdZULM4NN3gfSG_imcv0U",
  authDomain: "harielxavierphotography-18d17.firebaseapp.com",
  projectId: "harielxavierphotography-18d17",
  storageBucket: "harielxavierphotography-18d17.firebasestorage.app",
  messagingSenderId: "195040006099",
  appId: "1:195040006099:web:4d670ea2b5d859ab606926",
  measurementId: "G-SB0Q9ER7KW"
};

// Initialize Firebase - check if app already exists
let app: ReturnType<typeof initializeApp>;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully in config.ts');
} else {
  app = getApp();
  console.log('Using existing Firebase app instance in config.ts');
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log('Auth persistence set to LOCAL'))
  .catch(error => console.error('Error setting auth persistence:', error));

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firebase Functions
const functions = getFunctions(app);

// Initialize Analytics with error handling
let analytics: ReturnType<typeof getAnalytics> | null = null;
const initAnalytics = async () => {
  try {
    const isAnalyticsSupported = await isSupported();
    if (isAnalyticsSupported) {
      analytics = getAnalytics(app);
      console.log('Analytics initialized successfully');
    } else {
      console.log('Analytics not supported in this environment');
    }
  } catch (error) {
    console.error('Error initializing analytics:', error);
    // Continue without analytics
  }
};
initAnalytics();

// Remove any emulator warning banners that might be present
setTimeout(() => {
  const warning = document.querySelector('.firebase-emulator-warning');
  if (warning) {
    warning.remove();
  }
}, 1000);

export { app, db, auth, storage, functions, analytics };
