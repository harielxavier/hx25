/**
 * JWT Safeguard Utility
 * 
 * This module provides functions to verify JWT token configuration
 * and prevent application from running in production with insecure settings.
 */

// Check if environment variables are properly defined
function areJwtSecretsConfigured(): boolean {
  const accessSecret = import.meta.env.VITE_JWT_ACCESS_SECRET;
  const refreshSecret = import.meta.env.VITE_JWT_REFRESH_SECRET;
  
  return Boolean(accessSecret && refreshSecret);
}

// Check if tokens meet minimum security requirements
function areJwtSecretsSafe(): boolean {
  const accessSecret = import.meta.env.VITE_JWT_ACCESS_SECRET as string;
  const refreshSecret = import.meta.env.VITE_JWT_REFRESH_SECRET as string;
  
  // Both secrets should be at least 32 characters long
  const minLength = 32;
  
  if (!accessSecret || !refreshSecret) {
    return false;
  }
  
  if (accessSecret.length < minLength || refreshSecret.length < minLength) {
    return false;
  }
  
  // Secrets should not be the same
  if (accessSecret === refreshSecret) {
    return false;
  }
  
  // Secrets should not be the default values from .env.example
  if (accessSecret.includes('your-access-token-secret') || 
      refreshSecret.includes('your-refresh-token-secret')) {
    return false;
  }
  
  return true;
}

/**
 * Validates JWT configuration and throws error in production if not secure
 */
export function validateJwtConfiguration(): void {
  const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';
  
  // Only perform strict validation in production
  if (isProduction) {
    if (!areJwtSecretsConfigured()) {
      throw new Error(
        'CRITICAL SECURITY ERROR: JWT secrets not configured! ' +
        'You must set VITE_JWT_ACCESS_SECRET and VITE_JWT_REFRESH_SECRET in .env file.'
      );
    }
    
    if (!areJwtSecretsSafe()) {
      throw new Error(
        'CRITICAL SECURITY ERROR: JWT secrets do not meet security requirements! ' +
        'Both secrets must be at least 32 characters long, different from each other, ' +
        'and not using default values from .env.example.'
      );
    }
  } else {
    // In development, just log warnings
    if (!areJwtSecretsConfigured()) {
      console.warn(
        '⚠️ WARNING: JWT secrets not configured properly. ' +
        'This will cause an error in production.'
      );
    } else if (!areJwtSecretsSafe()) {
      console.warn(
        '⚠️ WARNING: JWT secrets do not meet security requirements. ' +
        'This will cause an error in production.'
      );
    }
  }
}

/**
 * Generates random secure JWT secrets
 * Use this for development or to help generate initial values
 */
export function generateSecureJwtSecrets(): { accessSecret: string, refreshSecret: string } {
  // Function to generate a random string of specified length
  const generateRandomString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
    return Array.from(
      { length }, 
      () => chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  };
  
  return {
    accessSecret: generateRandomString(48),
    refreshSecret: generateRandomString(48)
  };
}

export default {
  validateJwtConfiguration,
  generateSecureJwtSecrets,
  areJwtSecretsConfigured,
  areJwtSecretsSafe
};
