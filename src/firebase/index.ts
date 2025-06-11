// Import from our debug configuration
import { debugFirebaseServices, app, db, auth, storage } from './debug-config';
import { getAnalytics, Analytics } from "firebase/analytics";

// Try to initialize analytics if possible, but only if Firebase app was initialized
let analytics: Analytics | null = null;

try {
  if (debugFirebaseServices.app) {
    console.log('Attempting to initialize analytics...');
    analytics = getAnalytics(debugFirebaseServices.app);
    console.log('Analytics initialized successfully');
  } else {
    console.log('Skipping analytics initialization because Firebase app is not available');
  }
} catch (error) {
  console.error('Error initializing analytics:', error);
  analytics = null;
}

// Export all Firebase services
export { db, analytics, auth, storage, app, debugFirebaseServices };
