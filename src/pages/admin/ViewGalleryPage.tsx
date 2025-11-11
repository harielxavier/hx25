import { useParams } from 'react-router-dom';
import PhotoSwipeGallery from '../../components/admin/PhotoSwipeGallery';
import { useEffect, useState } from 'react';
// REMOVED FIREBASE: import { doc, getDoc // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../../firebase/config';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ViewGalleryPage = () => {
  const { galleryId } = useParams<{ galleryId: string }>();
  const [galleryTitle, setGalleryTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!galleryId) {
      setError('Gallery ID is missing.');
      setLoading(false);
      return;
    }

    const fetchGalleryDetails = async () => {
      try {
        setLoading(true);
        const galleryRef = doc(db, 'galleries', galleryId);
        const gallerySnap = await getDoc(galleryRef);

        if (gallerySnap.exists()) {
          setGalleryTitle(gallerySnap.data()?.title || 'Untitled Gallery');
        } else {
          setError('Gallery not found.');
        }
      } catch (err) {
        console.error("Error fetching gallery details:", err);
        setError('Failed to load gallery details.');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryDetails();
  }, [galleryId]);

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading gallery details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error: {error} Go back to <Link to="/admin/galleries" className="underline">Gallery Management</Link>.
      </div>
    );
  }

  const storagePath = `galleries/${galleryId}/uploads`; // Adjust if your upload path differs

  return (
    <div className="p-4 md:p-6">
      <Link 
        to="/admin/galleries"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to Gallery Management
      </Link>
      <h1 className="text-2xl font-semibold mb-4">Viewing Gallery: {galleryTitle}</h1>
      <p className="text-sm text-gray-600 mb-4">Displaying images from: <code>{storagePath}</code></p>
      
      <div className="bg-white rounded-lg shadow">
        <PhotoSwipeGallery storagePath={storagePath} />
      </div>
    </div>
  );
};

export default ViewGalleryPage;
