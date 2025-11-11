import { supabase } from '../lib/supabase';

/**
 * Supabase Auth Service
 * Replaces Firebase Auth with Supabase Auth (JWT-based)
 * Supabase handles token refresh automatically
 */

// Login function with email and password
export const login = async (email: string, password: string, isAdmin: boolean = false) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!data.user) throw new Error('Login failed: No user data returned');

    // Store user info for compatibility
    localStorage.setItem('userId', data.user.id);
    if (isAdmin) {
      localStorage.setItem('isAdmin', 'true');
    }

    // Record login for analytics
    recordUserLogin(data.user.id, isAdmin);

    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout function - Supabase handles token cleanup
export const logout = async () => {
  try {
    // Remove local storage tokens
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');

    // Sign out from Supabase (also clears session)
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Verify token validity - Supabase handles this automatically
export const verifyToken = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return false;

    // Update session last activity
    await updateSessionActivity(data.session.user.id);

    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

// Reset password - Send password reset email
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    if (error) throw error;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// Change password using Supabase
export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user || !user.email) throw new Error('User not authenticated');

    // Supabase requires re-authentication for password change
    // First sign in again with current password to verify
    const { error: reAuthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });

    if (reAuthError) throw new Error('Current password is incorrect');

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

// Register new user
export const register = async (email: string, password: string, userData: Record<string, unknown>) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    if (!data.user) throw new Error('Registration failed: No user data returned');

    // Create user profile in Supabase
    await createUserProfile(data.user.id, { ...userData, email });

    return data.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// OAuth Sign-in with Google (future implementation)
// Supabase supports OAuth, which will be implemented in a separate update
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) throw error;
  return data;
};

// Helper functions for session management
const recordUserLogin = (_userId: string, _isAdmin: boolean) => {
  // Placeholder for future analytics implementation
  console.log(`User logged in: ${_userId}, Admin: ${_isAdmin}`);
  return true;
};

const updateSessionActivity = (userId: string) => {
  // Placeholder for future session activity tracking
  console.log(`Updating session activity for: ${userId}`);
  return true;
};

const createUserProfile = async (userId: string, userData: Record<string, unknown>) => {
  try {
    // Create user profile in Supabase
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        ...userData,
        created_at: new Date()
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
};
