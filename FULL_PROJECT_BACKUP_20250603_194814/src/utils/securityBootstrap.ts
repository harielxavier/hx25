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
      "img-src 'self' https://*.cloudinary.com data: blob:",
      // Define script sources
      "script-src 'self' https://www.googletagmanager.com",
      // Define style sources
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Define font sources
      "font-src 'self' https://fonts.gstatic.com",
      // Define connect sources for API, Firestore, etc.
      "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com",
      // Frame sources for embedded content
      "frame-src 'self' https://*.firebaseapp.com",
      // Object sources
      "object-src 'none'",
      // Media sources
      "media-src 'self' https://*.cloudinary.com",
      // Form action destinations
      "form-action 'self'"
    ].join('; ');
    
    // Add meta tag to head
    document.head.appendChild(meta);
  }
}

export default { initializeSecurity };
