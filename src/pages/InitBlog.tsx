import { useState } from 'react';
import { initializeBlogPosts, createNewBlogPosts } from '../utils/blogInitializer';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';

const InitBlog = () => {
  const [status, setStatus] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [step, setStep] = useState<'auth' | 'init' | 'complete'>('auth');

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminEmail || !adminPassword) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsAuthenticating(true);
    setError(null);
    
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('Signed in successfully');
      setStep('init');
      runInitialization();
    } catch (authError: any) {
      console.error('Authentication error:', authError);
      setError(`Authentication failed: ${authError.message || 'Unknown error'}`);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const runInitialization = async () => {
    try {
      // Initialize blog posts collection if it doesn't exist
      await initializeBlogPosts();
      setStatus('Blog posts collection initialized. Creating sample posts...');
      
      // Create the sample blog posts
      await createNewBlogPosts();
      setStatus('Successfully created 7 sample blog posts!');
      setSuccess(true);
      setStep('complete');
    } catch (error: any) {
      console.error('Error in blog initialization:', error);
      setError(`Error: ${error.message || 'Unknown error'}`);
      setStatus('Failed to initialize blog');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Blog Initialization</h1>
      
      {step === 'auth' && (
        <div className="mb-8">
          <p className="mb-4 text-gray-600">
            Please authenticate with your admin credentials to initialize the blog.
          </p>
          
          <form onSubmit={handleAuthentication} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50"
            >
              {isAuthenticating ? 'Authenticating...' : 'Authenticate & Initialize Blog'}
            </button>
          </form>
        </div>
      )}
      
      {(step === 'init' || step === 'complete') && (
        <div className={`p-6 rounded-lg mb-6 ${error ? 'bg-red-50' : success ? 'bg-green-50' : 'bg-blue-50'}`}>
          <h3 className="text-xl font-semibold mb-2">{status}</h3>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {success && (
            <p className="text-green-600">
              All done! You can now go to the{' '}
              <Link to="/blog" className="text-blue-600 hover:underline">Blog Page</Link>{' '}
              or{' '}
              <Link to="/admin/blog" className="text-blue-600 hover:underline">Blog Manager</Link>.
            </p>
          )}
        </div>
      )}
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Troubleshooting</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Make sure you've set up Firebase Security Rules to allow access to the posts collection</li>
          <li>Check if your Firebase project has Firestore enabled</li>
          <li>Ensure you're signing in with an account that has admin privileges</li>
          <li>Look at the browser console for more detailed error messages</li>
        </ul>
        
        <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-white">
          <h3 className="text-lg font-medium mb-2">Firebase Security Rules</h3>
          <p className="text-gray-600 mb-3">
            Make sure you've added these rules to your Firebase project:
          </p>
          <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read posts
    match /posts/{postId} {
      allow read: if true;  // Anyone can read posts
      allow write: if request.auth != null && request.auth.token.email_verified;
    }
    
    // Your existing rules for other collections
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.token.email_verified;
    }
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default InitBlog;
