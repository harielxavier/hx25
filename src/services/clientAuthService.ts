import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  UserCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Client } from './clientGalleryService';

/**
 * Client Authentication Service
 * 
 * This service handles authentication specifically for client gallery access,
 * including specialized functions for gallery access codes and temporary access.
 */

// Interface for client login response
export interface ClientLoginResponse {
  user: UserCredential['user'];
  client: Client;
  token: string;
  isNewUser: boolean;
}

/**
 * Login with email and password
 * 
 * @param email - Client email
 * @param password - Client password
 * @returns Client login response
 */
export const clientLogin = async (
  email: string, 
  password: string
): Promise<ClientLoginResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get the JWT token for API requests
    const token = await user.getIdToken();
    
    // Get client data from Firestore
    const clientDoc = await getDoc(doc(db, 'clients', user.uid));
    
    if (!clientDoc.exists()) {
      throw new Error('Client profile not found');
    }
    
    const clientData = clientDoc.data() as Client;
    
    // Update last login timestamp
    await updateDoc(doc(db, 'clients', user.uid), {
      lastLoginAt: serverTimestamp()
    });
    
    // Store tokens in localStorage
    localStorage.setItem('clientToken', token);
    localStorage.setItem('clientId', user.uid);
    
    return {
      user,
      client: {
        id: user.uid,
        ...clientData
      } as Client,
      token,
      isNewUser: false
    };
  } catch (error) {
    console.error('Client login error:', error);
    throw error;
  }
};

/**
 * Register a new client
 * 
 * @param email - Client email
 * @param password - Client password
 * @param clientData - Client data
 * @returns Client login response
 */
export const registerClient = async (
  email: string,
  password: string,
  clientData: Partial<Client>
): Promise<ClientLoginResponse> => {
  try {
    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Get the JWT token
    const token = await user.getIdToken();
    
    // Create client profile in Firestore
    const newClient: Partial<Client> = {
      email: email,
      name: clientData.name || '',
      phone: clientData.phone || '',
      galleries: clientData.galleries || [],
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      lastLoginAt: serverTimestamp() as any
    };
    
    await setDoc(doc(db, 'clients', user.uid), newClient);
    
    // Store tokens in localStorage
    localStorage.setItem('clientToken', token);
    localStorage.setItem('clientId', user.uid);
    
    return {
      user,
      client: {
        id: user.uid,
        ...newClient
      } as Client,
      token,
      isNewUser: true
    };
  } catch (error) {
    console.error('Client registration error:', error);
    throw error;
  }
};

/**
 * Logout client
 */
export const clientLogout = async (): Promise<void> => {
  try {
    // Remove tokens from localStorage
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientId');
    
    // Sign out from Firebase
    await signOut(auth);
  } catch (error) {
    console.error('Client logout error:', error);
    throw error;
  }
};

/**
 * Reset client password
 * 
 * @param email - Client email
 */
export const resetClientPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

/**
 * Verify client token
 * 
 * @returns Boolean indicating if token is valid
 */
export const verifyClientToken = async (): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    
    // This will throw an error if the token is invalid
    await currentUser.getIdToken(true);
    
    // Check if client profile exists
    const clientDoc = await getDoc(doc(db, 'clients', currentUser.uid));
    return clientDoc.exists();
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

/**
 * Get current client
 * 
 * @returns Client data or null if not logged in
 */
export const getCurrentClient = async (): Promise<Client | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    
    const clientDoc = await getDoc(doc(db, 'clients', currentUser.uid));
    
    if (!clientDoc.exists()) {
      return null;
    }
    
    return {
      id: currentUser.uid,
      ...clientDoc.data()
    } as Client;
  } catch (error) {
    console.error('Error getting current client:', error);
    return null;
  }
};

/**
 * Access gallery with access code
 * 
 * @param galleryId - Gallery ID
 * @param accessCode - Access code
 * @returns Client login response if successful
 */
export const accessGalleryWithCode = async (
  galleryId: string,
  accessCode: string
): Promise<{ 
  success: boolean; 
  clientId?: string; 
  message?: string;
  redirectUrl?: string;
}> => {
  try {
    // Import the verification function from clientGalleryService
    // to avoid circular dependencies
    const { verifyGalleryAccessCode } = await import('./clientGalleryService');
    
    // Verify the access code
    const clientId = await verifyGalleryAccessCode(galleryId, accessCode);
    
    if (!clientId) {
      return { 
        success: false, 
        message: 'Invalid access code or expired access' 
      };
    }
    
    // Store the temporary access in session storage
    sessionStorage.setItem('tempGalleryAccess', JSON.stringify({
      galleryId,
      clientId,
      accessCode,
      timestamp: Date.now()
    }));
    
    return {
      success: true,
      clientId,
      redirectUrl: `/client/gallery/${galleryId}?code=${accessCode}`
    };
  } catch (error) {
    console.error('Error accessing gallery with code:', error);
    return {
      success: false,
      message: 'An error occurred while verifying access'
    };
  }
};

/**
 * Check if user has temporary access to a gallery
 * 
 * @param galleryId - Gallery ID
 * @returns Boolean indicating if user has temporary access
 */
export const hasTempGalleryAccess = (galleryId: string): boolean => {
  try {
    const tempAccess = sessionStorage.getItem('tempGalleryAccess');
    if (!tempAccess) return false;
    
    const accessData = JSON.parse(tempAccess);
    
    // Check if access is for the requested gallery and not expired (24 hours)
    const isValid = 
      accessData.galleryId === galleryId && 
      (Date.now() - accessData.timestamp) < 24 * 60 * 60 * 1000;
    
    return isValid;
  } catch (error) {
    console.error('Error checking temporary gallery access:', error);
    return false;
  }
};

export default {
  clientLogin,
  registerClient,
  clientLogout,
  resetClientPassword,
  verifyClientToken,
  getCurrentClient,
  accessGalleryWithCode,
  hasTempGalleryAccess
};
