import React, { useState, useEffect } from 'react';
import { useSupabaseAuth as useAuth } from '../../contexts/SupabaseAuthContext';
import { AlertCircle, Info, ArrowLeft, X } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useLocation, useNavigate, Link } from 'react-router-dom';

interface LocationState {
  from?: {
    pathname: string;
  };
  message?: string;
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [googleAuthInProgress, setGoogleAuthInProgress] = useState(false);
  const { signIn, signInWithGoogle, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the message from location state if it exists
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.message) {
      setMessage(state.message);
    }
  }, [location]);

  // Add useEffect to check authentication status
  useEffect(() => {
    console.log('AdminLogin mounted, checking auth status');
    if (user) {
      console.log('User already authenticated, redirecting to admin');
      // Get the redirect path from location state or default to /admin
      const state = location.state as LocationState;
      const from = state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Add a listener for Google auth popup events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is from our Google auth popup
      if (event.data && event.data.type === 'googleAuthCancelled') {
        setGoogleAuthInProgress(false);
        setError('Google sign-in was cancelled. Please try again.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      setLoading(true);
      console.log('Submitting login form');
      
      // Use the auth context's signIn function
      await signIn(email, password);
      
      // If we get here, sign in was successful
      console.log('Login successful, redirecting');
      // Get the redirect path from location state or default to /admin
      const state = location.state as LocationState;
      const from = state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      // Use the improved error message from our auth service
      if (err.message) {
        setError(err.message);
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for authentication. Please add localhost:5178 to your Firebase authorized domains in the Firebase console.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else {
        setError('An unexpected error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      setGoogleAuthInProgress(true);
      console.log('Initiating Google sign-in');
      
      await signInWithGoogle();
      
      // If we get here, sign in was successful
      console.log('Google login successful, redirecting');
      // Get the redirect path from location state or default to /admin
      const state = location.state as LocationState;
      const from = state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Google login error:', err);
      setGoogleAuthInProgress(false);
      
      // Use the improved error message from our auth service
      if (err.message) {
        setError(err.message);
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for authentication. Please add localhost:5178 to your Firebase authorized domains in the Firebase console.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('The sign-in popup was blocked by your browser. Please allow popups for this site or try using email/password login instead.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('The sign-in popup was cancelled. Please try again.');
      } else {
        setError('Failed to sign in with Google. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const dismissError = () => {
    setError(null);
  };
  
  const dismissMessage = () => {
    setMessage(null);
  };
  
  // Don't render if already logged in
  if (user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black bg-opacity-90">
      {/* Back to website button */}
      <Link 
        to="/"
        className="fixed top-6 left-6 flex items-center text-white hover:text-gray-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span>Back to Website</span>
      </Link>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center justify-center mb-8">
          <img 
            src="https://res.cloudinary.com/dos0qac90/image/upload/v1761593379/hariel-xavier-photography/MoStuff/black.png" 
            alt="Hariel Xavier Photography" 
            className="h-20 w-auto mb-2"
          />
          <div className="h-0.5 w-16 bg-gradient-to-r from-purple-500 to-pink-500 mt-2"></div>
        </div>
        
        <h2 className="text-2xl font-serif text-gray-900 dark:text-white text-center mb-6">Admin Portal</h2>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md relative mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span className="flex-grow">{error}</span>
            <button 
              onClick={dismissError}
              className="text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {message && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-md relative mb-4 flex items-start">
            <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span className="flex-grow">{message}</span>
            <button 
              onClick={dismissMessage}
              className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleAuthInProgress}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-200"
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              {googleAuthInProgress ? 'Signing in with Google...' : 'Sign in with Google'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This is a secure area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}