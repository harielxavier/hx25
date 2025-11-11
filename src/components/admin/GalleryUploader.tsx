import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Button, LinearProgress, IconButton, Chip, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FiUploadCloud, FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';
// REMOVED FIREBASE: import { uploadImageWithOptimization, UploadProgress } from '../../services/firebaseCloudinaryService';
import { updateGallery } from '../../services/galleryService';
// REMOVED FIREBASE: import { increment // REMOVED FIREBASE

interface GalleryUploaderProps {
  galleryId: string;
  onUploadComplete?: () => void;
}

interface UploadFile extends File {
  preview?: string;
  id: string;
  status: 'queued' | 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  errorMessage?: string;
  optimizedUrl?: string;
}

const DropzoneContainer = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.default,
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.dark,
  },
}));

const ImagePreview = styled(Paper)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  '&:hover .image-actions': {
    opacity: 1,
  },
}));

const ImageActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: theme.spacing(0.5),
  opacity: 0,
  transition: 'opacity 0.3s ease',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: `0 0 0 ${theme.shape.borderRadius}px`,
}));

export default function GalleryUploader({ galleryId, onUploadComplete }: GalleryUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Map the files to add preview URLs and status
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: `${Date.now()}-${file.name}`,
        status: 'queued' as const,
        progress: 0
      })
    );
    
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 20971520, // 20MB
  });

  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  const uploadFiles = async () => {
    if (files.length === 0 || isUploading) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadedCount(0);
    setFailedCount(0);
    
    const filesToUpload = files.filter(file => file.status === 'queued');
    
    if (filesToUpload.length === 0) {
      setIsUploading(false);
      return;
    }
    
    // Process each file sequentially
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      
      // Update file status to uploading
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.id === file.id 
            ? { ...f, status: 'uploading', progress: 0 } 
            : f
        )
      );
      
      try {
        // Upload the file with Firebase-Cloudinary integration
        const storagePath = `galleries/${galleryId}/${Date.now()}-${file.name}`;
        
        // Track upload progress
        const progressCallback = (progress: UploadProgress) => {
          setFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === file.id 
                ? { 
                    ...f, 
                    status: progress.status as 'queued' | 'uploading' | 'processing' | 'success' | 'error', 
                    progress: progress.progress,
                    optimizedUrl: progress.url
                  } 
                : f
            )
          );
        };
        
        const result = await uploadImageWithOptimization(
          file,
          storagePath,
          progressCallback
        );
        
        // Update file status to success
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === file.id 
              ? { 
                  ...f, 
                  status: 'success', 
                  progress: 100,
                  optimizedUrl: result.optimizedUrl
                } 
              : f
          )
        );
        
        setUploadedCount(prev => prev + 1);
        
        // If this is the first image and gallery has no cover image, set it as cover
        if (i === 0) {
          // @ts-ignore
          await updateGallery(galleryId, {
            coverImage: result.optimizedUrl,
            thumbnailImage: result.thumbnailUrl,
            imageCount: increment(1)
          });
        } else {
          // Just increment the image count
          // @ts-ignore
          await updateGallery(galleryId, {
            imageCount: increment(1)
          });
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        
        // Update file status to error
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.id === file.id 
              ? { 
                  ...f, 
                  status: 'error', 
                  progress: 0,
                  errorMessage: error instanceof Error ? error.message : 'Upload failed'
                } 
              : f
          )
        );
        
        setFailedCount(prev => prev + 1);
      }
      
      // Update overall progress
      setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
    }
    
    setIsUploading(false);
    
    if (onUploadComplete) {
      onUploadComplete();
    }
  };

  const removeFile = (id: string) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter(f => f.id !== id);
    });
  };

  const removeAllFiles = () => {
    files.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
  };

  // Calculate stats
  const queuedFiles = files.filter(f => f.status === 'queued').length;
  const uploadingFiles = files.filter(f => f.status === 'uploading').length;
  const processingFiles = files.filter(f => f.status === 'processing').length;
  const successFiles = files.filter(f => f.status === 'success').length;
  const errorFiles = files.filter(f => f.status === 'error').length;

  return (
    <Box sx={{ p: 2 }}>
      {/* Dropzone */}
      <DropzoneContainer
        {...getRootProps()}
        sx={{
          borderColor: isDragActive ? 'primary.dark' : 'primary.main',
          backgroundColor: isDragActive ? 'rgba(0, 0, 0, 0.05)' : 'background.default',
        }}
      >
        <input {...getInputProps()} />
        <FiUploadCloud style={{ fontSize: 48, color: 'var(--mui-palette-primary-main)', marginBottom: 16 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop the files here' : 'Drag & drop images here'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          or click to select files
        </Typography>
      </DropzoneContainer>

      {/* Actions */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={uploadFiles}
            disabled={isUploading || files.filter(f => f.status === 'queued').length === 0}
            sx={{ mr: 1 }}
          >
            Upload {files.filter(f => f.status === 'queued').length > 0 && `(${files.filter(f => f.status === 'queued').length})`}
          </Button>
          <Button
            variant="outlined"
            onClick={removeAllFiles}
            disabled={isUploading || files.length === 0}
          >
            Clear All
          </Button>
        </Box>
        
        {/* File stats */}
        {files.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {queuedFiles > 0 && (
              <Chip label={`Queued: ${queuedFiles}`} color="default" variant="outlined" />
            )}
            
            {uploadingFiles > 0 && (
              <Chip label={`Uploading: ${uploadingFiles}`} color="primary" variant="outlined" />
            )}
            
            {processingFiles > 0 && (
              <Chip label={`Processing: ${processingFiles}`} color="warning" variant="outlined" />
            )}
            
            {successFiles > 0 && (
              <Chip label={`Uploaded: ${successFiles}`} color="success" variant="outlined" />
            )}
            
            {errorFiles > 0 && (
              <Chip label={`Failed: ${errorFiles}`} color="error" variant="outlined" />
            )}
          </Box>
        )}
      </Box>
      
      {/* Progress bar */}
      {isUploading && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Uploading {uploadedCount + 1}/{files.filter(f => f.status === 'queued' || f.status === 'uploading' || f.status === 'processing').length}
            </Typography>
            <Typography variant="body2">{uploadProgress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}
      
      {/* Preview grid */}
      {files.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Files ({files.length})
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
            {files.map(file => (
              <Box key={file.id}>
                <ImagePreview>
                  {/* Preview image */}
                  <Box
                    sx={{
                      position: 'relative',
                      paddingTop: '75%', // 4:3 aspect ratio
                      backgroundImage: `url(${file.preview})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Status overlay */}
                    {file.status === 'uploading' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <LinearProgress 
                          variant="determinate" 
                          value={file.progress} 
                          sx={{ width: '80%', mb: 1 }} 
                        />
                        <Typography variant="body2" color="white">
                          {file.progress}%
                        </Typography>
                      </Box>
                    )}
                    
                    {file.status === 'processing' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="body2" color="white">
                          Processing...
                        </Typography>
                      </Box>
                    )}
                    
                    {file.status === 'success' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                        }}
                      >
                        <FiCheckCircle color="var(--mui-palette-success-main)" />
                      </Box>
                    )}
                    
                    {file.status === 'error' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                        }}
                      >
                        <FiAlertCircle color="var(--mui-palette-error-main)" />
                      </Box>
                    )}
                    
                    {/* Actions */}
                    <ImageActions className="image-actions">
                      {file.status !== 'uploading' && file.status !== 'processing' && (
                        <IconButton
                          size="small"
                          onClick={() => removeFile(file.id)}
                          sx={{ color: 'white' }}
                        >
                          <FiX fontSize="small" />
                        </IconButton>
                      )}
                    </ImageActions>
                  </Box>
                  
                  <Box sx={{ p: 1 }}>
                    {/* File name */}
                    <Typography variant="body2" noWrap title={file.name}>
                      {file.name}
                    </Typography>
                    
                    {/* Error message */}
                    {file.status === 'error' && file.errorMessage && (
                      <Typography variant="caption" color="error" noWrap title={file.errorMessage}>
                        {file.errorMessage}
                      </Typography>
                    )}
                  </Box>
                </ImagePreview>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
