import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { collection, getDocs, query, limit } from 'firebase/firestore';

interface DebugInfo {
  user?: {
    uid: string;
    email: string | null;
    displayName: string | null;
    providerId: string;
  };
  domain?: string;
  firebaseConfig?: {
    authDomain?: string;
    projectId?: string;
  };
  googleAuth?: {
    success: boolean;
    user?: {
      uid: string;
      email: string | null;
      displayName: string | null;
    };
    error?: {
      code: string;
      message: string;
    };
  };
  firestoreTest?: {
    success: boolean;
    message: string;
    error?: string;
  };
}

const FirebaseAuthDebugger: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<string>('Checking authentication...');
  const [domainStatus, setDomainStatus] = useState<string>('Checking domain status...');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [firestoreStatus, setFirestoreStatus] = useState<string>('Checking Firestore connection...');
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    // Set persistence to LOCAL to keep the user logged in
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('Firebase persistence set to LOCAL');
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });

    // Get current domain
    const domain = window.location.hostname;
    setCurrentDomain(domain);

    // Check for redirect result
    checkRedirectResult();

    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        setAuthStatus('Authenticated');
        setDebugInfo((prev: DebugInfo) => ({ ...prev, user: { 
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          providerId: user.providerData[0]?.providerId || 'unknown'
        }}));
      } else {
        setCurrentUser(null);
        setAuthStatus('Not authenticated');
      }
    });

    // Check if domain is authorized
    if (domain === 'localhost') {
      setDomainStatus('Using localhost - should be authorized by default');
    } else {
      setDomainStatus(`Current domain (${domain}) needs to be authorized in Firebase Console`);
    }

    // Test Firestore connection
    testFirestoreConnection();

    setDebugInfo((prev: DebugInfo) => ({ 
      ...prev, 
      domain,
      firebaseConfig: {
        authDomain: auth.app.options.authDomain,
        projectId: auth.app.options.projectId
      }
    }));

    return () => unsubscribe();
  }, []);

  const checkRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        console.log('Google sign-in redirect result:', result);
        setAuthStatus('Google sign-in successful via redirect');
        setCurrentUser(result.user);
        setErrorDetails('');
        
        setDebugInfo((prev: DebugInfo) => ({ 
          ...prev, 
          googleAuth: { 
            success: true,
            user: {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName
            }
          }
        }));
      }
    } catch (error: any) {
      console.error('Google redirect sign-in error:', error);
      setAuthStatus(`Google sign-in failed: ${error.code}`);
      handleAuthError(error);
      
      setDebugInfo((prev: DebugInfo) => ({ 
        ...prev, 
        googleAuth: { 
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      }));
    }
  };

  const handleAuthError = (error: any) => {
    let errorMessage = '';
    
    switch(error.code) {
      case 'auth/unauthorized-domain':
        errorMessage = `Your domain (${currentDomain}) is not authorized in Firebase Console.
          Go to Firebase Console > Authentication > Settings > Authorized domains and add ${currentDomain}`;
        setDomainStatus(`ERROR: ${errorMessage}`);
        break;
      case 'auth/popup-blocked':
        errorMessage = 'The sign-in popup was blocked by your browser. Try the redirect method instead.';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'The sign-in popup was closed before authentication was completed.';
        break;
      case 'auth/invalid-credential':
        errorMessage = `Invalid credentials provided. This could be due to:
          1. The credential has expired or been revoked
          2. The OAuth provider configuration is incorrect
          3. The user account has been disabled
          
          Try these solutions:
          - Make sure your Firebase project has Google authentication enabled
          - Check that the correct API key is being used
          - Verify that the Google Cloud Platform API credentials are properly configured`;
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'An account already exists with the same email but different sign-in credentials.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'A network error occurred. Check your internet connection.';
        break;
      default:
        errorMessage = `Error: ${error.message}`;
    }
    
    setErrorDetails(errorMessage);
  };

  const testFirestoreConnection = async () => {
    try {
      setFirestoreStatus('Testing Firestore connection...');
      const testQuery = query(collection(db, 'galleries'), limit(1));
      const snapshot = await getDocs(testQuery);
      
      console.log('Firestore test successful, found:', snapshot.size, 'documents');
      setFirestoreStatus(`Firestore connection successful! Found ${snapshot.size} galleries.`);
      
      setDebugInfo((prev: DebugInfo) => ({
        ...prev,
        firestoreTest: {
          success: true,
          message: `Connected successfully! Found ${snapshot.size} galleries.`
        }
      }));
    } catch (error: any) {
      console.error('Firestore test error:', error);
      setFirestoreStatus(`Firestore connection error: ${error.message}`);
      
      setDebugInfo((prev: DebugInfo) => ({
        ...prev,
        firestoreTest: {
          success: false,
          message: 'Failed to connect to Firestore',
          error: error.message
        }
      }));
    }
  };

  const testGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes for additional permissions if needed
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      // Set custom parameters for better compatibility
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      setAuthStatus('Attempting Google sign-in with popup...');
      setErrorDetails('');
      
      const result = await signInWithPopup(auth, provider);
      setAuthStatus('Google sign-in successful');
      setCurrentUser(result.user);
      
      setDebugInfo((prev: DebugInfo) => ({ 
        ...prev, 
        googleAuth: { 
          success: true,
          user: {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
          }
        }
      }));
    } catch (error: any) {
      console.error('Google sign-in test error:', error);
      setAuthStatus(`Google sign-in failed: ${error.code}`);
      handleAuthError(error);
      
      setDebugInfo((prev: DebugInfo) => ({ 
        ...prev, 
        googleAuth: { 
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      }));
    }
  };

  const testGoogleSignInWithRedirect = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes for additional permissions if needed
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      // Set custom parameters for better compatibility
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      setAuthStatus('Redirecting to Google sign-in...');
      setErrorDetails('');
      
      await signInWithRedirect(auth, provider);
      // The page will redirect to Google and then back to this page
      // The result will be handled in the checkRedirectResult function
    } catch (error: any) {
      console.error('Google sign-in redirect error:', error);
      setAuthStatus(`Google sign-in redirect failed: ${error.code}`);
      handleAuthError(error);
      
      setDebugInfo((prev: DebugInfo) => ({ 
        ...prev, 
        googleAuth: { 
          success: false,
          error: {
            code: error.code,
            message: error.message
          }
        }
      }));
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setAuthStatus('Signed out successfully');
      setCurrentUser(null);
      setErrorDetails('');
    } catch (error: any) {
      console.error('Sign out error:', error);
      setAuthStatus(`Sign out failed: ${error.code}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Firebase Connection Status</h2>
          
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${firestoreStatus.includes('successful') ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <h3 className="font-medium">Firestore Status</h3>
            </div>
            <p className="text-sm text-gray-700">{firestoreStatus}</p>
          </div>
          
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${authStatus === 'Authenticated' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <h3 className="font-medium">Authentication Status</h3>
            </div>
            <p className="text-sm text-gray-700">{authStatus}</p>
            {currentUser && (
              <div className="mt-2 text-sm text-gray-700">
                <p>Logged in as: {currentUser.email}</p>
                <p>Display name: {currentUser.displayName}</p>
                <p>User ID: {currentUser.uid}</p>
                <button
                  onClick={signOut}
                  className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-xs font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
          
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${domainStatus.includes('localhost') ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <h3 className="font-medium">Domain Status</h3>
            </div>
            <p className="text-sm text-gray-700">{domainStatus}</p>
          </div>

          {errorDetails && (
            <div className="mb-4 p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
                <h3 className="font-medium text-red-800">Error Details</h3>
              </div>
              <p className="text-sm text-red-700 whitespace-pre-line">{errorDetails}</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={testGoogleSignIn}
            className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium text-gray-700 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            Test Google Sign In (Popup)
          </button>
          
          <button
            onClick={testGoogleSignInWithRedirect}
            className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium text-gray-700 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            Test Google Sign In (Redirect)
          </button>
          
          <button
            onClick={() => testFirestoreConnection()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium text-white"
          >
            Test Firestore Connection
          </button>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium text-gray-700"
          >
            {showDetails ? 'Hide' : 'Show'} Debug Details
          </button>
        </div>
        
        {showDetails && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50 overflow-x-auto">
            <h3 className="font-medium mb-2">Debug Information</h3>
            <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}

        <div className="mt-4 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
          <h3 className="font-medium mb-2 text-yellow-800">Troubleshooting Tips</h3>
          <ul className="list-disc pl-5 text-sm text-yellow-800 space-y-1">
            <li>If you see a <strong>popup-blocked</strong> error, try using the Redirect method instead.</li>
            <li>If you see an <strong>unauthorized-domain</strong> error, add your domain to Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains.</li>
            <li>If you see an <strong>invalid-credential</strong> error, check that Google authentication is enabled in your Firebase project and that your API credentials are correctly configured.</li>
            <li>Make sure popups are allowed in your browser for this site.</li>
            <li>Check browser console for additional error details.</li>
          </ul>
        </div>

        <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="font-medium mb-2 text-blue-800">Firebase Authentication Setup Checklist</h3>
          <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
            <li>Enable Google as a sign-in method in Firebase Console &gt; Authentication &gt; Sign-in method</li>
            <li>Add your domain to Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains</li>
            <li>Make sure your Firebase API key is correct in the Firebase configuration</li>
            <li>Verify that your Google Cloud Platform project has the required APIs enabled</li>
            <li>Check that your OAuth consent screen is properly configured in Google Cloud Console</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FirebaseAuthDebugger;
