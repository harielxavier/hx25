import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit,
  Timestamp,
  documentId,
  QueryConstraint,
  startAfter,
  endBefore,
  startAt,
  endAt,
  collectionGroup
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { PortfolioCategory, PortfolioImage } from './portfolioCategoryService';
import portfolioCategoryService from './portfolioCategoryService';
import cloudinaryService from './cloudinaryService';

// Enhanced filtering interfaces
export interface FilterOptions {
  categories?: string[];
  tags?: string[];
  cameras?: string[];
  lenses?: string[];
  locations?: string[];
  apertures?: string[];
  shutterSpeeds?: string[];
  isoValues?: number[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  featured?: boolean;
  sortBy?: 'dateCreated' | 'title' | 'featured' | 'order';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  startAfter?: string; // Document ID to start after (for pagination)
}

export interface FilterableAttribute {
  id: string;
  label: string;
  count: number;
}

export interface FilterableAttributes {
  categories: FilterableAttribute[];
  tags: FilterableAttribute[];
  cameras: FilterableAttribute[];
  lenses: FilterableAttribute[];
  locations: FilterableAttribute[];
  apertures: FilterableAttribute[];
  shutterSpeeds: FilterableAttribute[];
  isoValues: FilterableAttribute[];
}

/**
 * Get all portfolio images across all categories with advanced filtering
 * @param options Filter options
 * @returns Array of portfolio images matching the filters
 */
export const getFilteredPortfolioImages = async (
  options: FilterOptions = {}
): Promise<PortfolioImage[]> => {
  try {
    // Start with a collection group query to search across all categories
    const imagesRef = collectionGroup(db, 'images');
    const constraints: QueryConstraint[] = [];
    
    // Apply category filter if specified
    if (options.categories && options.categories.length > 0) {
      // We need to get the parent path for each category
      const categoryPaths = options.categories.map(
        categoryId => doc(db, 'portfolios', categoryId).path
      );
      
      // Add constraint to filter by parent path
      constraints.push(where('__parentPath__', 'in', categoryPaths));
    }
    
    // Apply tag filter if specified
    if (options.tags && options.tags.length > 0) {
      // For multiple tags, we need to use array-contains-any
      constraints.push(where('tags', 'array-contains-any', options.tags));
    }
    
    // Apply camera filter if specified
    if (options.cameras && options.cameras.length > 0) {
      constraints.push(where('metadata.camera', 'in', options.cameras));
    }
    
    // Apply lens filter if specified
    if (options.lenses && options.lenses.length > 0) {
      constraints.push(where('metadata.lens', 'in', options.lenses));
    }
    
    // Apply location filter if specified
    if (options.locations && options.locations.length > 0) {
      constraints.push(where('metadata.location', 'in', options.locations));
    }
    
    // Apply aperture filter if specified
    if (options.apertures && options.apertures.length > 0) {
      constraints.push(where('metadata.aperture', 'in', options.apertures));
    }
    
    // Apply shutter speed filter if specified
    if (options.shutterSpeeds && options.shutterSpeeds.length > 0) {
      constraints.push(where('metadata.shutterSpeed', 'in', options.shutterSpeeds));
    }
    
    // Apply ISO filter if specified
    if (options.isoValues && options.isoValues.length > 0) {
      constraints.push(where('metadata.iso', 'in', options.isoValues));
    }
    
    // Apply date range filter if specified
    if (options.dateRange) {
      constraints.push(
        where('dateCreated', '>=', Timestamp.fromDate(options.dateRange.start)),
        where('dateCreated', '<=', Timestamp.fromDate(options.dateRange.end))
      );
    }
    
    // Apply featured filter if specified
    if (options.featured !== undefined) {
      constraints.push(where('featured', '==', options.featured));
    }
    
    // Apply sorting
    const sortField = options.sortBy || 'order';
    const sortDirection = options.sortDirection || 'asc';
    constraints.push(orderBy(sortField, sortDirection));
    
    // Apply pagination if specified
    if (options.startAfter) {
      // Get the document to start after
      const startAfterDoc = await getDoc(doc(db, options.startAfter));
      if (startAfterDoc.exists()) {
        constraints.push(startAfter(startAfterDoc));
      }
    }
    
    // Apply limit if specified
    if (options.limit) {
      constraints.push(limit(options.limit));
    }
    
    // Execute the query
    const q = query(imagesRef, ...constraints);
    const snapshot = await getDocs(q);
    
    // Map the results to PortfolioImage objects
    const images = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Extract the category ID from the parent path
        categoryId: doc.ref.parent.parent?.id
      } as PortfolioImage & { categoryId: string };
    });
    
    return images;
  } catch (error) {
    console.error('Error getting filtered portfolio images:', error);
    return [];
  }
};

/**
 * Get all available filterable attributes with counts
 * @returns Object containing all filterable attributes with counts
 */
export const getFilterableAttributes = async (): Promise<FilterableAttributes> => {
  try {
    // Get all portfolio images
    const allImages: PortfolioImage[] = [];
    const categories = await portfolioCategoryService.getPortfolioCategories();
    
    for (const category of categories) {
      const images = await portfolioCategoryService.getPortfolioImages(category.id);
      allImages.push(...images);
    }
    
    // Extract and count all attributes
    const attributes: FilterableAttributes = {
      categories: [],
      tags: [],
      cameras: [],
      lenses: [],
      locations: [],
      apertures: [],
      shutterSpeeds: [],
      isoValues: []
    };
    
    // Count categories
    const categoryMap = new Map<string, number>();
    for (const image of allImages) {
      const categoryId = (image as any).categoryId;
      if (categoryId) {
        categoryMap.set(categoryId, (categoryMap.get(categoryId) || 0) + 1);
      }
    }
    
    // Map categories to FilterableAttribute objects
    attributes.categories = Array.from(categoryMap.entries()).map(([id, count]) => {
      const category = categories.find(c => c.id === id);
      return {
        id,
        label: category?.title || 'Unknown Category',
        count
      };
    });
    
    // Count tags
    const tagMap = new Map<string, number>();
    for (const image of allImages) {
      if (image.tags && Array.isArray(image.tags)) {
        for (const tag of image.tags) {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        }
      }
    }
    
    // Map tags to FilterableAttribute objects
    attributes.tags = Array.from(tagMap.entries()).map(([id, count]) => ({
      id,
      label: id,
      count
    }));
    
    // Count cameras
    const cameraMap = new Map<string, number>();
    for (const image of allImages) {
      if (image.metadata?.camera) {
        cameraMap.set(image.metadata.camera, (cameraMap.get(image.metadata.camera) || 0) + 1);
      }
    }
    
    // Map cameras to FilterableAttribute objects
    attributes.cameras = Array.from(cameraMap.entries()).map(([id, count]) => ({
      id,
      label: id,
      count
    }));
    
    // Count lenses
    const lensMap = new Map<string, number>();
    for (const image of allImages) {
      if (image.metadata?.lens) {
        lensMap.set(image.metadata.lens, (lensMap.get(image.metadata.lens) || 0) + 1);
      }
    }
    
    // Map lenses to FilterableAttribute objects
    attributes.lenses = Array.from(lensMap.entries()).map(([id, count]) => ({
      id,
      label: id,
      count
    }));
    
    // Count locations
    const locationMap = new Map<string, number>();
    for (const image of allImages) {
      if (image.metadata?.location) {
        locationMap.set(image.metadata.location, (locationMap.get(image.metadata.location) || 0) + 1);
      }
    }
    
    // Map locations to FilterableAttribute objects
    attributes.locations = Array.from(locationMap.entries()).map(([id, count]) => ({
      id,
      label: id,
      count
    }));
    
    // Count apertures
    const apertureMap = new Map<string, number>();
    for (const image of allImages) {
      if (image.metadata?.aperture) {
        apertureMap.set(image.metadata.aperture, (apertureMap.get(image.metadata.aperture) || 0) + 1);
      }
    }
    
    // Map apertures to FilterableAttribute objects
    attributes.apertures = Array.from(apertureMap.entries()).map(([id, count]) => ({
      id,
      label: id,
      count
    }));
    
    // Count shutter speeds
    const shutterSpeedMap = new Map<string, number>();
    for (const image of allImages) {
      if (image.metadata?.shutterSpeed) {
        shutterSpeedMap.set(image.metadata.shutterSpeed, (shutterSpeedMap.get(image.metadata.shutterSpeed) || 0) + 1);
      }
    }
    
    // Map shutter speeds to FilterableAttribute objects
    attributes.shutterSpeeds = Array.from(shutterSpeedMap.entries()).map(([id, count]) => ({
      id,
      label: id,
      count
    }));
    
    // Count ISO values
    const isoMap = new Map<number, number>();
    for (const image of allImages) {
      if (image.metadata?.iso) {
        isoMap.set(image.metadata.iso, (isoMap.get(image.metadata.iso) || 0) + 1);
      }
    }
    
    // Map ISO values to FilterableAttribute objects
    attributes.isoValues = Array.from(isoMap.entries()).map(([id, count]) => ({
      id: id.toString(),
      label: id.toString(),
      count
    }));
    
    return attributes;
  } catch (error) {
    console.error('Error getting filterable attributes:', error);
    return {
      categories: [],
      tags: [],
      cameras: [],
      lenses: [],
      locations: [],
      apertures: [],
      shutterSpeeds: [],
      isoValues: []
    };
  }
};

/**
 * Get related images based on tags, camera, lens, etc.
 * @param imageId ID of the image to find related images for
 * @param categoryId ID of the category containing the image
 * @param limit Maximum number of related images to return
 * @returns Array of related portfolio images
 */
export const getRelatedImages = async (
  imageId: string,
  categoryId: string,
  limit = 8
): Promise<PortfolioImage[]> => {
  try {
    // Get the source image
    const sourceImage = await portfolioCategoryService.getPortfolioImage(categoryId, imageId);
    
    if (!sourceImage) {
      return [];
    }
    
    // Extract tags and metadata to find related images
    const { tags, metadata } = sourceImage;
    
    // Build filter options
    const options: FilterOptions = {
      tags: tags && tags.length > 0 ? [tags[0]] : undefined, // Use the first tag
      limit: limit + 1 // Add 1 to account for the source image
    };
    
    // Add camera if available
    if (metadata?.camera) {
      options.cameras = [metadata.camera];
    }
    
    // Get related images
    const relatedImages = await getFilteredPortfolioImages(options);
    
    // Filter out the source image
    return relatedImages.filter(img => img.id !== imageId);
  } catch (error) {
    console.error('Error getting related images:', error);
    return [];
  }
};

/**
 * Get portfolio images with before/after comparisons
 * @returns Array of portfolio images with before/after pairs
 */
export const getBeforeAfterImages = async (): Promise<{
  before: PortfolioImage;
  after: PortfolioImage;
}[]> => {
  try {
    // Get all images
    const allImages: PortfolioImage[] = [];
    const categories = await portfolioCategoryService.getPortfolioCategories();
    
    for (const category of categories) {
      const images = await portfolioCategoryService.getPortfolioImages(category.id);
      allImages.push(...images);
    }
    
    // Find images with before/after tags
    const beforeImages = allImages.filter(img => 
      img.tags && img.tags.includes('before')
    );
    
    const afterImages = allImages.filter(img => 
      img.tags && img.tags.includes('after')
    );
    
    // Match before/after pairs by title or other metadata
    const pairs: { before: PortfolioImage; after: PortfolioImage; }[] = [];
    
    for (const beforeImg of beforeImages) {
      // Try to find a matching after image by title (removing "before" from the title)
      const titleWithoutBefore = beforeImg.title.replace(/\s*before\s*/i, '').trim();
      const matchingAfter = afterImages.find(img => 
        img.title.replace(/\s*after\s*/i, '').trim() === titleWithoutBefore
      );
      
      if (matchingAfter) {
        pairs.push({
          before: beforeImg,
          after: matchingAfter
        });
      }
    }
    
    return pairs;
  } catch (error) {
    console.error('Error getting before/after images:', error);
    return [];
  }
};

export default {
  getFilteredPortfolioImages,
  getFilterableAttributes,
  getRelatedImages,
  getBeforeAfterImages
};
