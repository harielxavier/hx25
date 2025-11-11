// REMOVED FIREBASE: import { auth, db } from './firebase';
// REMOVED FIREBASE: imports
// REMOVED FIREBASE: imports
import QRCode from 'qrcode';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'client';
  has2fa?: boolean;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Determine collection based on email
    const isClient = email === 'forms@harielxavier.com';
    const collectionName = isClient ? 'client_users' : 'admin_users';
    
    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, collectionName, user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    const userData = userDoc.data();
    
    // Check if 2FA is enabled
    const twoFactorDoc = await getDoc(doc(db, 'user_2fa', user.uid));
    const has2fa = twoFactorDoc.exists() ? twoFactorDoc.data().is_enabled : false;
    
    return {
      id: user.uid,
      email: user.email!,
      firstName: userData.first_name || userData.full_name?.split(' ')[0],
      lastName: userData.last_name || userData.full_name?.split(' ')[1],
      role: isClient ? 'client' : 'admin',
      has2fa
    };
  } catch (error) {
    throw error;
  }
}

export async function signUp(email: string, password: string, firstName: string, lastName: string): Promise<AuthUser> {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create client user profile in Firestore
    await setDoc(doc(db, 'client_users', user.uid), {
      id: user.uid,
      email,
      first_name: firstName,
      last_name: lastName,
      created_at: new Date().toISOString()
    });
    
    return {
      id: user.uid,
      email,
      firstName,
      lastName,
      role: 'client'
    };
  } catch (error) {
    throw error;
  }
}

export async function setup2FA(): Promise<TwoFactorSetup> {
  try {
    // In a real app, generate a secure secret
    const secret = 'JBSWY3DPEHPK3PXP'; // In production, generate this securely
    
    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    
    // Store in Firestore
    if (auth.currentUser) {
      await setDoc(doc(db, 'user_2fa', auth.currentUser.uid), {
        secret,
        backup_codes: backupCodes,
        is_enabled: true,
        created_at: new Date().toISOString()
      });
    }
    
    // Generate QR code
    const otpAuthUrl = `otpauth://totp/PhotoCRM:${encodeURIComponent(auth.currentUser?.email || 'user@example.com')}?secret=${secret}&issuer=PhotoCRM`;
    const qrCode = await QRCode.toDataURL(otpAuthUrl);
    
    return {
      secret,
      qrCode,
      backupCodes
    };
  } catch (error) {
    throw error;
  }
}

export async function verify2FACode(code: string): Promise<boolean> {
  try {
    // In a real app, implement TOTP verification logic
    // This is a placeholder implementation
    if (!auth.currentUser) return false;
    
    // Get the user's 2FA secret from Firestore
    const twoFactorDoc = await getDoc(doc(db, 'user_2fa', auth.currentUser.uid));
    
    if (!twoFactorDoc.exists()) return false;
    
    // For demo purposes, accept any 6-digit code
    // In production, use a proper TOTP library to verify the code
    return code.length === 6 && /^\d+$/.test(code);
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/reset-password`
    });
  } catch (error) {
    throw error;
  }
}

export async function updatePassword(newPassword: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    
    await firebaseUpdatePassword(user, newPassword);
  } catch (error) {
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    const user = auth.currentUser;
    if (user) {
      // Update session status in Firestore
      const sessionsQuery = query(
        collection(db, 'user_sessions'),
        where('user_id', '==', user.uid)
      );
      
      const sessionDocs = await getDocs(sessionsQuery);
      const updatePromises = sessionDocs.docs.map(sessionDoc => 
        updateDoc(doc(db, 'user_sessions', sessionDoc.id), { is_valid: false })
      );
      
      await Promise.all(updatePromises);
    }
    
    // Sign out from Firebase
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    return user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};
