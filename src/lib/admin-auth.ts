// REMOVED FIREBASE: import { adminAuth } from './firebase-admin';

/**
 * Verifies a Firebase ID token
 * @param idToken The ID token to verify
 * @returns The decoded token if valid, null otherwise
 */
export async function verifyIdToken(idToken: string) {
  try {
    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
}

/**
 * Gets a user by their UID
 * @param uid The user's UID
 * @returns The user record if found, null otherwise
 */
export async function getUserByUid(uid: string) {
  try {
    const userRecord = await adminAuth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Creates a custom token for a user
 * @param uid The user's UID
 * @param claims Optional custom claims to include in the token
 * @returns The custom token if successful, null otherwise
 */
export async function createCustomToken(uid: string, claims?: Record<string, any>) {
  try {
    const customToken = await adminAuth.createCustomToken(uid, claims);
    return customToken;
  } catch (error) {
    console.error('Error creating custom token:', error);
    return null;
  }
}

/**
 * Sets custom user claims
 * @param uid The user's UID
 * @param claims The custom claims to set
 * @returns True if successful, false otherwise
 */
export async function setCustomUserClaims(uid: string, claims: Record<string, any>) {
  try {
    await adminAuth.setCustomUserClaims(uid, claims);
    return true;
  } catch (error) {
    console.error('Error setting custom user claims:', error);
    return false;
  }
}
