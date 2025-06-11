import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, limit, addDoc, Timestamp } from 'firebase/firestore';
import { createSampleGalleries } from '../../services/galleryService';
import { diagnoseFirebaseIssues, createTestGallery } from '../../utils/firebaseDebugger';
import { 
  Database, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  ArrowRight, 
  FileWarning,
  Wrench,
  Info,
  Terminal
} from 'lucide-react';

interface DiagnosisIssue {
  type: string;
  message: string;
  code?: string;
}

interface DiagnosisFix {
  type: string;
  message: string;
}

interface DiagnosisResult {
  issues: DiagnosisIssue[];
  fixes: DiagnosisFix[];
  timestamp: string;
}

type StatusType = 'checking' | 'error' | 'success' | 'initializing' | 'diagnosing';

const FirebaseChecker = () => {
  const [status, setStatus] = useState<StatusType>('checking');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [hasGalleries, setHasGalleries] = useState<boolean | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    checkFirebaseConnection();
  }, []);

  const checkFirebaseConnection = async () => {
    try {
      setStatus('checking');
      setErrorDetails(null);
      setDiagnosisResult(null);
      
      // Try to query the galleries collection
      const galleriesRef = collection(db, 'galleries');
      const q = query(galleriesRef, limit(1));
      const querySnapshot = await getDocs(q);
      
      // Check if we have any galleries
      setHasGalleries(querySnapshot.size > 0);
      
      // If we got here, the connection is working
      setStatus('success');
    } catch (error: any) {
      console.error('Firebase connection check error:', error);
      setStatus('error');
      setErrorDetails(error.message || 'Unknown error connecting to Firebase');
    }
  };

  const handleInitializeDatabase = async () => {
    try {
      setStatus('initializing');
      setIsInitializing(true);
      setErrorDetails(null);
      
      // Create the galleries collection if it doesn't exist
      try {
        // First attempt to create a test gallery to ensure the collection exists
        await addDoc(collection(db, 'galleries'), {
          title: "Test Gallery",
          slug: "test-gallery",
          description: "This is a test gallery to verify Firestore write access.",
          coverImage: "https://via.placeholder.com/800x600",
          thumbnailImage: "https://via.placeholder.com/400x300",
          clientName: "Test Client",
          clientEmail: "test@example.com",
          eventDate: Timestamp.fromDate(new Date()),
          expiresAt: Timestamp.fromDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
          password: null,
          isPublic: true,
          isPasswordProtected: false,
          allowDownloads: true,
          allowSharing: true,
          category: "test",
          location: "Test Location",
          featured: true,
          tags: ["test"],
          createdAt: Timestamp.now(),
          imageCount: 0
        });
      } catch (error) {
        console.log("Error creating test gallery, proceeding with sample galleries:", error);
      }
      
      // Then create the sample galleries
      await createSampleGalleries();
      
      // Recheck the connection after initialization
      await checkFirebaseConnection();
    } catch (error: any) {
      console.error('Error initializing database:', error);
      setStatus('error');
      setErrorDetails(`Error initializing database: ${error.message || 'Unknown error'}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleRunDiagnostics = async () => {
    try {
      setStatus('diagnosing');
      setErrorDetails(null);
      
      const result = await diagnoseFirebaseIssues();
      setDiagnosisResult(result);
      
      // If no issues found, but we still have errors, set a generic message
      if (result.issues.length === 0) {
        setErrorDetails('No specific issues detected, but gallery loading errors persist. Try creating a test gallery.');
      }
      
      setStatus('error');
    } catch (error: any) {
      console.error('Error running diagnostics:', error);
      setStatus('error');
      setErrorDetails(`Error running diagnostics: ${error.message || 'Unknown error'}`);
    }
  };

  const handleCreateTestGallery = async () => {
    try {
      setIsFixing(true);
      
      await createTestGallery();
      
      // Recheck the connection after creating test gallery
      await checkFirebaseConnection();
    } catch (error: any) {
      console.error('Error creating test gallery:', error);
      setErrorDetails(`Error creating test gallery: ${error.message || 'Unknown error'}`);
      setStatus('error');
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold">Firebase Connection Status</h2>
      </div>
      
      <div className="mb-6">
        {status === 'checking' && (
          <div className="flex items-center gap-2 text-yellow-600">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <p>Checking Firebase connection...</p>
          </div>
        )}
        
        {status === 'diagnosing' && (
          <div className="flex items-center gap-2 text-blue-600">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <p>Running Firebase diagnostics...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">Firebase Connection Error</p>
            </div>
            
            <p className="text-red-700 mb-3">{errorDetails}</p>
            
            {diagnosisResult && (
              <div className="mb-4">
                {diagnosisResult.issues.length > 0 && (
                  <div className="mb-3">
                    <p className="font-medium text-gray-800 mb-2">Detected Issues:</p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      {diagnosisResult.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <FileWarning className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{issue.message} {issue.code ? `(Code: ${issue.code})` : ''}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {diagnosisResult.fixes.length > 0 && (
                  <div className="mb-3">
                    <p className="font-medium text-gray-800 mb-2">Recommended Fixes:</p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      {diagnosisResult.fixes.map((fix, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <Wrench className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{fix.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 font-medium">Common "failed-precondition" Causes:</p>
                  <ul className="list-disc pl-5 text-gray-700 mt-2 space-y-1">
                    <li>Missing Firestore indexes for queries with multiple conditions</li>
                    <li>The galleries collection doesn't exist yet</li>
                    <li>Security rules preventing access to the galleries collection</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <div className="flex items-start gap-2">
                <Terminal className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 font-medium">Try running these commands in your project directory:</p>
                  <div className="bg-gray-900 text-white p-2 rounded mt-2 font-mono text-sm overflow-x-auto">
                    <p>node src/scripts/initFirebase.js</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">This will create the galleries collection and populate it with sample data.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={checkFirebaseConnection}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isFixing || isInitializing}
              >
                Try Again
              </button>
              
              <button
                onClick={handleRunDiagnostics}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                disabled={isFixing || isInitializing}
              >
                Run Diagnostics
              </button>
              
              <button
                onClick={handleCreateTestGallery}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                disabled={isFixing || isInitializing}
              >
                {isFixing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin inline mr-1" />
                    Creating...
                  </>
                ) : (
                  'Create Test Gallery'
                )}
              </button>
              
              <button
                onClick={handleInitializeDatabase}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={isFixing || isInitializing}
              >
                {isInitializing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin inline mr-1" />
                    Initializing...
                  </>
                ) : (
                  'Initialize Sample Galleries'
                )}
              </button>
            </div>
          </div>
        )}
        
        {status === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <CheckCircle className="w-5 h-5" />
              <p className="font-medium">Firebase Connection Successful</p>
            </div>
            
            {hasGalleries ? (
              <p className="text-gray-700">
                Your Firebase database is properly connected and has galleries. Gallery management features should work correctly.
              </p>
            ) : (
              <div>
                <p className="text-yellow-700 mb-3">
                  Your Firebase database is connected, but no galleries were found. You need to initialize the database with sample galleries.
                </p>
                <button
                  onClick={handleInitializeDatabase}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={isFixing || isInitializing}
                >
                  {isInitializing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin inline mr-1" />
                      Initializing...
                    </>
                  ) : (
                    'Initialize Sample Galleries'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
        
        {status === 'initializing' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <p className="font-medium">Initializing Sample Galleries...</p>
            </div>
            <p className="text-gray-700">
              Creating sample galleries in your Firebase database. This may take a moment...
            </p>
          </div>
        )}
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Gallery Management System</h3>
        <p className="text-gray-600 mb-3">
          The gallery management system allows you to control which galleries are featured on your landing page and which ones are public in your portfolio.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="/admin/featured-galleries" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
            Featured Galleries <ArrowRight className="w-4 h-4" />
          </a>
          <a href="/admin/portfolio-settings" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
            Portfolio Settings <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FirebaseChecker;
