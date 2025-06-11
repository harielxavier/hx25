import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Check, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getGallery, uploadGalleryVideo } from '../../services/galleryService';
import VideoPlayer from '../../components/VideoPlayer';

const AdminVideoUpload: React.FC = () => {
  const { galleryId } = useParams<{ galleryId: string }>();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Load gallery data
  useEffect(() => {
    if (!galleryId) {
      setError('Gallery ID is required');
      setLoading(false);
      return;
    }

    const loadGallery = async () => {
      try {
        setLoading(true);
        const galleryData = await getGallery(galleryId);
        if (!galleryData) {
          setError('Gallery not found');
          return;
        }
        setGallery(galleryData);
      } catch (err) {
        console.error('Error loading gallery:', err);
        setError('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [galleryId]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }
    
    // Check file size (limit to 500MB)
    const MAX_SIZE = 500 * 1024 * 1024; // 500MB
    if (file.size > MAX_SIZE) {
      setError(`Video is too large. Maximum size is 500MB.`);
      return;
    }
    
    setVideoFile(file);
    setError(null);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    
    // Set caption from filename if empty
    if (!caption) {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      setCaption(fileName);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile || !galleryId) {
      setError('Video file and gallery ID are required');
      return;
    }
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      // Upload the video
      await uploadGalleryVideo(galleryId, videoFile, {
        caption,
        featured
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);
      
      // Reset form after successful upload
      setTimeout(() => {
        navigate(`/admin/gallery/${galleryId}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error uploading video:', err);
      setError('Failed to upload video. Please try again.');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // Clear video selection
  const clearVideoSelection = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !gallery) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/gallery')}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Back to Galleries
        </button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Upload Video to {gallery?.title}</h1>
          <button
            onClick={() => navigate(`/admin/gallery/${galleryId}`)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Back to Gallery
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {uploadSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            <div className="flex">
              <Check className="h-5 w-5 mr-2" />
              <span>Video uploaded successfully! Redirecting...</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {!videoPreview ? (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-gray-700">Drag and drop a video file here, or click to browse</p>
                  <p className="text-sm text-gray-500 mt-1">MP4, MOV, or WebM up to 500MB</p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="inline-block px-4 py-2 bg-gray-800 text-white rounded cursor-pointer hover:bg-gray-700"
                >
                  Select Video
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-video max-h-[400px] overflow-hidden rounded-lg">
                  <VideoPlayer src={videoPreview} />
                  <button
                    type="button"
                    onClick={clearVideoSelection}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-700">{videoFile?.name}</p>
                <p className="text-sm text-gray-500">
                  {videoFile && (videoFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          {/* Video Details */}
          {videoFile && (
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <div>
                <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a caption for this video"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Feature this video on the gallery page
                </label>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-right">{Math.round(uploadProgress)}%</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/admin/gallery/${galleryId}`)}
              className="px-4 py-2 mr-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={!videoFile || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminVideoUpload;
