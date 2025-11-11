import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
    // Listen for auth changes with Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: unknown, session: unknown) => {
      const typedSession = session as { user?: { id: string; email?: string } } | null;
      if (typedSession?.user) {
        await fetchUserProfile(typedSession.user.id, typedSession.user.email);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Check current session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email);
      }
      setLoading(false);
    };

    checkSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function fetchUserProfile(userId: string, email: string | undefined) {
    try {
      if (!email) throw new Error('No email provided');

      // Check if user is a client
      const { data: clientData, error: clientError } = await supabase
        .from('client_users')
        .select('*')
        .eq('email', email)
        .single();

      if (!clientError && clientData) {
        setUser({
          id: userId,
          firstName: clientData.first_name || '',
          lastName: clientData.last_name || '',
          email,
          role: 'client'
        });
      } else {
        // If not found in client_users, check if they're an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', userId)
          .single();

        if (!adminError && adminData) {
          setUser({
            id: userId,
            firstName: adminData.first_name || '',
            lastName: adminData.last_name || '',
            email,
            role: 'admin'
          });
        } else {
          console.warn('User exists in Supabase Auth but not in our database:', email);
          setUser(null);
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Error fetching user profile');
      setUser(null);
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Sign in with Supabase
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginError) throw loginError;
      if (!data.user) throw new Error('Login failed');

      // Store token for API requests (Supabase handles this, but we keep it for compatibility)
      if (data.session) {
        localStorage.setItem('token', data.session.access_token);
      }

      // Fetch user profile
      await fetchUserProfile(data.user.id, data.user.email);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid email or password';
      console.error('Login error:', err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      // Supabase handles token refresh automatically, but we can manually refresh if needed
      const { data, error } = await supabase.auth.refreshSession();

      if (error || !data.session) {
        throw error || new Error('No session');
      }

      localStorage.setItem('token', data.session.access_token);
      return data.session.access_token;
    } catch (err) {
      console.error('Token refresh error:', err);
      setError('Failed to refresh authentication');
      return null;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
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