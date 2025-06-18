import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration using Vite environment variables
// Ensure these are set in your .env file (e.g., .env.local)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Basic check to ensure config values are loaded
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase configuration is missing. Ensure VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID (and others) are set in your .env file.");
  // Optionally, throw an error or display a message to the user in development
  if (import.meta.env.DEV) {
    alert("Firebase configuration is missing. Please check your .env file and console for details.");
  }
}

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
