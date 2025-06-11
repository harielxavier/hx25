import { useState } from 'react';
import { createSampleGalleries } from '../../services/galleryService';
import { Database, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

const DatabaseInitializer = () => {
  const [initializing, setInitializing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitializeDatabase = async () => {
    try {
      setInitializing(true);
      setError(null);
      setSuccess(false);
      
      await createSampleGalleries();
      
      setSuccess(true);
    } catch (err) {
      console.error('Error initializing database:', err);
      setError('Failed to initialize database. Please try again.');
    } finally {
      setInitializing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold">Database Initialization</h2>
      </div>
      
      <p className="text-gray-600 mb-4">
        If you're seeing database errors or your galleries aren't loading, you may need to initialize your database with sample galleries.
        This will create three sample galleries with images that you can use to test the gallery management features.
      </p>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <p>Database initialized successfully! Your sample galleries are now ready.</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}
      
      <button
        onClick={handleInitializeDatabase}
        disabled={initializing}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {initializing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Initializing...</span>
          </>
        ) : (
          <>
            <Database className="w-4 h-4" />
            <span>Initialize Sample Galleries</span>
          </>
        )}
      </button>
    </div>
  );
};

export default DatabaseInitializer;
