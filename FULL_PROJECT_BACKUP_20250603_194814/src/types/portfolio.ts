// Portfolio types for the revamped structure

/**
 * Venue category (e.g., Luxury Ballrooms, Garden Estates)
 */
export interface VenueCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Venue (e.g., The Legacy Castle, Park Chateau)
 */
export interface Venue {
  id: string;
  name: string;
  location: string;
  categoryId: string;
  thumbnailImage: string;
  gallerySlug: string;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Portfolio filter types
 */
export enum FilterType {
  STYLE = 'style',
  EVENT_TYPE = 'eventType',
  ENVIRONMENT = 'environment',
  SEASON = 'season'
}

/**
 * Portfolio filter (e.g., Classic, Urban, Indoor)
 */
export interface PortfolioFilter {
  id: string;
  name: string;
  type: FilterType;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Extended gallery interface with venue and filter information
 */
export interface ExtendedGallery {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  thumbnailImage: string;
  category: string;
  venueId?: string;
  filterTags: string[];
  featured: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
