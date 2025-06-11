import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { signInWithGoogle as authServiceSignInWithGoogle } from '../services/authService';

interface AuthContextType {
  user: any;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set persistence to LOCAL to keep the user logged in
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log('Auth persistence set to LOCAL'))
      .catch(error => console.error('Error setting auth persistence:', error));
    
    // Check for redirect result on initial load
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Redirect sign-in result detected');
          // User is already set by onAuthStateChanged, no need to set here
        }
      } catch (error) {
        console.error('Error checking redirect result:', error);
      }
    };
    
    checkRedirectResult();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `User logged in: ${user.email}` : 'No user');
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log(`Attempting to sign in with email: ${email}`);
      
      // Trim email and ensure password is a string to prevent common errors
      const trimmedEmail = email.trim();
      const passwordStr = String(password);
      
      await signInWithEmailAndPassword(auth, trimmedEmail, passwordStr);
      console.log('Email sign-in successful');
      
      // Store user info in localStorage for token-based auth
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', auth.currentUser?.uid || '');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = 'Invalid email or password';
      
      if (error.code) {
        switch(error.code) {
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email. Please check your email or sign up.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed login attempts. Please try again later or reset your password.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled. Please contact support.';
            break;
          default:
            errorMessage = error.message || 'An error occurred during sign in';
        }
      }
      
      setError(errorMessage);
      throw error; // Rethrow to let the component handle it
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Attempting to sign in with Google using improved service');
      
      // Use the improved service function instead of direct Firebase call
      await authServiceSignInWithGoogle();
      
      console.log('Google sign-in initiated successfully');
      
      // Store user info in localStorage for token-based auth
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', auth.currentUser?.uid || '');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      
      let errorMessage = 'Failed to sign in with Google';
      
      // Provide more specific error messages based on the error code
      if (error.code) {
        switch(error.code) {
          case 'auth/popup-blocked':
            errorMessage = 'The sign-in popup was blocked. We\'ll try to redirect you to Google sign-in instead.';
            break;
          case 'auth/cancelled-popup-request':
            errorMessage = 'The sign-in was cancelled. Please try again.';
            break;
          case 'auth/unauthorized-domain':
            errorMessage = 'This domain is not authorized for sign-in. Please contact support.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'The authentication credential is invalid. Please try again.';
            break;
          default:
            errorMessage = error.message || 'Failed to sign in with Google';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error; // Rethrow to let the component handle it
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out');
      
      // First clear all authentication data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('user');
      
      // Then sign out from Firebase
      await firebaseSignOut(auth);
      console.log('Sign out successful');
      
      // Set user to null explicitly
      setUser(null);
      
      // Use window.location.replace instead of href to prevent history issues
      window.location.replace('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError(error.message || 'Error signing out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signInWithGoogle: handleGoogleSignIn,
    signOut: handleSignOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}