// This is a debug configuration file to help diagnose Firebase initialization issues
import { initializeApp, FirebaseApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Define a type for our services
export interface FirebaseServices {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
  initialized: boolean;
}

// Declare variables at the module level with proper types
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;
let initialized = false;

// Use a try-catch block to handle any initialization errors
try {
  console.log('Starting Firebase initialization in debug mode');
  
  // Check if we're in a browser preview environment
  const isBrowserPreview = typeof window !== 'undefined' && 
    (window.location.hostname === '127.0.0.1' || 
     window.location.hostname.includes('localhost'));
  
  console.log('Browser environment detected:', isBrowserPreview ? 'preview/local' : 'production');
  
  const firebaseConfig = {
    apiKey: "AIzaSyA72zzmJF4MA_HrAb-3dOaO82Rbbh2pSVQ",
    authDomain: "harielxavierphotography-79f68.firebaseapp.com",
    projectId: "harielxavierphotography-79f68",
    storageBucket: "harielxavierphotography-79f68.firebasestorage.app",
    messagingSenderId: "1037839898187",
    appId: "1:1037839898187:web:16e7d37058b5fbb8409fce",
    measurementId: "G-F4Z0Y39GBZ"
  };

  console.log('Firebase config loaded:', firebaseConfig);
  
  // Initialize Firebase with error handling - check if app already exists
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log('Firebase app initialized successfully');
    } else {
      app = getApp();
      console.log('Using existing Firebase app instance');
    }
  } catch (appError) {
    console.error('Firebase app initialization error:', appError);
    app = null;
  }
  
  // Initialize services with error handling and timeouts to prevent blocking
  try {
    db = getFirestore(app);
    console.log('Firestore initialized successfully');
  } catch (dbError) {
    console.error('Firestore initialization error:', dbError);
    db = null;
  }
  
  try {
    auth = getAuth(app);
    console.log('Firebase Auth initialized successfully');
  } catch (authError) {
    console.error('Firebase Auth initialization error:', authError);
    auth = null;
  }
  
  try {
    storage = getStorage(app);
    console.log('Firebase Storage initialized successfully');
  } catch (storageError) {
    console.error('Firebase Storage initialization error:', storageError);
    storage = null;
  }
  
  initialized = true;
  console.log('Firebase services initialized successfully');
  
} catch (error) {
  console.error('FIREBASE INITIALIZATION ERROR:', error);
  // Create fallback exports to prevent app from crashing
  app = null;
  db = null;
  auth = null;
  storage = null;
  initialized = false;
  
  console.log('Created dummy Firebase services to prevent crashes');
}

// Create a services object that can be used throughout the app
export const debugFirebaseServices: FirebaseServices = {
  app,
  db,
  auth,
  storage,
  initialized
};

// Also export individual services for backward compatibility
export { app, db, auth, storage };
