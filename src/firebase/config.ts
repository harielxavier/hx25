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
const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

if (!isFirebaseConfigured) {
  console.log("✅ Firebase DISABLED - Using Supabase only");
}

// Initialize Firebase only if configured - check if app already exists
let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;
let functions: ReturnType<typeof getFunctions> | null = null;

if (isFirebaseConfigured) {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully in config.ts');
  } else {
    app = getApp();
    console.log('Using existing Firebase app instance in config.ts');
  }

  // Initialize Firestore
  db = getFirestore(app);

  // Initialize Firebase Auth with persistence
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence)
    .then(() => console.log('Auth persistence set to LOCAL'))
    .catch(error => console.error('Error setting auth persistence:', error));

  // Initialize Firebase Storage
  storage = getStorage(app);

  // Initialize Firebase Functions
  functions = getFunctions(app);
}

// Initialize Analytics with error handling (only if Firebase is configured)
let analytics: ReturnType<typeof getAnalytics> | null = null;
const initAnalytics = async () => {
  if (!app || !isFirebaseConfigured) {
    console.log('Skipping analytics initialization - Firebase not configured');
    return;
  }
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

// Export with non-null assertions for services that depend on Firebase
// If Firebase isn't configured, services won't work but won't crash at import
export { app, db, auth, storage, functions, analytics };

// For services that need guaranteed non-null exports
export const guaranteedApp = app!;
export const guaranteedDb = db!;
export const guaranteedStorage = storage!;
