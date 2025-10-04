import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from "@sentry/react";
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import App from './App';
import './index.css';

// Import security bootstrap and logger
import { initializeSecurity } from './utils/securityBootstrap';
import logger from './utils/logger';

// Import Supabase client first (PRIMARY authentication)
import './lib/supabase';

// Import Firebase (needed for storage and legacy services only)
import './firebase/config';

// Initialize Sentry
const sentryDsn = import.meta.env.VITE_SENTRY_DSN_FRONTEND || "https://1fb81719800e469ccfc621e5f4b02e07@o4509517571620864.ingest.us.sentry.io/4509517580664832"; // Fallback to existing DSN if env var is not set

if (import.meta.env.VITE_SENTRY_DSN_FRONTEND) {
  console.log("Initializing Sentry with DSN from environment variable.");
} else if (sentryDsn) {
  console.warn("VITE_SENTRY_DSN_FRONTEND not set, using fallback Sentry DSN. Please set this in your .env file for production.");
} else {
  console.error("Sentry DSN is not configured. Sentry will not be initialized.");
}

if (sentryDsn && sentryDsn !== "YOUR_SENTRY_DSN_HERE") { // Ensure it's not the placeholder from .env.example
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Additional Replay configuration options can be set here
      maskAllText: false, // Example: Set to true to mask all text
      blockAllMedia: false, // Example: Set to true to block all media
    }),
    // Send console.log, console.error, and console.warn calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ["error", "warn", "log"] }), // Capturing log, warn, error
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions, adjust for production
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want this to be 100% while in development and adjust lower in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, sample the session when an error occurs.
  sendDefaultPii: true, // As per user's example
  _experiments: { // As per user's example
    enableLogs: true,
  },
  environment: import.meta.env.MODE, // 'development' or 'production'
  // release: "my-project-name@1.0.0", // Consider setting a release version
  });
  console.log("Sentry initialized for Frontend.");
}


// Initialize security features
try {
  initializeSecurity();
  logger.info('Security features initialized successfully');
} catch (error) {
  logger.error('Failed to initialize security features:', error);
  // Display a friendly error message in development
  if (!import.meta.env.PROD) {
    alert('Security configuration error: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

logger.log('Application initializing');

// Add global error handler for better debugging
window.addEventListener('error', (event) => {
  logger.error('GLOBAL ERROR CAUGHT:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('UNHANDLED PROMISE REJECTION:', event.reason);
});

// Get the root element
const rootElement = document.getElementById('root');

logger.debug('Root element found:', rootElement);

if (!rootElement) {
  logger.error('Root element not found!');
} else {
  try {
    logger.debug('Creating React root');
    const root = createRoot(rootElement);
    
    logger.debug('Rendering React application');
    
    // Force remove loading spinner
    setTimeout(() => {
      const spinner = document.querySelector('.loading-container');
      if (spinner) {
        spinner.remove();
        logger.info('Loading spinner removed');
      }
    }, 100);
    
    root.render(
      <StrictMode>
        <SupabaseAuthProvider>
          <App />
        </SupabaseAuthProvider>
      </StrictMode>
    );
    
    logger.info('Application rendered successfully');
  } catch (error) {
    logger.error('ERROR RENDERING REACT APP:', error);
    
    // Fallback rendering if React fails
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h1>Error Loading Application</h1>
        <p>There was a problem loading the application:</p>
        <pre style="background: #f8f8f8; padding: 10px; border-radius: 4px; overflow: auto;">${errorMessage}</pre>
        <button onclick="window.location.reload()">Refresh Page</button>
        <div style="margin-top: 20px; color: #666;">
          <p>If this error persists, please check the browser console for additional errors.</p>
        </div>
      </div>
    `;
  }
}
