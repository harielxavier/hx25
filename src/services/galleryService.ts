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
  gallery_id: string;
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
  duration?: number;
  color_profile?: string;
  exposure_data?: Record<string, unknown>;
  location?: Record<string, unknown>;
  people?: string[];
  categories?: string[];
  rating?: number;
  processing_status?: 'unprocessed' | 'processing' | 'processed';
  delivery_status?: 'pending' | 'delivered';
  download_count?: number;
  view_count?: number;
  last_viewed?: string;
  edit_history?: Array<{ editor: string; timestamp: string; action: string }>;
  created_at: string;
  updated_at: string;
}

// Helper: Convert database row to Gallery
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

// CORE READ OPERATIONS
export const getAllGalleries = async (): Promise<Gallery[]> => {
  try {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ? data.map((row: Record<string, unknown>) => convertRowToGallery(row)) : [];
  } catch (error) {
    console.error('Error getting all galleries:', error);
    throw error;
  }
};

export const getPublicGalleries = async (): Promise<Gallery[]> => {
  try {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ? data.map((row: Record<string, unknown>) => convertRowToGallery(row)) : [];
  } catch (error) {
    console.error('Error getting public galleries:', error);
    throw error;
  }
};

export const getGallery = async (galleryId: string): Promise<Gallery | null> => {
  try {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('id', galleryId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data ? convertRowToGallery(data as Record<string, unknown>) : null;
  } catch (error) {
    console.error(`Error getting gallery ${galleryId}:`, error);
    throw error;
  }
};

export const getGalleryBySlug = async (slug: string): Promise<Gallery | null> => {
  try {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data ? convertRowToGallery(data as Record<string, unknown>) : null;
  } catch (error) {
    console.error(`Error getting gallery by slug ${slug}:`, error);
    throw error;
  }
};

export const getGalleriesByCategory = async (category: string): Promise<Gallery[]> => {
  try {
    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('category', category)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ? data.map((row: Record<string, unknown>) => convertRowToGallery(row)) : [];
  } catch (error) {
    console.error(`Error getting galleries for category ${category}:`, error);
    throw error;
  }
};

// CORE WRITE OPERATIONS
export const createGallery = async (galleryData: Partial<Gallery>): Promise<string> => {
  try {
    const slug = galleryData.slug || generateSlug(galleryData.title || 'untitled-gallery');
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('galleries')
      .insert([{
        ...galleryData,
        slug,
        image_count: 0,
        is_published: false,
        created_at: now,
        updated_at: now
      }])
      .select('id')
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');

    console.log('Gallery created with ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error creating gallery:', error);
    throw error;
  }
};

export const updateGallery = async (galleryId: string, galleryData: Partial<Gallery>): Promise<void> => {
  try {
    // Check slug uniqueness if updating
    if (galleryData.slug) {
      const { data: existing } = await supabase
        .from('galleries')
        .select('id')
        .eq('slug', galleryData.slug)
        .neq('id', galleryId)
        .single();

      if (existing) {
        throw new Error('A gallery with this slug already exists');
      }
    }

    const { error } = await supabase
      .from('galleries')
      .update({
        ...galleryData,
        updated_at: new Date().toISOString()
      })
      .eq('id', galleryId);

    if (error) throw error;
  } catch (error) {
    console.error(`Error updating gallery ${galleryId}:`, error);
    throw error;
  }
};

export const deleteGallery = async (galleryId: string): Promise<void> => {
  try {
    console.log(`Deleting gallery ${galleryId}`);

    // Delete all media records
    const { data: mediaData } = await supabase
      .from('gallery_media')
      .select('filename')
      .eq('gallery_id', galleryId);

    // Delete media records from database
    const { error: deleteMediaError } = await supabase
      .from('gallery_media')
      .delete()
      .eq('gallery_id', galleryId);

    if (deleteMediaError) throw deleteMediaError;

    // Delete storage files
    if (mediaData) {
      for (const media of mediaData) {
        try {
          await storageService.deleteFile(`galleries/${galleryId}/${media.filename}`);
          await storageService.deleteFile(`galleries/${galleryId}/thumbnails/${media.filename}`);
        } catch (err) {
          console.warn(`Could not delete storage files for ${media.filename}:`, err);
        }
      }
    }

    // Delete gallery record
    const { error: deleteGalleryError } = await supabase
      .from('galleries')
      .delete()
      .eq('id', galleryId);

    if (deleteGalleryError) throw deleteGalleryError;
    console.log(`Gallery ${galleryId} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting gallery ${galleryId}:`, error);
    throw error;
  }
};

// MEDIA OPERATIONS
export const getGalleryMedia = async (galleryId: string): Promise<GalleryMedia[]> => {
  try {
    console.log(`Fetching media for gallery: ${galleryId}`);

    const { data, error } = await supabase
      .from('gallery_media')
      .select('*')
      .eq('gallery_id', galleryId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching media for gallery ${galleryId}:`, error);
    throw error;
  }
};

export const uploadGalleryImage = async (
  galleryId: string,
  file: File,
  metadata: Partial<GalleryMedia>
): Promise<string> => {
  try {
    console.log(`Uploading image to gallery ${galleryId}:`, file.name);

    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${file.name.split('.')[0].replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${extension}`;

    // Upload to storage
    const storagePath = `galleries/${galleryId}/${filename}`;
    const { url: imageUrl } = await storageService.uploadFile(storagePath, file);

    // Create thumbnail
    let thumbnailUrl = '';
    try {
      const thumbnailBlob = await createBrowserThumbnail(file, 400);
      const thumbPath = `galleries/${galleryId}/thumbnails/thumb_${filename}`;
      const { url: thumbUrl } = await storageService.uploadFile(thumbPath, thumbnailBlob, { contentType: 'image/jpeg' });
      thumbnailUrl = thumbUrl;
    } catch (err) {
      console.warn('Failed to create thumbnail:', err);
      thumbnailUrl = imageUrl;
    }

    // Get image dimensions
    let width = metadata.width || 0;
    let height = metadata.height || 0;
    if (!width || !height) {
      try {
        const dims = await getImageDimensionsFromFile(file);
        width = dims.width;
        height = dims.height;
      } catch (err) {
        console.warn('Failed to get dimensions:', err);
      }
    }

    // Create media record
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('gallery_media')
      .insert([{
        gallery_id: galleryId,
        filename,
        original_filename: file.name,
        url: imageUrl,
        thumbnail_url: thumbnailUrl,
        type: MediaType.IMAGE,
        size: file.size,
        width,
        height,
        title: metadata.title || file.name.split('.')[0],
        description: metadata.description || '',
        tags: metadata.tags || [],
        featured: false,
        client_selected: false,
        photographer_selected: false,
        client_comment: '',
        view_count: 0,
        download_count: 0,
        created_at: now,
        updated_at: now
      }])
      .select('id')
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    // Update gallery image count
    const { data: gallery } = await supabase
      .from('galleries')
      .select('image_count')
      .eq('id', galleryId)
      .single();

    if (gallery) {
      const newCount = (gallery.image_count || 0) + 1;
      await supabase
        .from('galleries')
        .update({ image_count: newCount, updated_at: now })
        .eq('id', galleryId);

      // Set as cover if first image
      if (newCount === 1) {
        await supabase
          .from('galleries')
          .update({ cover_image: imageUrl, thumbnail_image: thumbnailUrl })
          .eq('id', galleryId);
      }
    }

    return data.id;
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    throw error;
  }
};

// Upload video to gallery
export const uploadGalleryVideo = async (
  galleryId: string,
  file: File,
  metadata: Partial<GalleryMedia>
): Promise<string> => {
  try {
    console.log(`Uploading video to gallery ${galleryId}:`, file.name);

    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'mp4';
    const filename = `${timestamp}-${file.name.split('.')[0].replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${extension}`;

    // Upload to storage
    const storagePath = `galleries/${galleryId}/videos/${filename}`;
    const { url: videoUrl } = await storageService.uploadFile(storagePath, file);

    // Create media record
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('gallery_media')
      .insert([{
        gallery_id: galleryId,
        filename,
        original_filename: file.name,
        url: videoUrl,
        thumbnail_url: videoUrl, // Could generate video thumbnail
        type: MediaType.VIDEO,
        size: file.size,
        width: metadata.width || 0,
        height: metadata.height || 0,
        duration: metadata.duration || 0,
        title: metadata.title || file.name.split('.')[0],
        description: metadata.description || '',
        tags: metadata.tags || [],
        featured: false,
        client_selected: false,
        photographer_selected: false,
        client_comment: '',
        view_count: 0,
        download_count: 0,
        created_at: now,
        updated_at: now
      }])
      .select('id')
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned');

    console.log('Video uploaded successfully:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error uploading gallery video:', error);
    throw error;
  }
};

export const getPhotographerSelections = async (galleryId: string): Promise<GalleryMedia[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_media')
      .select('*')
      .eq('gallery_id', galleryId)
      .eq('photographer_selected', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting photographer selections:', error);
    throw error;
  }
};

export const getClientSelections = async (galleryId: string): Promise<GalleryMedia[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_media')
      .select('*')
      .eq('gallery_id', galleryId)
      .eq('client_selected', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting client selections:', error);
    throw error;
  }
};

export const updateGalleryImage = async (
  galleryId: string,
  imageId: string,
  imageData: Partial<GalleryMedia>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('gallery_media')
      .update({
        ...imageData,
        updated_at: new Date().toISOString()
      })
      .eq('id', imageId)
      .eq('gallery_id', galleryId);

    if (error) throw error;
  } catch (error) {
    console.error(`Error updating image ${imageId}:`, error);
    throw error;
  }
};

export const deleteGalleryImage = async (galleryId: string, imageId: string): Promise<void> => {
  try {
    const { data: media } = await supabase
      .from('gallery_media')
      .select('filename')
      .eq('id', imageId)
      .single();

    if (media) {
      try {
        await storageService.deleteFile(`galleries/${galleryId}/${media.filename}`);
        await storageService.deleteFile(`galleries/${galleryId}/thumbnails/${media.filename}`);
      } catch (err) {
        console.warn('Storage file deletion failed:', err);
      }
    }

    const { error: deleteError } = await supabase
      .from('gallery_media')
      .delete()
      .eq('id', imageId);

    if (deleteError) throw deleteError;

    // Update gallery image count
    const { data: gallery } = await supabase
      .from('galleries')
      .select('image_count')
      .eq('id', galleryId)
      .single();

    if (gallery) {
      await supabase
        .from('galleries')
        .update({ image_count: Math.max(0, (gallery.image_count || 1) - 1) })
        .eq('id', galleryId);
    }
  } catch (error) {
    console.error(`Error deleting image ${imageId}:`, error);
    throw error;
  }
};

export const updateClientSelection = async (
  galleryId: string,
  imageId: string,
  isSelected: boolean,
  comment: string = ''
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('gallery_media')
      .update({
        client_selected: isSelected,
        client_comment: comment,
        updated_at: new Date().toISOString()
      })
      .eq('id', imageId)
      .eq('gallery_id', galleryId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating client selection:', error);
    throw error;
  }
};

export const updatePhotographerSelection = async (
  galleryId: string,
  imageId: string,
  isSelected: boolean
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('gallery_media')
      .update({
        photographer_selected: isSelected,
        updated_at: new Date().toISOString()
      })
      .eq('id', imageId)
      .eq('gallery_id', galleryId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating photographer selection:', error);
    throw error;
  }
};

export const trackImageView = async (_galleryId: string, imageId: string): Promise<void> => {
  try {
    const { data: media } = await supabase
      .from('gallery_media')
      .select('view_count')
      .eq('id', imageId)
      .single();

    if (media) {
      const newCount = (media.view_count || 0) + 1;
      await supabase
        .from('gallery_media')
        .update({
          view_count: newCount,
          last_viewed: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', imageId);
    }
  } catch (error) {
    console.warn('Error tracking image view:', error);
  }
};

export const trackImageDownload = async (_galleryId: string, imageId: string): Promise<void> => {
  try {
    const { data: media } = await supabase
      .from('gallery_media')
      .select('download_count')
      .eq('id', imageId)
      .single();

    if (media) {
      const newCount = (media.download_count || 0) + 1;
      await supabase
        .from('gallery_media')
        .update({
          download_count: newCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', imageId);
    }
  } catch (error) {
    console.warn('Error tracking image download:', error);
  }
};

// UTILITY FUNCTIONS
const generateSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-{2,}/g, '-')
    .trim();

  return `${slug}-${Date.now().toString().slice(-6)}`;
};

const getImageDimensionsFromFile = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image dimensions'));
    };

    img.src = url;
  });
};

const createBrowserThumbnail = (file: File, maxWidth: number = 400): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          const aspectRatio = img.height / img.width;
          const width = Math.min(maxWidth, img.width);
          const height = Math.round(width * aspectRatio);

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Failed to get canvas context');

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to create thumbnail'));
            },
            'image/jpeg',
            0.85
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Verify gallery password
export const verifyGalleryPassword = async (galleryId: string, password: string): Promise<boolean> => {
  try {
    const { data: gallery, error } = await supabase
      .from('galleries')
      .select('is_password_protected, password')
      .eq('id', galleryId)
      .single();

    if (error || !gallery) {
      return false;
    }

    if (!gallery.is_password_protected) {
      return true;
    }

    return gallery.password === password;
  } catch (error) {
    console.error(`Error verifying password for gallery ${galleryId}:`, error);
    return false;
  }
};

// Create sample galleries for testing
export const createSampleGalleries = async (): Promise<void> => {
  try {
    const sampleGalleries = [
      {
        title: 'Sample Wedding Gallery',
        description: 'Beautiful wedding at Legacy Castle',
        category: 'wedding',
        is_public: true,
        show_on_website: true,
        gallery_type: 'portfolio',
        venue: 'Legacy Castle'
      },
      {
        title: 'Sample Engagement Session',
        description: 'Romantic engagement photos',
        category: 'engagement',
        is_public: true,
        show_on_website: true,
        gallery_type: 'portfolio'
      }
    ];

    for (const gallery of sampleGalleries) {
      await createGallery(gallery);
      console.log(`Created sample gallery: ${gallery.title}`);
    }

    console.log('Sample galleries created successfully');
  } catch (error) {
    console.error('Error creating sample galleries:', error);
    throw error;
  }
};

// BACKWARD COMPATIBILITY
export const getGalleryImages = getGalleryMedia;
export const getGalleryById = getGallery;
export const getFeaturedGalleryImages = getPhotographerSelections;
export const hasSelectionDeadlinePassed = (deadline?: string): boolean => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};


// Additional client functions
export const submitClientSelections = async (galleryId: string, selectedImageIds: string[]): Promise<boolean> => {
  try {
    for (const imageId of selectedImageIds) {
      await updateClientSelection(galleryId, imageId, true);
    }
    return true;
  } catch (error) {
    console.error('Error submitting client selections:', error);
    return false;
  }
};

// Stub client management functions
export const getAllClients = async (): Promise<any[]> => { return []; };
export const updateGalleryAccessSettings = async (): Promise<boolean> => { return true; };
export const getClientGalleries = async (): Promise<any[]> => { return []; };
export const sendClientAccessEmail = async (): Promise<boolean> => { return true; };
export const deleteClient = async (): Promise<boolean> => { return true; };
