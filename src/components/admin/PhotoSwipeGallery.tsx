import 'photoswipe/dist/photoswipe.css'
import { Gallery, Item } from 'react-photoswipe-gallery'
import { useEffect, useState } from 'react'
import { ref, listAll, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase/config'; 
import LoadingSpinner from '../ui/LoadingSpinner';

interface PhotoSwipeGalleryProps {
  storagePath: string; // e.g., "galleries/galleryId/images"
}

interface ImageItem {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const PhotoSwipeGallery: React.FC<PhotoSwipeGalleryProps> = ({ storagePath }) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storagePath) return;

    setLoading(true);
    setError(null);
    const imagesRef = ref(storage, storagePath);

    listAll(imagesRef)
      .then(async (result) => {
        if (result.items.length === 0) {
          setImages([]);
          setLoading(false);
          return;
        }

        const imagePromises = result.items.map(async (itemRef) => {
          try {
            const url = await getDownloadURL(itemRef);
            // Basic image loading to get dimensions (can be slow for many images)
            // Consider storing dimensions in Firestore for better performance
            const img = new Image();
            img.src = url;
            await img.decode(); // Wait for image to load to get dimensions

            return {
              src: url,
              width: img.naturalWidth || 1200, // Fallback width
              height: img.naturalHeight || 800, // Fallback height
              alt: itemRef.name
            };
          } catch (imgError) {
            console.error("Error loading image properties:", itemRef.name, imgError);
            // Provide default/fallback values if image loading fails
            return {
              src: await getDownloadURL(itemRef).catch(() => ''), // Get URL even if dimensions fail
              width: 1200,
              height: 800,
              alt: itemRef.name
            };
          }
        });

        const loadedImages = await Promise.all(imagePromises);
        setImages(loadedImages.filter(img => img.src)); // Filter out images where URL fetch failed
      })
      .catch((error) => {
        console.error("Error listing images:", error);
        setError("Failed to load images from storage. Please check the path and permissions.");
      })
      .finally(() => {
        setLoading(false);
      });

  }, [storagePath]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <LoadingSpinner size="lg" /> 
        <p className="mt-4 text-gray-600">Loading gallery images...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-100 border border-red-400 rounded">Error: {error}</div>;
  }

  if (images.length === 0) {
    return <div className="text-gray-500 p-4">No images found in this gallery.</div>;
  }

  return (
    <Gallery options={{ bgOpacity: 0.8 }}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {images.map((image, index) => (
          <Item
            key={index}
            original={image.src}
            thumbnail={image.src} // Consider generating actual thumbnails for performance
            width={image.width}
            height={image.height}
            alt={image.alt}
          >
            {({ ref, open }) => (
              <div className="aspect-square overflow-hidden bg-gray-200 rounded shadow hover:shadow-lg transition-shadow duration-200">
                <img
                  ref={ref as any} // Cast to any
                  onClick={open}
                  src={image.src} // Use thumbnail src here if generated
                  alt={image.alt}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-200 hover:scale-105"
                  loading="lazy" // Add lazy loading
                />
              </div>
            )}
          </Item>
        ))}
      </div>
    </Gallery>
  );
};

export default PhotoSwipeGallery;
