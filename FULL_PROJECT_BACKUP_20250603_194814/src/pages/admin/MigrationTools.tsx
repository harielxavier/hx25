import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import migrateGalleryMedia from '../../scripts/migrateGalleryMedia';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const MigrationTools: React.FC = () => {
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleMigrateGalleryMedia = async () => {
    try {
      setMigrating(true);
      setResult(null);
      
      await migrateGalleryMedia();
      
      setResult({
        success: true,
        message: 'Gallery media migration completed successfully!'
      });
    } catch (error) {
      console.error('Migration error:', error);
      setResult({
        success: false,
        message: `Migration failed: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container py-4">
        <h1 className="text-3xl font-bold mb-6">Migration Tools</h1>
        
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Gallery Media Migration</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-500 mb-4">
              This tool will update your existing gallery media items with the new metadata fields.
              You only need to run this once to migrate your existing galleries.
            </p>
            
            {result && (
              <div className={`p-4 mb-4 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className="text-sm">{result.message}</p>
              </div>
            )}
            
            <button 
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${migrating ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={handleMigrateGalleryMedia}
              disabled={migrating}
            >
              {migrating ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Migrating...</span>
                </>
              ) : (
                'Migrate Gallery Media'
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MigrationTools;
