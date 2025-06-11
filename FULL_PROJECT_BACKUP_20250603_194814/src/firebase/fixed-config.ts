import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Use the correct Firebase configuration
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
let app;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  } else {
    app = getApp();
    console.log('Using existing Firebase app instance');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create a fallback app object to prevent crashes
  app = {} as any;
}

// Initialize Firestore with error handling
let db;
try {
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Firestore initialization error:', error);
  // Create a fallback db object to prevent crashes
  db = {
    collection: () => ({}),
    doc: () => ({})
  } as any;
}

// Initialize Firebase Auth with persistence and error handling
let auth;
try {
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence)
    .then(() => console.log('Auth persistence set to LOCAL'))
    .catch(error => console.error('Error setting auth persistence:', error));
  console.log('Firebase Auth initialized successfully');
} catch (error) {
  console.error('Firebase Auth initialization error:', error);
  // Create a fallback auth object to prevent crashes
  auth = {
    onAuthStateChanged: () => () => {},
    signInWithEmailAndPassword: () => Promise.resolve({} as any),
    signOut: () => Promise.resolve()
  } as any;
}

// Initialize Firebase Storage with error handling
let storage;
try {
  storage = getStorage(app);
  console.log('Firebase Storage initialized successfully');
} catch (error) {
  console.error('Firebase Storage initialization error:', error);
  // Create a fallback storage object to prevent crashes
  storage = {} as any;
}

// Initialize Firebase Functions with error handling
let functions;
try {
  functions = getFunctions(app);
  console.log('Firebase Functions initialized successfully');
} catch (error) {
  console.error('Firebase Functions initialization error:', error);
  // Create a fallback functions object to prevent crashes
  functions = {} as any;
}

// Initialize Analytics with error handling
let analytics = null;
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

// Initialize analytics asynchronously
initAnalytics();

// Remove any emulator warning banners that might be present
setTimeout(() => {
  const warning = document.querySelector('.firebase-emulator-warning');
  if (warning) {
    warning.remove();
  }
}, 1000);

export { app, db, auth, storage, functions, analytics };
