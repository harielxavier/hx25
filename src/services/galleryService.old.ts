import { supabase } from '../lib/supabase';
import storageService from './storageService';

export interface Gallery {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  thumbnail_image: string;
  image_count: number;
  is_published: boolean;
  is_password_protected: boolean;
  password: string;
  allow_downloads: boolean;
  allow_sharing: boolean;
  client_name: string;
  client_email: string;
  expiry_date: string | null;
  watermark_enabled: boolean;
  selection_deadline: string | null;
  required_selection_count: number;
  is_public: boolean;
  tags?: string[];
  filter_tags?: string[];
  category?: string;
  location?: string;
  venue?: string;
  featured?: boolean;
  
  // New fields for enhanced gallery management
  gallery_type: 'website' | 'portfolio' | 'client' | string;
  display_location?: 'landing' | 'recent' | 'portfolio' | string;
  position?: 'left' | 'middle' | 'right' | string;
  portfolio_category?: string;
  client_id?: string;
  show_on_website?: boolean;
  sort_order?: number;
  
  created_at: string;
  updated_at: string;
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video'
}

export interface GalleryMedia {
  id: string;
  filename: string;
  original_filename: string;
  url: string;
  thumbnail_url: string;
  type: MediaType;
  size: number;
  width: number;
  height: number;
  featured: boolean;
  title: string;
  description: string;
  tags: string[];
  client_selected: boolean;
  photographer_selected: boolean;
  client_comment: string;
  caption?: string;
  duration?: number; // For videos
  
  // Enhanced metadata fields
  color_profile?: string; // sRGB, Adobe RGB, etc.
  exposure_data?: {
    aperture?: string; // f/2.8, etc.
    shutter_speed?: string; // 1/125, etc.
    iso?: number; // 100, 200, etc.
    focal_length?: string; // 50mm, etc.
    camera?: string; // Camera model
    lens?: string; // Lens model
  };
  location?: {
    latitude?: number;
    longitude?: number;
    place_name?: string;
  };
  people?: string[]; // Names of people in the photo
  categories?: string[]; // Categories for organization (ceremony, reception, portraits, etc.)
  rating?: number; // Photographer's rating (1-5)
  processing_status?: 'unprocessed' | 'processing' | 'processed'; // Status of editing
  delivery_status?: 'pending' | 'delivered'; // Status of delivery to client
  download_count?: number; // Track how many times the image has been downloaded
  view_count?: number; // Track how many times the image has been viewed
  last_viewed?: string; // When the image was last viewed
  edit_history?: {
    editor: string;
    timestamp: string;
    action: string;
  }[];
  
  created_at: string;
  updated_at: string;
}

// Convert database row to Gallery
const convertRowToGallery = (row: Record<string, unknown>): Gallery => {
  return {
    id: (row.id as string) || '',
    title: (row.title as string) || '',
    slug: (row.slug as string) || '',
    description: (row.description as string) || '',
    cover_image: (row.cover_image as string) || '',
    thumbnail_image: (row.thumbnail_image as string) || '',
    image_count: (row.image_count as number) || 0,
    is_published: (row.is_published as boolean) || false,
    is_password_protected: (row.is_password_protected as boolean) || false,
    password: (row.password as string) || '',
    allow_downloads: (row.allow_downloads as boolean) !== false,
    allow_sharing: (row.allow_sharing as boolean) !== false,
    client_name: (row.client_name as string) || '',
    client_email: (row.client_email as string) || '',
    expiry_date: (row.expiry_date as string | null) || null,
    watermark_enabled: (row.watermark_enabled as boolean) || false,
    selection_deadline: (row.selection_deadline as string | null) || null,
    required_selection_count: (row.required_selection_count as number) || 0,
    is_public: (row.is_public as boolean) || false,
    tags: (row.tags as string[]) || [],
    filter_tags: (row.filter_tags as string[]) || [],
    category: (row.category as string) || '',
    location: (row.location as string) || '',
    venue: (row.venue as string) || '',
    featured: (row.featured as boolean) || false,
    gallery_type: (row.gallery_type as string) || 'client',
    display_location: (row.display_location as string) || '',
    position: (row.position as string) || '',
    portfolio_category: (row.portfolio_category as string) || '',
    client_id: (row.client_id as string) || '',
    show_on_website: (row.show_on_website as boolean) || false,
    sort_order: (row.sort_order as number) || 0,
    created_at: (row.created_at as string) || new Date().toISOString(),
    updated_at: (row.updated_at as string) || new Date().toISOString()
  };
};

// Convert database row to GalleryMedia
const convertRowToGalleryMedia = (row: Record<string, unknown>): GalleryMedia => {
  const exposureDataRaw = row.exposure_data as Record<string, unknown> | undefined;
  const exposureData = exposureDataRaw ? {
    aperture: (exposureDataRaw.aperture as string) || undefined,
    shutter_speed: (exposureDataRaw.shutter_speed as string) || undefined,
    iso: (exposureDataRaw.iso as number) || undefined,
    focal_length: (exposureDataRaw.focal_length as string) || undefined,
    camera: (exposureDataRaw.camera as string) || undefined,
    lens: (exposureDataRaw.lens as string) || undefined
  } : undefined;

  const locationRaw = row.location as Record<string, unknown> | undefined;
  const location = locationRaw ? {
    latitude: (locationRaw.latitude as number) || undefined,
    longitude: (locationRaw.longitude as number) || undefined,
    place_name: (locationRaw.place_name as string) || undefined
  } : undefined;

  return {
    id: (row.id as string) || '',
    filename: (row.filename as string) || '',
    original_filename: (row.original_filename as string) || '',
    url: (row.url as string) || '',
    thumbnail_url: (row.thumbnail_url as string) || '',
    type: (row.type as MediaType) || MediaType.IMAGE,
    size: (row.size as number) || 0,
    width: (row.width as number) || 0,
    height: (row.height as number) || 0,
    featured: (row.featured as boolean) || false,
    title: (row.title as string) || '',
    description: (row.description as string) || '',
    tags: (row.tags as string[]) || [],
    client_selected: (row.client_selected as boolean) || false,
    photographer_selected: (row.photographer_selected as boolean) || false,
    client_comment: (row.client_comment as string) || '',
    caption: (row.caption as string) || undefined,
    duration: (row.duration as number) || undefined,
    color_profile: (row.color_profile as string) || 'sRGB',
    exposure_data: exposureData,
    location,
    people: (row.people as string[]) || [],
    categories: (row.categories as string[]) || [],
    rating: (row.rating as number) || 0,
    processing_status: (row.processing_status as 'unprocessed' | 'processing' | 'processed') || 'unprocessed',
    delivery_status: (row.delivery_status as 'pending' | 'delivered') || 'pending',
    download_count: (row.download_count as number) || 0,
    view_count: (row.view_count as number) || 0,
    last_viewed: (row.last_viewed as string) || undefined,
    edit_history: (row.edit_history as GalleryMedia['edit_history']) || [],
    created_at: (row.created_at as string) || new Date().toISOString(),
    updated_at: (row.updated_at as string) || new Date().toISOString()
  };
};


// Get all galleries (for admin)
export const getAllGalleries = async (): Promise<Gallery[]> => {
  try {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    console.log(`Found ${data.length} galleries`);
    if (data.length > 0) {
      console.log('Gallery IDs:', data.map((g: any) => g.id).join(', '));
    }

    return data.map((row: Record<string, unknown>) => convertRowToGallery(row));
  } catch (error) {
    console.error('Error getting galleries:', error);
    throw error;
  }
};

// Get public galleries (for portfolio)
export const getPublicGalleries = async (): Promise<Gallery[]> => {
  try {
    console.log('Fetching public galleries with token:', localStorage.getItem('token') ? 'Present' : 'Not present');

    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    console.log(`Successfully fetched ${data.length} public galleries`);
    return data.map((row: Record<string, unknown>) => convertRowToGallery(row));
  } catch (error: unknown) {
    console.error('Error getting public galleries:', error);
    throw error;
  }
};

// Get galleries by category
export const getGalleriesByCategory = async (category: string): Promise<Gallery[]> => {
  try {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('category', category)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((row: Record<string, unknown>) => convertRowToGallery(row));
  } catch (error: unknown) {
    console.error(`Error getting galleries for category ${category}:`, error);
    throw error;
  }
};

// Get a single gallery by ID
export const getGallery = async (galleryId: string): Promise<Gallery | null> => {
  try {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('id', galleryId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      throw error;
    }

    return data ? convertRowToGallery(data as Record<string, unknown>) : null;
  } catch (error) {
    console.error(`Error getting gallery ${galleryId}:`, error);
    throw error;
  }
};

// Get a single gallery by slug
export const getGalleryBySlug = async (slug: string): Promise<Gallery | null> => {
  try {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      throw error;
    }

    return data ? convertRowToGallery(data as Record<string, unknown>) : null;
  } catch (error) {
    console.error(`Error getting gallery with slug ${slug}:`, error);
    throw error;
  }
};

// Create a new gallery
export const createGallery = async (galleryData: Partial<Gallery>): Promise<string> => {
  try {
    const galleryRef = collection(db, 'galleries');
    
    // Generate a slug if not provided
    if (!galleryData.slug) {
      galleryData.slug = generateSlug(galleryData.title || 'untitled-gallery');
    }
    
    // Set default values
    const newGallery: Partial<Gallery> = {
      ...galleryData,
      imageCount: 0,
      isPublished: false,
      isPasswordProtected: galleryData.isPasswordProtected || false,
      password: galleryData.password || '',
      allowDownloads: galleryData.allowDownloads !== false,
      allowSharing: galleryData.allowSharing !== false,
      watermarkEnabled: galleryData.watermarkEnabled || false,
      expiryDate: galleryData.expiryDate || null,
      selectionDeadline: galleryData.selectionDeadline || null,
      requiredSelectionCount: galleryData.requiredSelectionCount || 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(galleryRef, newGallery);
    console.log('Gallery created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating gallery:', error);
    throw error;
  }
};

// Update a gallery
export const updateGallery = async (galleryId: string, galleryData: Partial<Gallery>): Promise<void> => {
  try {
    const galleryRef = doc(db, 'galleries', galleryId);
    
    // If updating slug, check if it already exists
    if (galleryData.slug) {
      const galleriesRef = collection(db, 'galleries');
      const slugCheck = query(galleriesRef, where('slug', '==', galleryData.slug));
      const slugSnapshot = await getDocs(slugCheck);
      
      if (!slugSnapshot.empty && slugSnapshot.docs[0].id !== galleryId) {
        throw new Error('A gallery with this slug already exists');
      }
    }
    
    await updateDoc(galleryRef, galleryData);
  } catch (error) {
    console.error(`Error updating gallery ${galleryId}:`, error);
    throw error;
  }
};

// Delete a gallery and all its images
export const deleteGallery = async (galleryId: string): Promise<void> => {
  try {
    console.log(`Deleting gallery ${galleryId}`);
    
    // Get all images in the gallery
    const imagesRef = collection(db, 'galleries', galleryId, 'media');
    const imagesSnapshot = await getDocs(imagesRef);
    
    // Delete each image document and its storage files
    const deletePromises = imagesSnapshot.docs.map(async (doc) => {
      const imageData = doc.data() as GalleryMedia;
      
      // Delete image files from storage
      try {
        await storageService.deleteFile(`galleries/${galleryId}/${imageData.filename}`);
        
        // Try to delete thumbnail if it exists
        try {
          await storageService.deleteFile(`galleries/${galleryId}/thumbnails/${imageData.filename}`);
        } catch (error: any) {
          // Ignore object-not-found errors for thumbnails
          if (error.code === 'storage/object-not-found') {
            console.log(`Thumbnail not found for ${imageData.filename} (already deleted or never existed)`);
          } else {
            console.error(`Error deleting thumbnail for ${imageData.filename}:`, error);
          }
        }
      } catch (error: any) {
        // Handle object-not-found errors gracefully
        if (error.code === 'storage/object-not-found') {
          console.log(`Image file not found for ${imageData.filename} (already deleted or never existed)`);
        } else {
          console.error(`Error deleting storage files for image ${doc.id}:`, error);
        }
      }
      
      // Delete the image document
      return deleteDoc(doc.ref);
    });
    
    // Wait for all image deletions to complete
    await Promise.all(deletePromises);
    
    // Delete the gallery document
    await deleteDoc(doc(db, 'galleries', galleryId));
    
    console.log(`Gallery ${galleryId} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting gallery ${galleryId}:`, error);
    throw error;
  }
};

// Upload an image to a gallery
export const uploadGalleryImage = async (
  galleryId: string, 
  file: File, 
  metadata: Partial<GalleryMedia>
): Promise<string> => {
  try {
    console.log(`Uploading image to gallery ${galleryId}:`, file.name);
    
    // Generate a unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${file.name.split('.')[0].replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${extension}`;
    
    // Upload image and thumbnail to storage
    const storagePath = `galleries/${galleryId}/${filename}`;
    const thumbnailPath = `galleries/${galleryId}/thumbnails/thumb_${filename}`;
    
    console.log('Uploading to storage path:', storagePath);
    
    // Extract EXIF data from image if possible
    let exifData = null;
    try {
      // Create a URL for the file
      const objectUrl = URL.createObjectURL(file);
      
      // Create an image element to load the file
      const img = document.createElement('img');
      
      // Wait for the image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = objectUrl;
      });
      
      // Use EXIF.js or similar library to extract data
      // This is a placeholder - you would need to import an EXIF library
      // exifData = await EXIF.getData(img);
      
      // For now, we'll simulate some EXIF data
      exifData = {
        make: metadata.exposureData?.camera || 'Unknown',
        model: metadata.exposureData?.camera || 'Unknown',
        aperture: metadata.exposureData?.aperture || 'f/2.8',
        shutterSpeed: metadata.exposureData?.shutterSpeed || '1/125',
        iso: metadata.exposureData?.iso || 100,
        focalLength: metadata.exposureData?.focalLength || '50mm',
        gpsLatitude: metadata.location?.latitude,
        gpsLongitude: metadata.location?.longitude
      };
      
      // Clean up the object URL
      URL.revokeObjectURL(objectUrl);
    } catch (exifError) {
      console.warn('Failed to extract EXIF data:', exifError);
    }
    
    // Upload original image
    const { url: imageUrl } = await storageService.uploadFile(storagePath, file);
    
    // Create and upload thumbnail
    let thumbnailUrl = '';
    try {
      // Create thumbnail using browser canvas
      const thumbnailBlob = await createBrowserThumbnail(file, 400);
      const { url: thumbUrl } = await storageService.uploadFile(
        thumbnailPath,
        thumbnailBlob,
        { contentType: 'image/jpeg' }
      );
      thumbnailUrl = thumbUrl;
    } catch (thumbnailError) {
      console.warn('Failed to create thumbnail, using original image:', thumbnailError);
      thumbnailUrl = imageUrl;
    }
    
    // Get image dimensions if not provided
    let width = metadata.width;
    let height = metadata.height;
    
    if (!width || !height) {
      try {
        const dimensions = await getImageDimensionsFromFile(file);
        width = dimensions.width;
        height = dimensions.height;
      } catch (dimensionError) {
        console.warn('Failed to get image dimensions:', dimensionError);
      }
    }
    
    // Create media document in Firestore
    const mediaRef = collection(db, 'galleries', galleryId, 'media');
    
    // Prepare exposure data from EXIF if available
    const exposureData = exifData ? {
      aperture: exifData.aperture,
      shutterSpeed: exifData.shutterSpeed,
      iso: exifData.iso,
      focalLength: exifData.focalLength,
      camera: `${exifData.make} ${exifData.model}`.trim(),
      lens: metadata.exposureData?.lens || ''
    } : metadata.exposureData;
    
    // Prepare location data from EXIF if available
    const locationData = exifData && (exifData.gpsLatitude || exifData.gpsLongitude) ? {
      latitude: exifData.gpsLatitude,
      longitude: exifData.gpsLongitude,
      placeName: metadata.location?.placeName || ''
    } : metadata.location;
    
    const mediaData: Partial<GalleryMedia> = {
      filename,
      originalFilename: file.name,
      url: imageUrl,
      thumbnailUrl,
      type: MediaType.IMAGE,
      size: file.size,
      width,
      height,
      featured: metadata.featured || false,
      title: metadata.title || file.name.split('.')[0].replace(/-/g, ' '),
      description: metadata.description || '',
      tags: metadata.tags || [],
      clientSelected: false,
      photographerSelected: false,
      clientComment: '',
      caption: metadata.caption || '',
      
      // Enhanced metadata fields
      colorProfile: metadata.colorProfile || 'sRGB',
      exposureData,
      location: locationData,
      people: metadata.people || [],
      categories: metadata.categories || [],
      rating: metadata.rating || 0,
      processingStatus: metadata.processingStatus || 'unprocessed',
      deliveryStatus: metadata.deliveryStatus || 'pending',
      downloadCount: 0,
      viewCount: 0,
      editHistory: [{
        editor: localStorage.getItem('userId') || 'unknown',
        timestamp: Timestamp.now(),
        action: 'uploaded'
      }],
      
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Add to Firestore
    const docRef = await addDoc(mediaRef, mediaData);
    console.log('Media document created with ID:', docRef.id);
    
    // Update gallery image count
    const galleryRef = doc(db, 'galleries', galleryId);
    const gallerySnap = await getDoc(galleryRef);
    
    if (gallerySnap.exists()) {
      const galleryData = gallerySnap.data() as Gallery;
      const currentCount = galleryData.imageCount || 0;
      
      await updateDoc(galleryRef, {
        imageCount: currentCount + 1,
        updatedAt: Timestamp.now()
      });
      
      // If this is the first image, set it as the cover image
      if (currentCount === 0) {
        await updateDoc(galleryRef, {
          coverImage: imageUrl,
          thumbnailImage: thumbnailUrl
        });
      }
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    throw error;
  }
};

// Upload a video to a gallery
export const uploadGalleryVideo = async (
  galleryId: string, 
  file: File, 
  metadata?: Partial<GalleryMedia>
): Promise<string> => {
  try {
    console.log(`Uploading video to gallery ${galleryId}:`, file.name);
    
    // Generate a unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'mp4';
    const filename = `${timestamp}-${file.name.split('.')[0].replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${extension}`;
    
    // Upload video to storage
    const storagePath = `galleries/${galleryId}/videos/${filename}`;
    console.log('Uploading to storage path:', storagePath);
    
    const { url: videoUrl } = await storageService.uploadFile(storagePath, file);
    
    // Create a thumbnail for the video
    let thumbnailUrl = metadata?.thumbnailUrl || '';
    
    // If no thumbnail provided, try to generate one
    if (!thumbnailUrl) {
      try {
        // In a real implementation, you would use a server-side function to generate a thumbnail
        // For now, we'll use a placeholder
        thumbnailUrl = 'https://via.placeholder.com/400x225?text=Video';
        
        // In a production environment, you might use:
        // 1. A cloud function to generate thumbnails from videos
        // 2. FFmpeg on the server to extract a frame
        // 3. A third-party service like Cloudinary that can generate video thumbnails
      } catch (thumbnailError) {
        console.warn('Failed to create video thumbnail:', thumbnailError);
        thumbnailUrl = 'https://via.placeholder.com/400x225?text=Video';
      }
    }
    
    // Create media document in Firestore
    const mediaRef = collection(db, 'galleries', galleryId, 'media');
    
    const mediaData: Omit<GalleryMedia, 'id'> = {
      filename,
      originalFilename: file.name,
      url: videoUrl,
      thumbnailUrl,
      type: MediaType.VIDEO,
      size: file.size,
      width: metadata?.width || 0,
      height: metadata?.height || 0,
      featured: metadata?.featured || false,
      title: metadata?.title || file.name.split('.')[0].replace(/-/g, ' '),
      description: metadata?.description || '',
      tags: metadata?.tags || [],
      caption: metadata?.caption || '',
      duration: metadata?.duration || 0,
      clientSelected: false,
      photographerSelected: false,
      clientComment: '',
      
      // Enhanced metadata fields
      colorProfile: metadata?.colorProfile || 'sRGB',
      exposureData: metadata?.exposureData || undefined,
      location: metadata?.location || undefined,
      people: metadata?.people || [],
      categories: metadata?.categories || [],
      rating: metadata?.rating || 0,
      processingStatus: metadata?.processingStatus || 'unprocessed',
      deliveryStatus: metadata?.deliveryStatus || 'pending',
      downloadCount: 0,
      viewCount: 0,
      editHistory: [{
        editor: localStorage.getItem('userId') || 'unknown',
        timestamp: Timestamp.now(),
        action: 'uploaded'
      }],
      
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Add to Firestore
    const docRef = await addDoc(mediaRef, mediaData);
    console.log('Video document created with ID:', docRef.id);
    
    // Update gallery video count
    const galleryRef = doc(db, 'galleries', galleryId);
    const gallerySnap = await getDoc(galleryRef);
    
    if (gallerySnap.exists()) {
      await updateDoc(galleryRef, {
        imageCount: increment(1),
        updatedAt: Timestamp.now()
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error uploading gallery video:', error);
    throw error;
  }
};

// Get all media (images and videos) for a gallery
export const getGalleryMedia = async (galleryId: string): Promise<GalleryMedia[]> => {
  try {
    console.log(`Fetching media for gallery: ${galleryId}`);
    
    // Reference to the media collection
    const mediaRef = collection(db, 'galleries', galleryId, 'media');
    
    // Create query with ordering
    const q = query(mediaRef, orderBy('createdAt', 'desc'));
    
    // Execute query
    const querySnapshot = await getDocs(q);
    
    // Map results to GalleryMedia objects
    const media = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GalleryMedia));
    
    console.log(`Found ${media.length} media items for gallery ${galleryId}`);
    
    // Debug the first few items if available
    if (media.length > 0) {
      console.log('First media item:', JSON.stringify(media[0], null, 2));
    }
    
    return media;
  } catch (error) {
    console.error(`Error fetching media for gallery ${galleryId}:`, error);
    throw error;
  }
};

// Get media by category
export const getMediaByCategory = async (galleryId: string, category: string): Promise<GalleryMedia[]> => {
  try {
    const mediaRef = collection(db, 'galleries', galleryId, 'media');
    const q = query(
      mediaRef, 
      where('categories', 'array-contains', category),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GalleryMedia));
  } catch (error) {
    console.error(`Error getting media by category ${category}:`, error);
    throw error;
  }
};

// Get photographer selected media
export const getPhotographerSelections = async (galleryId: string): Promise<GalleryMedia[]> => {
  try {
    const mediaRef = collection(db, 'galleries', galleryId, 'media');
    const q = query(
      mediaRef, 
      where('photographerSelected', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GalleryMedia));
  } catch (error) {
    console.error('Error getting photographer selections:', error);
    throw error;
  }
};

// Update image metadata
export const updateGalleryImage = async (
  galleryId: string, 
  imageId: string, 
  imageData: Partial<GalleryMedia>
): Promise<void> => {
  try {
    // Changed from 'images' to 'media' to match getGalleryMedia function
    const imageRef = doc(db, 'galleries', galleryId, 'media', imageId);
    await updateDoc(imageRef, imageData);
  } catch (error) {
    console.error(`Error updating image ${imageId} in gallery ${galleryId}:`, error);
    throw error;
  }
};

// Delete an image from a gallery
export const deleteGalleryImage = async (galleryId: string, imageId: string): Promise<void> => {
  try {
    // Get image data to delete from storage
    const imageRef = doc(db, 'galleries', galleryId, 'media', imageId);
    const imageSnap = await getDoc(imageRef);
    
    if (imageSnap.exists()) {
      const imageData = imageSnap.data() as GalleryMedia;
      
      // Delete image file from storage
      try {
        await storageService.deleteFile(`galleries/${galleryId}/${imageData.filename}`);
        
        // Try to delete thumbnail if it exists
        try {
          await storageService.deleteFile(`galleries/${galleryId}/thumbnails/${imageData.filename}`);
        } catch (error) {
          // Ignore errors for thumbnail deletion
          console.log(`Thumbnail may not exist for ${imageData.filename}`);
        }
      } catch (error) {
        console.error(`Error deleting image files for ${imageId}:`, error);
      }
      
      // Delete image document
      await deleteDoc(imageRef);
      
      // Update gallery image count
      const galleryRef = doc(db, 'galleries', galleryId);
      const gallerySnap = await getDoc(galleryRef);
      
      if (gallerySnap.exists()) {
        const galleryData = gallerySnap.data() as Gallery;
        await updateDoc(galleryRef, {
          imageCount: Math.max(0, galleryData.imageCount - 1)
        });
      }
    }
  } catch (error) {
    console.error(`Error deleting image ${imageId} from gallery ${galleryId}:`, error);
    throw error;
  }
};

// Verify gallery password
export const verifyGalleryPassword = async (galleryId: string, password: string): Promise<boolean> => {
  try {
    const galleryRef = doc(db, 'galleries', galleryId);
    const gallerySnap = await getDoc(galleryRef);
    
    if (gallerySnap.exists()) {
      const galleryData = gallerySnap.data() as Gallery;
      
      if (!galleryData.isPasswordProtected) {
        return true;
      }
      
      return galleryData.password === password;
    }
    
    return false;
  } catch (error) {
    console.error(`Error verifying password for gallery ${galleryId}:`, error);
    throw error;
  }
};

// Update client selections for a gallery image
export const updateClientSelection = async (
  galleryId: string,
  imageId: string,
  isSelected: boolean,
  comment: string = ''
): Promise<void> => {
  try {
    const mediaRef = doc(db, 'galleries', galleryId, 'media', imageId);
    
    const updateData: Partial<GalleryMedia> = {
      clientSelected: isSelected,
      updatedAt: Timestamp.now()
    };
    
    if (comment) {
      updateData.clientComment = comment;
    }
    
    await updateDoc(mediaRef, updateData);
    console.log(`Client selection updated for image ${imageId} in gallery ${galleryId}`);
  } catch (error) {
    console.error('Error updating client selection:', error);
    throw error;
  }
};

// Update photographer selections for a gallery image
export const updatePhotographerSelection = async (
  galleryId: string,
  imageId: string,
  isSelected: boolean
): Promise<void> => {
  try {
    const mediaRef = doc(db, 'galleries', galleryId, 'media', imageId);
    
    await updateDoc(mediaRef, {
      photographerSelected: isSelected,
      updatedAt: Timestamp.now()
    });
    
    console.log(`Photographer selection updated for image ${imageId} in gallery ${galleryId}`);
  } catch (error) {
    console.error('Error updating photographer selection:', error);
    throw error;
  }
};

// Get client selections for a gallery
export const getClientSelections = async (galleryId: string): Promise<GalleryMedia[]> => {
  try {
    const mediaRef = collection(db, 'galleries', galleryId, 'media');
    const q = query(mediaRef, where('clientSelected', '==', true));
    
    const querySnapshot = await getDocs(q);
    const selections: GalleryMedia[] = [];
    
    querySnapshot.forEach((doc) => {
      selections.push({ id: doc.id, ...doc.data() } as GalleryMedia);
    });
    
    return selections;
  } catch (error) {
    console.error('Error getting client selections:', error);
    throw error;
  }
};

// Send client selection notification email
export const sendClientSelectionNotification = async (
  galleryId: string,
  recipientEmail: string
): Promise<void> => {
  try {
    // Get the gallery details
    const gallery = await getGallery(galleryId);
    if (!gallery) {
      throw new Error('Gallery not found');
    }

    // Get the selected images
    const selections = await getClientSelections(galleryId);
    
    // Call the API to send the notification
    const token = localStorage.getItem('token');
    const response = await fetch('/api/notifications/send-selection', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        galleryId, 
        recipientEmail,
        galleryTitle: gallery.title,
        selectionCount: selections.length,
        clientName: gallery.clientName || 'Client',
        photographerEmail: localStorage.getItem('userEmail') || undefined
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send notification');
    }
    
    // Update the gallery to mark that selections have been submitted
    await updateDoc(doc(db, 'galleries', galleryId), {
      selectionsSubmitted: true,
      selectionsSubmittedAt: serverTimestamp()
    });
    
    console.log(`Selection notification sent to ${recipientEmail} for gallery ${galleryId}`);
  } catch (error) {
    console.error('Error sending selection notification:', error);
    throw error;
  }
};

// Send gallery expiration reminder to client
export const sendGalleryExpirationReminder = async (
  galleryId: string
): Promise<void> => {
  try {
    // Get the gallery details
    const gallery = await getGallery(galleryId);
    if (!gallery) {
      throw new Error('Gallery not found');
    }
    
    // Check if the gallery has an expiry date and client email
    if (!gallery.expiryDate || !gallery.clientEmail) {
      throw new Error('Gallery does not have an expiry date or client email');
    }
    
    // Calculate days until expiration
    const now = Timestamp.now();
    const expiryMillis = gallery.expiryDate.toMillis();
    const daysUntilExpiry = Math.ceil((expiryMillis - now.toMillis()) / (1000 * 60 * 60 * 24));
    
    // Only send reminder if expiry is approaching (within 7 days) but not passed
    if (daysUntilExpiry <= 0 || daysUntilExpiry > 7) {
      console.log(`No reminder needed for gallery ${galleryId}. Days until expiry: ${daysUntilExpiry}`);
      return;
    }
    
    // Call the API to send the reminder
    const token = localStorage.getItem('token');
    const response = await fetch('/api/notifications/send-expiration-reminder', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        galleryId, 
        recipientEmail: gallery.clientEmail,
        galleryTitle: gallery.title,
        daysUntilExpiry,
        expiryDate: gallery.expiryDate.toDate().toLocaleDateString(),
        clientName: gallery.clientName || 'Client',
        galleryUrl: `${window.location.origin}/gallery/${gallery.slug}`
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send reminder');
    }
    
    // Update the gallery to mark that a reminder has been sent
    await updateDoc(doc(db, 'galleries', galleryId), {
      lastReminderSent: serverTimestamp()
    });
    
    console.log(`Expiration reminder sent to ${gallery.clientEmail} for gallery ${galleryId}`);
  } catch (error) {
    console.error('Error sending expiration reminder:', error);
    throw error;
  }
};

// Send selection deadline reminder to client
export const sendSelectionDeadlineReminder = async (
  galleryId: string
): Promise<void> => {
  try {
    // Get the gallery details
    const gallery = await getGallery(galleryId);
    if (!gallery) {
      throw new Error('Gallery not found');
    }
    
    // Check if the gallery has a selection deadline and client email
    if (!gallery.selectionDeadline || !gallery.clientEmail) {
      throw new Error('Gallery does not have a selection deadline or client email');
    }
    
    // Calculate days until deadline
    const now = Timestamp.now();
    const deadlineMillis = gallery.selectionDeadline.toMillis();
    const daysUntilDeadline = Math.ceil((deadlineMillis - now.toMillis()) / (1000 * 60 * 60 * 24));
    
    // Only send reminder if deadline is approaching (within 3 days) but not passed
    if (daysUntilDeadline <= 0 || daysUntilDeadline > 3) {
      console.log(`No deadline reminder needed for gallery ${galleryId}. Days until deadline: ${daysUntilDeadline}`);
      return;
    }
    
    // Call the API to send the reminder
    const token = localStorage.getItem('token');
    const response = await fetch('/api/notifications/send-deadline-reminder', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        galleryId, 
        recipientEmail: gallery.clientEmail,
        galleryTitle: gallery.title,
        daysUntilDeadline,
        deadlineDate: gallery.selectionDeadline.toDate().toLocaleDateString(),
        clientName: gallery.clientName || 'Client',
        galleryUrl: `${window.location.origin}/gallery/${gallery.slug}`,
        requiredSelections: gallery.requiredSelectionCount || 'any number of'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send deadline reminder');
    }
    
    // Update the gallery to mark that a deadline reminder has been sent
    await updateDoc(doc(db, 'galleries', galleryId), {
      lastDeadlineReminderSent: serverTimestamp()
    });
    
    console.log(`Selection deadline reminder sent to ${gallery.clientEmail} for gallery ${galleryId}`);
  } catch (error) {
    console.error('Error sending selection deadline reminder:', error);
    throw error;
  }
};

// Check if a gallery has expired
export const isGalleryExpired = (gallery: Gallery): boolean => {
  if (!gallery.expiryDate) return false;
  
  const now = Timestamp.now();
  return gallery.expiryDate.toMillis() < now.toMillis();
};

// Check if selection deadline has passed
export const hasSelectionDeadlinePassed = (gallery: Gallery): boolean => {
  if (!gallery.selectionDeadline) return false;
  
  const now = Timestamp.now();
  return gallery.selectionDeadline.toMillis() < now.toMillis();
};

// Generate a signed URL for a gallery (for sharing)
export const generateGalleryShareLink = async (
  galleryId: string,
  expirationHours: number = 48
): Promise<string> => {
  try {
    // In a real implementation, you would generate a signed URL or token
    // For now, we'll just return the gallery URL with a dummy token
    const gallery = await getGallery(galleryId);
    if (!gallery) {
      throw new Error('Gallery not found');
    }
    
    const token = btoa(`${galleryId}_${Date.now()}_${expirationHours}`);
    return `/gallery/${gallery.slug}?token=${token}`;
  } catch (error) {
    console.error('Error generating share link:', error);
    throw error;
  }
};

// Apply a watermark to gallery images (placeholder for server function)
export const toggleGalleryWatermark = async (
  galleryId: string,
  enabled: boolean
): Promise<void> => {
  try {
    const galleryRef = doc(db, 'galleries', galleryId);
    
    await updateDoc(galleryRef, {
      watermarkEnabled: enabled,
      updatedAt: Timestamp.now()
    });
    
    console.log(`Watermark ${enabled ? 'enabled' : 'disabled'} for gallery ${galleryId}`);
  } catch (error) {
    console.error('Error toggling watermark:', error);
    throw error;
  }
};

// Reset all featured galleries
export const resetAllFeaturedGalleries = async (): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const galleriesRef = collection(db, 'galleries');
    const q = query(galleriesRef, where('featured', '==', true));
    
    const featuredGalleries = await getDocs(q);
    
    featuredGalleries.forEach(doc => {
      batch.update(doc.ref, { featured: false });
    });
    
    await batch.commit();
    console.log('All featured galleries have been reset');
  } catch (error) {
    console.error('Error resetting featured galleries:', error);
    throw error;
  }
};

// Function to update the first featured gallery to "Anna and Jose's Wedding"
export const updateFirstFeaturedGallery = async () => {
  try {
    // Find the gallery with the title "Anna and Jose's Wedding"
    const galleriesRef = collection(db, 'galleries');
    const q = query(galleriesRef, where('title', '==', 'Anna and Jose\'s Wedding'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('Gallery not found');
      return;
    }
    
    // Update the gallery to be featured
    const galleryDoc = querySnapshot.docs[0];
    await updateDoc(galleryDoc.ref, {
      featured: true,
      displayLocation: 'landing',
      position: 'left',
      sortOrder: 1
    });
    
    console.log('Updated first featured gallery');
  } catch (error) {
    console.error('Error updating first featured gallery:', error);
  }
};

// Helper function to get image dimensions from a file
const getImageDimensionsFromFile = (file: File): Promise<{width: number, height: number}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image for dimension calculation'));
    };
    
    // Create a URL for the image
    const url = URL.createObjectURL(file);
    img.src = url;
    
    // Clean up the URL after loading
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height
      });
    };
  });
};

// Helper function to create a thumbnail in the browser
const createBrowserThumbnail = (file: File, maxWidth: number = 400): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Calculate new dimensions
        const aspectRatio = img.height / img.width;
        const width = Math.min(maxWidth, img.width);
        const height = Math.round(width * aspectRatio);
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create thumbnail blob'));
            }
          },
          'image/jpeg',
          0.85 // Quality
        );
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for thumbnail creation'));
    };
    
    // Load image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    reader.readAsDataURL(file);
  });
};

// Create sample galleries for testing
export const createSampleGalleries = async (): Promise<void> => {
  try {
    const sampleGalleries = [
      {
        title: "Mountain Wedding",
        slug: "mountain-wedding",
        description: "A beautiful wedding in the mountains of Colorado",
        coverImage: "https://source.unsplash.com/random/800x600/?wedding,mountain",
        thumbnailImage: "https://source.unsplash.com/random/400x300/?wedding,mountain",
        imageCount: 5,
        isPublished: true,
        isPasswordProtected: false,
        password: null,
        allowDownloads: true,
        allowSharing: true,
        clientName: "John & Sarah Smith",
        clientEmail: "john.sarah@example.com",
        expiryDate: Timestamp.fromDate(new Date(2025, 2, 15)),
        watermarkEnabled: false,
        selectionDeadline: Timestamp.fromDate(new Date(2025, 2, 15)),
        requiredSelectionCount: 10,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: "Beach Engagement",
        slug: "beach-engagement",
        description: "Romantic engagement photoshoot at sunset on the beach",
        coverImage: "https://source.unsplash.com/random/800x600/?engagement,beach",
        thumbnailImage: "https://source.unsplash.com/random/400x300/?engagement,beach",
        imageCount: 3,
        isPublished: true,
        isPasswordProtected: false,
        password: null,
        allowDownloads: true,
        allowSharing: true,
        clientName: "Michael & Emma Johnson",
        clientEmail: "michael.emma@example.com",
        expiryDate: Timestamp.fromDate(new Date(2025, 1, 10)),
        watermarkEnabled: false,
        selectionDeadline: Timestamp.fromDate(new Date(2025, 1, 10)),
        requiredSelectionCount: 5,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        title: "Urban Portrait Session",
        slug: "urban-portrait",
        description: "Modern portrait photography in an urban setting",
        coverImage: "https://source.unsplash.com/random/800x600/?portrait,urban",
        thumbnailImage: "https://source.unsplash.com/random/400x300/?portrait,urban",
        imageCount: 4,
        isPublished: true,
        isPasswordProtected: false,
        password: null,
        allowDownloads: true,
        allowSharing: true,
        clientName: "Alex Chen",
        clientEmail: "alex.chen@example.com",
        expiryDate: Timestamp.fromDate(new Date(2025, 0, 20)),
        watermarkEnabled: false,
        selectionDeadline: Timestamp.fromDate(new Date(2025, 0, 20)),
        requiredSelectionCount: 8,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];
    
    const galleriesRef = collection(db, 'galleries');
    
    // Check if galleries already exist
    const existingGalleries = await getDocs(query(galleriesRef, limit(1)));
    if (!existingGalleries.empty) {
      console.log('Galleries already exist, skipping sample creation');
      return;
    }
    
    // Create each sample gallery
    for (const gallery of sampleGalleries) {
      await addDoc(galleriesRef, gallery);
      console.log(`Created sample gallery: ${gallery.title}`);
    }
    
    console.log('Sample galleries created successfully');
  } catch (error) {
    console.error('Error creating sample galleries:', error);
    throw error;
  }
};

// Get galleries by venue ID
export const getGalleriesByVenue = async (venueId: string): Promise<Gallery[]> => {
  try {
    const galleriesRef = collection(db, 'galleries');
    const q = query(
      galleriesRef, 
      where('venueId', '==', venueId),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Gallery));
  } catch (error) {
    console.error(`Error getting galleries for venue ${venueId}:`, error);
    return [];
  }
};

// Get galleries by filter tag
export const getGalleriesByFilterTag = async (filterTag: string): Promise<Gallery[]> => {
  try {
    const galleriesRef = collection(db, 'galleries');
    const q = query(
      galleriesRef, 
      where('filterTags', 'array-contains', filterTag),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Gallery));
  } catch (error) {
    console.error(`Error getting galleries with filter tag ${filterTag}:`, error);
    return [];
  }
};

// Get galleries by multiple filter tags (any match)
export const getGalleriesByFilterTags = async (filterTags: string[]): Promise<Gallery[]> => {
  if (!filterTags.length) {
    return getPublicGalleries();
  }
  
  try {
    const galleriesRef = collection(db, 'galleries');
    const galleries: Gallery[] = [];
    const processedIds = new Set<string>();
    
    // We need to do multiple queries since Firestore doesn't support OR queries
    // with array-contains
    for (const tag of filterTags) {
      const q = query(
        galleriesRef, 
        where('filterTags', 'array-contains', tag),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((doc) => {
        if (!processedIds.has(doc.id)) {
          processedIds.add(doc.id);
          galleries.push({
            id: doc.id,
            ...doc.data()
          } as Gallery);
        }
      });
    }
    
    // Sort by createdAt in descending order
    return galleries.sort((a, b) => {
      const aTime = a.createdAt?.toMillis() || 0;
      const bTime = b.createdAt?.toMillis() || 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error('Error getting galleries with filter tags:', error);
    return [];
  }
};

// Add filter tags to a gallery
export const addFilterTagsToGallery = async (galleryId: string, filterTags: string[]): Promise<void> => {
  try {
    const galleryRef = doc(collection(db, 'galleries'), galleryId);
    const galleryDoc = await getDoc(galleryRef);
    
    if (!galleryDoc.exists()) {
      throw new Error(`Gallery ${galleryId} not found`);
    }
    
    const existingTags = galleryDoc.data().filterTags || [];
    const newTags = [...new Set([...existingTags, ...filterTags])];
    
    await updateDoc(galleryRef, {
      filterTags: newTags,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error adding filter tags to gallery ${galleryId}:`, error);
    throw error;
  }
};

// Remove filter tags from a gallery
export const removeFilterTagsFromGallery = async (galleryId: string, filterTags: string[]): Promise<void> => {
  try {
    const galleryRef = doc(db, 'galleries', galleryId);
    const gallerySnap = await getDoc(galleryRef);
    
    if (gallerySnap.exists()) {
      const galleryData = gallerySnap.data() as Gallery;
      const currentTags = galleryData.filterTags || [];
      
      // Remove specified tags
      const updatedTags = currentTags.filter((tag: string) => !filterTags.includes(tag));
      
      // Update gallery document
      await updateDoc(galleryRef, {
        filterTags: updatedTags,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error removing filter tags from gallery:', error);
    throw error;
  }
};

// Associate a gallery with a venue
export const associateGalleryWithVenue = async (galleryId: string, venueId: string): Promise<void> => {
  try {
    const galleryRef = doc(collection(db, 'galleries'), galleryId);
    
    await updateDoc(galleryRef, {
      venueId,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error associating gallery ${galleryId} with venue ${venueId}:`, error);
    throw error;
  }
};

// Remove venue association from a gallery
export const removeVenueAssociation = async (galleryId: string): Promise<void> => {
  try {
    const galleryRef = doc(collection(db, 'galleries'), galleryId);
    
    await updateDoc(galleryRef, {
      venueId: null,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error removing venue association from gallery ${galleryId}:`, error);
    throw error;
  }
};

// Track when an image is viewed
export const trackImageView = async (galleryId: string, imageId: string): Promise<void> => {
  try {
    const mediaRef = doc(db, 'galleries', galleryId, 'media', imageId);
    const mediaSnap = await getDoc(mediaRef);
    
    if (mediaSnap.exists()) {
      const mediaData = mediaSnap.data() as GalleryMedia;
      const currentViewCount = mediaData.viewCount || 0;
      
      await updateDoc(mediaRef, {
        viewCount: currentViewCount + 1,
        lastViewed: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error tracking image view:', error);
    // Don't throw the error - this is a non-critical operation
  }
};

// Track when an image is downloaded
export const trackImageDownload = async (galleryId: string, imageId: string): Promise<void> => {
  try {
    const mediaRef = doc(db, 'galleries', galleryId, 'media', imageId);
    const mediaSnap = await getDoc(mediaRef);
    
    if (mediaSnap.exists()) {
      const mediaData = mediaSnap.data() as GalleryMedia;
      const currentDownloadCount = mediaData.downloadCount || 0;
      
      await updateDoc(mediaRef, {
        downloadCount: currentDownloadCount + 1,
        updatedAt: Timestamp.now(),
        editHistory: arrayUnion({
          editor: localStorage.getItem('userId') || 'client',
          timestamp: Timestamp.now(),
          action: 'downloaded'
        })
      });
    }
  } catch (error) {
    console.error('Error tracking image download:', error);
    // Don't throw the error - this is a non-critical operation
  }
};

// Batch update media with categories or tags
export const batchUpdateMedia = async (
  galleryId: string,
  mediaIds: string[],
  updates: Partial<GalleryMedia>
): Promise<void> => {
  try {
    // Firebase doesn't support true batch updates across multiple documents with different data
    // So we'll use a batched write for the same update across multiple documents
    const batch = writeBatch(db);
    
    // Add edit history entry
    const historyEntry = {
      editor: localStorage.getItem('userId') || 'unknown',
      timestamp: Timestamp.now(),
      action: `batch updated ${Object.keys(updates).join(', ')}`
    };
    
    // Prepare the update data
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
      editHistory: arrayUnion(historyEntry)
    };
    
    // Add each document to the batch
    mediaIds.forEach(mediaId => {
      const mediaRef = doc(db, 'galleries', galleryId, 'media', mediaId);
      batch.update(mediaRef, updateData);
    });
    
    // Commit the batch
    await batch.commit();
    console.log(`Batch updated ${mediaIds.length} media items`);
  } catch (error) {
    console.error('Error batch updating media:', error);
    throw error;
  }
};

// Get media analytics for a gallery
export const getGalleryMediaAnalytics = async (galleryId: string): Promise<{
  totalViews: number;
  totalDownloads: number;
  mostViewedImages: GalleryMedia[];
  mostDownloadedImages: GalleryMedia[];
  selectionRate: number;
}> => {
  try {
    const mediaRef = collection(db, 'galleries', galleryId, 'media');
    const querySnapshot = await getDocs(mediaRef);
    
    let totalViews = 0;
    let totalDownloads = 0;
    let totalSelected = 0;
    const media: GalleryMedia[] = [];
    
    querySnapshot.forEach(doc => {
      const data = doc.data() as Omit<GalleryMedia, 'id'>;
      const mediaItem = {
        id: doc.id,
        ...data
      } as GalleryMedia;
      
      totalViews += mediaItem.viewCount || 0;
      totalDownloads += mediaItem.downloadCount || 0;
      if (mediaItem.clientSelected) totalSelected++;
      
      media.push(mediaItem);
    });
    
    // Sort by views and downloads
    const mostViewedImages = [...media].sort((a, b) => 
      (b.viewCount || 0) - (a.viewCount || 0)
    ).slice(0, 10);
    
    const mostDownloadedImages = [...media].sort((a, b) => 
      (b.downloadCount || 0) - (a.downloadCount || 0)
    ).slice(0, 10);
    
    const selectionRate = media.length > 0 ? (totalSelected / media.length) * 100 : 0;
    
    return {
      totalViews,
      totalDownloads,
      mostViewedImages,
      mostDownloadedImages,
      selectionRate
    };
  } catch (error) {
    console.error('Error getting gallery media analytics:', error);
    throw error;
  }
};

// For backward compatibility
export const getGalleryImages = getGalleryMedia;

// For backward compatibility
export const getGalleryById = getGallery;

// For backward compatibility
export const getFeaturedGalleryImages = getMediaByCategory;

// Helper function to generate a URL-friendly slug from a title
const generateSlug = (title: string): string => {
  // Convert to lowercase, replace spaces with hyphens, remove special characters
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .trim();
  
  // Add a timestamp to ensure uniqueness
  return `${slug}-${Date.now().toString().slice(-6)}`;
};
