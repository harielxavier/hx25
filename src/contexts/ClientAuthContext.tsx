import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, User } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface ClientUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

interface ClientAuthContextType {
  user: ClientUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function fetchUserProfile(firebaseUser: User) {
    try {
      // Check if user is a client
      const clientsRef = collection(db, 'client_users');
      const q = query(clientsRef, where('email', '==', firebaseUser.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const clientData = querySnapshot.docs[0].data();
        setUser({
          id: firebaseUser.uid,
          firstName: clientData.first_name || clientData.firstName || '',
          lastName: clientData.last_name || clientData.lastName || '',
          email: firebaseUser.email || '',
          role: 'client'
        });
      } else {
        // If not found in client_users, check if they're an admin
        const adminRef = doc(db, 'admin_users', firebaseUser.uid);
        const adminSnap = await getDoc(adminRef);
        
        if (adminSnap.exists()) {
          const adminData = adminSnap.data();
          setUser({
            id: firebaseUser.uid,
            firstName: adminData.first_name || adminData.firstName || '',
            lastName: adminData.last_name || adminData.lastName || '',
            email: firebaseUser.email || '',
            role: 'admin'
          });
        } else {
          // User exists in Firebase but not in our database
          console.warn('User exists in Firebase but not in our database:', firebaseUser.email);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Error fetching user profile');
      setUser(null);
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get the JWT token for API requests
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('token', token);
      
      // Store refresh token
      const refreshToken = firebaseUser.refreshToken;
      localStorage.setItem('refreshToken', refreshToken);

      // Fetch user profile from Firestore
      await fetchUserProfile(firebaseUser);
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      // Get current user
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      // Force token refresh
      const newToken = await currentUser.getIdToken(true);
      localStorage.setItem('token', newToken);
      return newToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      setError('Failed to refresh authentication');
      return null;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Error signing out');
    }
  };

  return (
    <ClientAuthContext.Provider value={{ user, loading, error, login, logout, refreshToken }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
}