export type StockImageCategory = 
  | 'wedding'
  | 'engagement'
  | 'portrait'
  | 'landscape'
  | 'equipment'
  | 'avatar'
  | 'blog';

// Wedding stock images metadata
let weddingStockImages: { 
  images: Array<{ 
    id: string; 
    path: string; 
    alt: string; 
    width: number; 
    height: number; 
    category: string; 
    tags: string[] 
  }> 
} | null = null;

// Load wedding stock images metadata
try {
  weddingStockImages = {
    images: Array.from({ length: 40 }, (_, i) => ({
      id: `wedding-${i + 1}`,
      path: `/images/stock/wedding/wedding-${i + 1}.jpg`,
      alt: `Wedding photo ${i + 1}`,
      width: 800,
      height: Math.floor(600 + Math.random() * 400),
      category: 'wedding',
      tags: ['wedding', 'stock', 'photography'],
    }))
  };
} catch (error) {
  console.error('Failed to load wedding stock images metadata:', error);
}

/**
 * Get a random stock image from our local collection for a specific category
 */
export const getLocalStockImage = (category: StockImageCategory): string => {
  if (category === 'wedding' && weddingStockImages?.images?.length) {
    // Get a random wedding image from our local collection
    const randomIndex = Math.floor(Math.random() * weddingStockImages.images.length);
    return weddingStockImages.images[randomIndex].path;
  }
  
  // Fallback to Unsplash for other categories
  return getUnsplashStockImage(category);
};

/**
 * Get a stock image from Unsplash (used as fallback)
 */
export const getUnsplashStockImage = (category: StockImageCategory, width = 800, height = 600): string => {
  const categories = {
    wedding: 'bride-groom',
    engagement: 'couple-ring',
    portrait: 'professional-portrait',
    landscape: 'nature-scenery',
    equipment: 'camera-gear',
    avatar: 'person-silhouette',
    blog: 'photography-blog'
  };

  return `https://source.unsplash.com/random/${width}x${height}/?${categories[category]}&utm_source=hariel-xavier&utm_medium=referral`;
};

/**
 * Get a stock image - prioritizes local images when available
 */
export const getStockImage = (category: StockImageCategory, width = 800, height = 600): string => {
  // For wedding category, use our local stock images
  if (category === 'wedding') {
    return getLocalStockImage(category);
  }
  
  // For other categories, use Unsplash
  return getUnsplashStockImage(category, width, height);
};

// Static fallback images - using direct strings to avoid circular dependencies
export const FALLBACK_IMAGES = {
  AVATAR: 'https://source.unsplash.com/random/150x150/?person-silhouette&utm_source=hariel-xavier&utm_medium=referral',
  BLOG_POST: 'https://source.unsplash.com/random/1200x800/?photography-blog&utm_source=hariel-xavier&utm_medium=referral',
  GALLERY: '/images/stock/wedding/wedding-1.jpg'
};
