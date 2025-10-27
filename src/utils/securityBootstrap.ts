/**
 * Security Bootstrap Module
 * 
 * This module initializes various security features and performs
 * validation at application startup to ensure proper security configuration.
 */

import { validateJwtConfiguration } from './jwtSafeguard';
import { env } from './envManager';

/**
 * Initialize security features and validate configuration
 * This should be called early in the application bootstrap process
 */
export function initializeSecurity() {
  // Validate JWT configuration
  validateJwtConfiguration();
  
  // Validate required environment variables
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_JWT_ACCESS_SECRET',
    'VITE_JWT_REFRESH_SECRET'
  ];
  
  const { valid, missing } = env.validateRequiredVariables(requiredVars);
  if (!valid) {
    const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';
    
    if (isProduction) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    } else {
      console.warn(`⚠️ WARNING: Missing required environment variables: ${missing.join(', ')}`);
    }
  }
  
  // Add more security initializations as needed
  initializeContentSecurityPolicy();
}

/**
 * Setup Content Security Policy
 * This helps prevent XSS attacks by controlling which resources can be loaded
 */
function initializeContentSecurityPolicy() {
  // Only apply CSP in production
  const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';
  
  if (isProduction && typeof document !== 'undefined') {
    // Create meta element for CSP
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = [
      // Define default sources
      "default-src 'self'",
      // Allow images from self and Cloudinary
      "img-src 'self' https: data: blob:",
      // Define script sources
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://res.cloudinary.com https://*.supabase.co https://js.stripe.com https://cdn.curator.io https://*.curator.io https://maps.googleapis.com",
      // Define style sources
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://res.cloudinary.com https://cdn.curator.io",
      // Define font sources
      "font-src 'self' https://fonts.gstatic.com",
      // Define connect sources for API, Firestore, Supabase, Curator.io, etc.
      "connect-src 'self' https://www.google-analytics.com https://*.supabase.co https://api.stripe.com https://res.cloudinary.com https://ipapi.co https://*.ingest.us.sentry.io https://firebase.googleapis.com https://*.firebase.googleapis.com https://firebaseinstallations.googleapis.com https://maps.googleapis.com https://api.curator.io https://*.curator.io",
      // Frame sources for embedded content
      "frame-src 'self' https://js.stripe.com https://*.firebaseapp.com https://app.studioninja.co",
      // Object sources
      "object-src 'none'",
      // Media sources
      "media-src 'self' https://*.cloudinary.com https:",
      // Form action destinations
      "form-action 'self'"
    ].join('; ');
    
    // Add meta tag to head
    document.head.appendChild(meta);
  }
}

export default { initializeSecurity };
