import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
// REMOVED FIREBASE: import { getStorage, ref, uploadBytesResumable, getDownloadURL // REMOVED FIREBASE
// REMOVED FIREBASE: import { getFirestore, collection, doc, setDoc, updateDoc, increment, serverTimestamp // REMOVED FIREBASE
import { v4 as uuidv4 } from 'uuid';
import { X, Upload, Check, AlertCircle } from 'lucide-react';
import { compressImage } from '../../utils/imageUtils';

interface ImageUploaderProps {
  galleryId: string;
  onUploadComplete?: (imageIds: string[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  createThumbnails?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

interface UploadingFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  error: string | null;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  url?: string;
  thumbnailUrl?: string;
}

const ImageUploader = ({
  galleryId,
  onUploadComplete,
  maxFiles = 100,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  createThumbnails = true,
  maxWidth = 2000,
  maxHeight = 2000
}: ImageUploaderProps) => {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  // We use errorCount in the UI to show how many files failed to upload
  const [errorCount, setErrorCount] = useState(0);
  const abortControllersRef = useRef<{ [key: string]: AbortController }>({});

  // Clear previews when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Limit the number of files that can be uploaded at once
    const filesToProcess = acceptedFiles.slice(0, maxFiles);
    
    const newFiles = filesToProcess.map(file => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      error: null,
      status: 'pending' as const
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, [maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    multiple: true
  });

  const removeFile = (id: string) => {
    // Cancel upload if in progress
    if (abortControllersRef.current[id]) {
      abortControllersRef.current[id].abort();
      delete abortControllersRef.current[id];
    }
    
    // Find the file to revoke its preview URL
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFile = async (file: UploadingFile) => {
    if (file.status === 'complete') return;
    
    const storage = getStorage();
    const db = getFirestore();
    const abortController = new AbortController();
    abortControllersRef.current[file.id] = abortController;
    
    try {
      // Update file status
      setFiles(prev => 
        prev.map(f => f.id === file.id ? { ...f, status: 'uploading' } : f)
      );

      // Compress the image if needed
      const compressedFile = await compressImage(file.file, {
        maxWidth,
        maxHeight,
        quality: 0.85
      });
      
      // Create a thumbnail version if needed
      let thumbnailUrl = '';
      if (createThumbnails) {
        const thumbnailFile = await compressImage(file.file, {
          maxWidth: 400,
          maxHeight: 400,
          quality: 0.7
        });
        
        const thumbnailPath = `galleries/${galleryId}/thumbnails/${file.id}`;
        const thumbnailStorageRef = ref(storage, thumbnailPath);
        
        await uploadBytesResumable(thumbnailStorageRef, thumbnailFile);
        thumbnailUrl = await getDownloadURL(thumbnailStorageRef);
      }
      
      // Upload the main image
      const originalFilename = file.file.name;
      const fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
      const storagePath = `galleries/${galleryId}/${file.id}${fileExtension}`;
      const storageRef = ref(storage, storagePath);
      
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);
      
      // Listen for state changes
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFiles(prev => 
            prev.map(f => f.id === file.id ? { ...f, progress } : f)
          );
        },
        (error) => {
          console.error('Upload error:', error);
          setFiles(prev => 
            prev.map(f => f.id === file.id ? { 
              ...f, 
              status: 'error', 
              error: error.message || 'Upload failed' 
            } : f)
          );
          setErrorCount(prev => prev + 1);
          delete abortControllersRef.current[file.id];
        },
        async () => {
          // Get the download URL
          const downloadURL = await getDownloadURL(storageRef);
          
          // If we didn't create a separate thumbnail, use the main image URL
          if (!thumbnailUrl) {
            thumbnailUrl = downloadURL;
          }
          
          // Get image dimensions
          const img = new Image();
          img.src = file.preview;
          await new Promise<void>(resolve => {
            img.onload = () => resolve();
          });
          
          // Save to Firestore
          const imageRef = doc(collection(db, 'galleries', galleryId, 'images'), file.id);
          await setDoc(imageRef, {
            id: file.id,
            filename: `${file.id}${fileExtension}`,
            originalFilename,
            url: downloadURL,
            thumbnailUrl,
            type: 'image',
            size: file.file.size,
            width: img.width,
            height: img.height,
            featured: false,
            title: originalFilename.replace(fileExtension, ''),
            description: '',
            tags: [],
            clientSelected: false,
            photographerSelected: false,
            clientComment: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          
          // Update gallery document with image count
          const galleryRef = doc(db, 'galleries', galleryId);
          await updateDoc(galleryRef, {
            imageCount: increment(1),
            updatedAt: serverTimestamp()
          });
          
          // Update local state
          setFiles(prev => 
            prev.map(f => f.id === file.id ? { 
              ...f, 
              status: 'complete',
              url: downloadURL,
              thumbnailUrl
            } : f)
          );
          
          setUploadedCount(prev => prev + 1);
          delete abortControllersRef.current[file.id];
        }
      );
    } catch (error: any) {
      console.error('Error processing file:', error);
      setFiles(prev => 
        prev.map(f => f.id === file.id ? { 
          ...f, 
          status: 'error', 
          error: error.message || 'Processing failed' 
        } : f)
      );
      setErrorCount(prev => prev + 1);
      delete abortControllersRef.current[file.id];
    }
  };

  const uploadAllFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadedCount(0);
    setErrorCount(0);
    
    // Upload files in parallel, but limit concurrency
    const concurrencyLimit = 3;
    const chunks = [];
    
    for (let i = 0; i < pendingFiles.length; i += concurrencyLimit) {
      chunks.push(pendingFiles.slice(i, i + concurrencyLimit));
    }
    
    for (const chunk of chunks) {
      await Promise.all(chunk.map(file => uploadFile(file)));
    }
    
    setIsUploading(false);
    
    // Call the onUploadComplete callback with successfully uploaded image IDs
    if (onUploadComplete) {
      const successfulUploads = files
        .filter(f => f.status === 'complete')
        .map(f => f.id);
      
      onUploadComplete(successfulUploads);
    }
  };

  const cancelAllUploads = () => {
    // Cancel all ongoing uploads
    Object.values(abortControllersRef.current).forEach(controller => {
      controller.abort();
    });
    
    // Reset file statuses
    setFiles(prev => 
      prev.map(f => 
        f.status === 'uploading' 
          ? { ...f, status: 'error', error: 'Upload cancelled', progress: 0 } 
          : f
      )
    );
    
    setIsUploading(false);
    abortControllersRef.current = {};
  };

  const clearCompleted = () => {
    // Remove all completed files from the list
    const completedIds = files
      .filter(f => f.status === 'complete')
      .map(f => f.id);
    
    completedIds.forEach(id => {
      const fileToRemove = files.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
    });
    
    setFiles(prev => prev.filter(f => f.status !== 'complete'));
  };

  const retryFailedUploads = () => {
    // Reset failed files to pending status
    setFiles(prev => 
      prev.map(f => 
        f.status === 'error' 
          ? { ...f, status: 'pending', error: null, progress: 0 } 
          : f
      )
    );
    
    // Start upload process
    uploadAllFiles();
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-12 w-12 text-gray-400" />
          <p className="text-lg font-medium">
            {isDragActive
              ? 'Drop the images here'
              : 'Drag & drop images here, or click to select files'}
          </p>
          <p className="text-sm text-gray-500">
            Supports: {acceptedFileTypes.map(type => type.replace('image/', '.')).join(', ')}
          </p>
          <p className="text-sm text-gray-500">
            Maximum {maxFiles} files at once
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {isUploading 
                ? `Uploading ${uploadedCount}/${files.length} files...` 
                : `${files.length} files selected`}
            </h3>
            <div className="flex space-x-2">
              {!isUploading && files.some(f => f.status === 'pending') && (
                <button
                  onClick={uploadAllFiles}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Upload All
                </button>
              )}
              {isUploading && (
                <button
                  onClick={cancelAllUploads}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Cancel
                </button>
              )}
              {files.some(f => f.status === 'complete') && (
                <button
                  onClick={clearCompleted}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Clear Completed
                </button>
              )}
              {files.some(f => f.status === 'error') && (
                <button
                  onClick={retryFailedUploads}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                >
                  Retry Failed
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map(file => (
              <div 
                key={file.id} 
                className="relative border rounded-lg overflow-hidden bg-white"
              >
                <div className="relative pt-[75%]">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {file.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-4 border-white border-opacity-50 border-t-transparent animate-spin" />
                      <div className="absolute text-white font-bold">
                        {Math.round(file.progress)}%
                      </div>
                    </div>
                  )}
                  {file.status === 'complete' && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  {file.status === 'error' && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-40 flex items-center justify-center">
                      <div className="bg-white p-2 rounded-full">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-2">
                  <p className="text-sm truncate" title={file.file.name}>
                    {file.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {file.error && (
                    <p className="text-xs text-red-500 truncate" title={file.error}>
                      Error: {file.error}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity"
                  style={{ display: file.status === 'complete' ? 'none' : 'block' }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
