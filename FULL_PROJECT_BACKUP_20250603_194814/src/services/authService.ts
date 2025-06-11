import { 
  signInWithEmailAndPassword, 
  signOut, 
  updatePassword, 
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  UserCredential,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../firebase/config';
import axios from 'axios'; // Import axios

// Token refresh mechanism as described in the memories
export const refreshToken = async (): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    // Get the refresh token from localStorage
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('No refresh token available');
      return null;
    }

    // Make a request to the refresh token endpoint
    const response = await axios.post('/api/auth/refresh-token', { refreshToken });
    
    if (response.data && response.data.accessToken) {
      // Store the new tokens
      localStorage.setItem('token', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      console.log('Token refreshed successfully');
      return response.data.accessToken;
    } else {
      console.error('Invalid response from refresh token endpoint');
      return null;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

// Login function that handles token storage
export const login = async (email: string, password: string, isAdmin: boolean = false) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get the JWT token for API requests
    const token = await user.getIdToken();
    
    // Make a request to the verification endpoint to get refresh token
    try {
      const response = await axios.post('/api/auth/verify', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.accessToken) {
        // Store the tokens from the verification response
        localStorage.setItem('token', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      } else {
        // Fallback to the original token if verification doesn't return new tokens
        localStorage.setItem('token', token);
      }
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      // Fallback to the original token
      localStorage.setItem('token', token);
    }
    
    // Store user info
    localStorage.setItem('userId', user.uid);
    
    if (isAdmin) {
      localStorage.setItem('isAdmin', 'true');
    }
    
    // Record this login for analytics (optional)
    recordUserLogin(user.uid, isAdmin);
    
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout function that handles token removal
export const logout = async () => {
  try {
    const userId = auth.currentUser?.uid;
    
    // Invalidate the session
    if (userId) {
      await invalidateSession(userId);
    }
    
    // Remove tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    
    // Sign out from Firebase
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Verify token validity
export const verifyToken = async (): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    
    // This will throw an error if the token is invalid
    await currentUser.getIdToken(true);
    
    // Update session last activity
    await updateSessionActivity(currentUser.uid);
    
    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/login`
    });
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('User not authenticated');
    
    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

// Register new user
export const register = async (email: string, password: string, userData: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await createUserProfile(user.uid, { ...userData, email });
    
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Google sign-in function with improved popup handling
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    // Create a Google auth provider
    const provider = new GoogleAuthProvider();
    
    // Add scopes for better user data access
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    
    // Set custom parameters for better UX
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // First, check if we have a redirect result
    // This handles cases where the user was redirected back after authentication
    try {
      const redirectResult = await getRedirectResult(auth);
      if (redirectResult) {
        // User has returned from a redirect
        console.log('Redirect sign-in successful');
        
        // Store user info in localStorage
        localStorage.setItem('token', await redirectResult.user.getIdToken());
        localStorage.setItem('userId', redirectResult.user.uid);
        
        // Check if user is admin
        const isAdmin = redirectResult.user.email === 'admin@example.com' || 
                      (redirectResult.user.email?.endsWith('@harielxavier.com') || false);
        
        if (isAdmin) {
          localStorage.setItem('isAdmin', 'true');
        }
        
        // Record login for analytics
        recordUserLogin(redirectResult.user.uid, isAdmin);
        
        return redirectResult;
      }
    } catch (redirectError) {
      console.log('No redirect result or error getting it:', redirectError);
      // Continue with popup flow if no redirect result
    }
    
    // Attempt popup sign-in first (better UX when it works)
    try {
      console.log('Attempting popup sign-in...');
      
      // Create a promise that will resolve when the popup completes
      const popupPromise = new Promise<UserCredential>((resolve, reject) => {
        // Set a timeout to detect if the popup is taking too long
        const timeoutId = setTimeout(() => {
          reject(new Error('Google sign-in popup timed out. Please try again.'));
        }, 120000); // 2 minutes timeout
        
        // Attempt the popup sign-in
        signInWithPopup(auth, provider)
          .then((result) => {
            clearTimeout(timeoutId);
            resolve(result);
          })
          .catch((error) => {
            clearTimeout(timeoutId);
            reject(error);
          });
      });
      
      // Add event listeners to detect popup closure
      const popupCheckInterval = setInterval(() => {
        const popup = window.open('', 'firebaseAuth');
        if (!popup || popup.closed) {
          clearInterval(popupCheckInterval);
          // Notify parent window that auth was cancelled if the popup was closed
          if (popup?.closed) {
            window.postMessage({ type: 'googleAuthCancelled' }, window.location.origin);
          }
        }
      }, 1000);
      
      // Clear the interval when we're done
      setTimeout(() => {
        clearInterval(popupCheckInterval);
      }, 120000); // 2 minutes timeout
      
      // Wait for the popup to complete
      const result = await popupPromise;
      
      // Clear the interval when we're done
      clearInterval(popupCheckInterval);
      
      // Store user info in localStorage
      localStorage.setItem('token', await result.user.getIdToken());
      localStorage.setItem('userId', result.user.uid);
      
      // Check if user is admin
      const isAdmin = result.user.email === 'admin@example.com' || 
                    (result.user.email?.endsWith('@harielxavier.com') || false);
      
      if (isAdmin) {
        localStorage.setItem('isAdmin', 'true');
      }
      
      // Record login for analytics
      recordUserLogin(result.user.uid, isAdmin);
      
      return result;
    } catch (popupError: unknown) {
      // If popup is blocked or fails, fall back to redirect
      if (popupError instanceof FirebaseError && 
          (popupError.code === 'auth/popup-blocked' || 
           popupError.code === 'auth/popup-closed-by-user')) {
        
        console.log('Popup blocked or closed, falling back to redirect flow');
        
        // Show a message to the user about the redirect
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.padding = '10px 20px';
        message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        message.style.color = 'white';
        message.style.borderRadius = '5px';
        message.style.zIndex = '9999';
        message.textContent = 'Redirecting to Google sign-in...';
        document.body.appendChild(message);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
          document.body.removeChild(message);
        }, 3000);
        
        // Fall back to redirect method
        await signInWithRedirect(auth, provider);
        
        // This function will not return here as the page will redirect
        // The result will be handled when the user returns to the page
        // in the getRedirectResult call at the beginning of this function
        
        // Return a dummy promise that never resolves
        // This is just to satisfy TypeScript, the code won't actually reach here
        return new Promise<UserCredential>(() => {});
      }
      
      // If it's another type of error, rethrow
      console.error('Google sign in error:', popupError);
      throw popupError;
    }
  } catch (error: unknown) {
    console.error('Google sign in error:', error);
    
    // Provide better error messages
    if (error instanceof FirebaseError) {
      if (error.code === 'auth/popup-blocked') {
        throw new Error(
          'The sign-in popup was blocked by your browser. We\'ll try to redirect you to Google sign-in instead.'
        );
      }
      
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error(
          'This domain is not authorized for Firebase Authentication. Please contact the site administrator.'
        );
      }

      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        throw new Error(
          'The sign-in was cancelled. Please try again when you\'re ready.'
        );
      }
    }
    
    // If it's not a FirebaseError, rethrow the original error
    throw error;
  }
};

// Helper functions for session management
// Note: These functions are kept as placeholders for future implementation
// Currently using localStorage for simplicity
const recordUserLogin = (_userId: string, _isAdmin: boolean) => {
  // Placeholder for future analytics implementation
  // This could be used to track login activity, update last login timestamp, etc.
  console.log(`User logged in: ${_userId}, Admin: ${_isAdmin}`);
  return true;
};

const updateSessionActivity = (_userId: string) => {
  // Placeholder for future session activity tracking
  return true;
};

const invalidateSession = async (userId: string) => {
  try {
    // In a real implementation, this would invalidate the user's session on the server
    // For now, we just log the action
    console.log(`Invalidating session for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Error invalidating session:', error);
    return false;
  }
};

const createUserProfile = async (userId: string, userData: any) => {
  try {
    // In a real implementation, this would create a user profile in Firestore
    // For now, we just log the action
    console.log(`Creating user profile for: ${userId}`, userData);
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
};
