import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 Setting up Supabase auth state listener');

    // Add error handling for Supabase initialization
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Error getting initial session:', error);
          setError(`Authentication error: ${error.message}`);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        console.log('✅ Initial session loaded:', session?.user?.email || 'No user');

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          console.log('🔄 Auth state changed:', session?.user?.email || 'No user');
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        });

        return () => {
          console.log('🧹 Cleaning up Supabase auth listener');
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('❌ Fatal error initializing Supabase auth:', err);
        setError(`Failed to initialize authentication: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
      }
    };

    const cleanup = initializeAuth();

    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log(`🔐 Attempting Supabase sign in: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) throw error;
      
      console.log('✅ Sign in successful');
      setUser(data.user);
      setSession(data.session);
      
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      let errorMessage = 'Invalid email or password';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log(`📝 Attempting Supabase sign up: ${email}`);
      
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
      console.log('✅ Sign up successful - check email for confirmation');
      alert('Please check your email to confirm your account!');
      
    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      setError(error.message || 'Error creating account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('🔐 Attempting Supabase Google sign in');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
      console.log('✅ Google sign-in initiated - redirecting...');
      
    } catch (error: any) {
      console.error('❌ Google sign in error:', error);
      setError(error.message || 'Failed to sign in with Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkSignIn = async (email: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log(`📧 Sending magic link to: ${email}`);
      
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      console.log('✅ Magic link sent successfully!');
      alert('Check your email for the magic link!');
      
    } catch (error: any) {
      console.error('❌ Magic link error:', error);
      setError(error.message || 'Error sending magic link');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log(`🔑 Sending password reset to: ${email}`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      console.log('✅ Password reset email sent!');
      alert('Check your email for password reset instructions!');
      
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      setError(error.message || 'Error sending reset email');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      console.log('🚪 Attempting to sign out');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('✅ Sign out successful');
      setUser(null);
      setSession(null);

      // Clear auth-specific data only
      localStorage.removeItem('sb-egoyqdbolmjfngjzllwl-auth-token');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('isAdmin');

      // Redirect to home
      window.location.replace('/');
      
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      setError(error.message || 'Error signing out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    signIn: handleSignIn,
    signInWithGoogle: handleGoogleSignIn,
    signInWithMagicLink: handleMagicLinkSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}
