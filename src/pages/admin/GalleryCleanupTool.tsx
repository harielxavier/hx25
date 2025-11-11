import React, { useState } from 'react';
// REMOVED FIREBASE: import { collection, getDocs, doc, writeBatch // REMOVED FIREBASE
// REMOVED FIREBASE: import { ref, listAll, deleteObject // REMOVED FIREBASE
// REMOVED FIREBASE: import { db, storage } from '../../firebase/config';
import AdminLayout from '../../components/admin/AdminLayout';
import { AlertTriangle, Trash2, CheckCircle } from 'lucide-react';

const GalleryCleanupTool: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [progress, setProgress] = useState({ total: 0, deleted: 0 });
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addToLog = (message: string) => {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const deleteAllGalleries = async () => {
    if (confirmText !== 'DELETE ALL GALLERIES') {
      setError('Please type "DELETE ALL GALLERIES" to confirm');
      return;
    }

    try {
      setIsDeleting(true);
      setStatus('running');
      setError(null);
      addToLog('Starting gallery cleanup process...');

      // 1. Delete all documents in the 'galleries' collection
      addToLog('Deleting gallery documents from Firestore...');
      const galleriesRef = collection(db, 'galleries');
      const gallerySnapshot = await getDocs(galleriesRef);
      
      const totalGalleries = gallerySnapshot.size;
      setProgress({ total: totalGalleries, deleted: 0 });
      addToLog(`Found ${totalGalleries} galleries to delete`);

      // Use batched writes for better performance
      const batchSize = 500; // Firestore limit
      let batch = writeBatch(db);
      let count = 0;
      let batchCount = 0;

      for (const galleryDoc of gallerySnapshot.docs) {
        // Delete the gallery document
        batch.delete(doc(db, 'galleries', galleryDoc.id));
        count++;
        batchCount++;

        // If we reach the batch limit, commit and create a new batch
        if (batchCount >= batchSize) {
          await batch.commit();
          addToLog(`Deleted batch of ${batchCount} galleries`);
          batch = writeBatch(db);
          batchCount = 0;
        }

        setProgress(prev => ({ ...prev, deleted: count }));
      }

      // Commit any remaining deletes
      if (batchCount > 0) {
        await batch.commit();
        addToLog(`Deleted final batch of ${batchCount} galleries`);
      }

      // 2. Delete all gallery images from Firebase Storage
      addToLog('Deleting gallery images from Firebase Storage...');
      const galleriesStorageRef = ref(storage, 'galleries');
      
      try {
        const galleryFolders = await listAll(galleriesStorageRef);
        addToLog(`Found ${galleryFolders.prefixes.length} gallery folders in storage`);
        
        for (const galleryFolder of galleryFolders.prefixes) {
          try {
            const galleryContents = await listAll(galleryFolder);
            
            // Delete all files in the gallery folder
            for (const item of galleryContents.items) {
              try {
                await deleteObject(item);
              } catch (err: any) {
                // Ignore "object-not-found" errors
                if (err.code === 'storage/object-not-found') {
                  addToLog(`Note: File ${item.name} already deleted or not found`);
                } else {
                  addToLog(`Error deleting file ${item.name}: ${err}`);
                }
              }
            }
            
            // Check for subfolders (like thumbnails)
            for (const subfolder of galleryContents.prefixes) {
              try {
                const subfolderContents = await listAll(subfolder);
                for (const item of subfolderContents.items) {
                  try {
                    await deleteObject(item);
                  } catch (err: any) {
                    // Ignore "object-not-found" errors
                    if (err.code === 'storage/object-not-found') {
                      addToLog(`Note: File ${subfolder.name}/${item.name} already deleted or not found`);
                    } else {
                      addToLog(`Error deleting file ${subfolder.name}/${item.name}: ${err}`);
                    }
                  }
                }
              } catch (err) {
                addToLog(`Error processing subfolder ${subfolder.name}: ${err}`);
              }
            }
            
            addToLog(`Deleted storage folder for gallery: ${galleryFolder.name}`);
          } catch (err) {
            addToLog(`Error deleting gallery folder ${galleryFolder.name}: ${err}`);
          }
        }
      } catch (err) {
        addToLog(`Error listing gallery folders: ${err}`);
      }

      // 3. Delete featured galleries
      addToLog('Deleting featured galleries...');
      const featuredRef = collection(db, 'featuredGalleries');
      const featuredSnapshot = await getDocs(featuredRef);
      
      batch = writeBatch(db);
      batchCount = 0;
      
      for (const featuredDoc of featuredSnapshot.docs) {
        batch.delete(doc(db, 'featuredGalleries', featuredDoc.id));
        batchCount++;
        
        if (batchCount >= batchSize) {
          await batch.commit();
          batch = writeBatch(db);
          batchCount = 0;
        }
      }
      
      if (batchCount > 0) {
        await batch.commit();
      }
      
      addToLog(`Deleted ${featuredSnapshot.size} featured galleries`);

      // 4. Delete portfolio categories
      addToLog('Deleting portfolio categories...');
      const portfolioRef = collection(db, 'portfolioCategories');
      const portfolioSnapshot = await getDocs(portfolioRef);
      
      batch = writeBatch(db);
      batchCount = 0;
      
      for (const portfolioDoc of portfolioSnapshot.docs) {
        batch.delete(doc(db, 'portfolioCategories', portfolioDoc.id));
        batchCount++;
        
        if (batchCount >= batchSize) {
          await batch.commit();
          batch = writeBatch(db);
          batchCount = 0;
        }
      }
      
      if (batchCount > 0) {
        await batch.commit();
      }
      
      addToLog(`Deleted ${portfolioSnapshot.size} portfolio categories`);

      setStatus('success');
      addToLog('Gallery cleanup completed successfully!');
    } catch (err) {
      console.error('Error during gallery cleanup:', err);
      setStatus('error');
      setError(`Error: ${err}`);
      addToLog(`Error during gallery cleanup: ${err}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold mb-6">Gallery Cleanup Tool</h1>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="text-yellow-600 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-lg font-medium text-yellow-800">Warning: Destructive Action</h3>
                <div className="mt-2 text-yellow-700">
                  <p className="mb-2">
                    This tool will permanently delete <strong>ALL</strong> galleries, images, and related data from your Firebase database and storage.
                  </p>
                  <p className="mb-2">
                    This action <strong>CANNOT</strong> be undone. Make sure you have backups if needed.
                  </p>
                  <p>
                    To proceed, type "DELETE ALL GALLERIES" in the confirmation field below.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmation
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE ALL GALLERIES to confirm"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              disabled={isDeleting}
            />
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <button
            onClick={deleteAllGalleries}
            disabled={isDeleting || confirmText !== 'DELETE ALL GALLERIES'}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded w-full ${
              isDeleting || confirmText !== 'DELETE ALL GALLERIES'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Deleting Galleries...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete All Galleries
              </>
            )}
          </button>
          
          {status === 'running' && (
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span>Progress:</span>
                <span>{progress.deleted} / {progress.total} galleries</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress.total ? (progress.deleted / progress.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="mt-6 bg-green-100 border-l-4 border-green-500 p-4">
              <div className="flex">
                <CheckCircle className="text-green-600 mr-3 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-lg font-medium text-green-800">Success!</h3>
                  <p className="text-green-700">All galleries have been successfully deleted.</p>
                </div>
              </div>
            </div>
          )}
          
          {log.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Operation Log</h3>
              <div className="bg-gray-100 p-3 rounded max-h-64 overflow-y-auto font-mono text-sm">
                {log.map((entry, index) => (
                  <div key={index} className="mb-1">
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default GalleryCleanupTool;
