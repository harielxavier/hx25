// Image data for Crysta & David's wedding gallery
// Using local paths instead of Firebase Storage URLs
const localBaseUrl = '/MoStuff/Featured Wedding/Crysta & David\'s Wedding/';

// Helper function to determine if an image is likely landscape or portrait based on filename
const isLandscapeImage = (filename: string): boolean => {
  // Add specific filenames that you know are landscape
  const knownLandscapeImages = [
    'cd14.jpg',
    'cd16.jpg',
    'cd49.jpg',
    'cd50.jpg',
    'cd51.jpg',
    'cd52.jpg',
    'cd53.jpg'
  ];
  
  return knownLandscapeImages.includes(filename);
};

const crystaDavidImagesList = [
  // Featured thumbnail - using one of the best images as the thumbnail
  { id: 'crysta-david-featured', url: `${localBaseUrl}cd14.jpg`, tags: ['featured'], featured: true },
  
  // Portraits
  { id: 'crysta-david-1', url: `${localBaseUrl}cd1.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-2', url: `${localBaseUrl}cd2.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-3', url: `${localBaseUrl}cd3.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-4', url: `${localBaseUrl}cd4.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-5', url: `${localBaseUrl}cd5.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-6', url: `${localBaseUrl}cd6.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-7', url: `${localBaseUrl}cd7.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-40', url: `${localBaseUrl}cd40.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-41', url: `${localBaseUrl}cd41.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-42', url: `${localBaseUrl}cd42.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-43', url: `${localBaseUrl}cd43.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-44', url: `${localBaseUrl}cd44.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-55', url: `${localBaseUrl}cd55.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-56', url: `${localBaseUrl}cd56.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-58', url: `${localBaseUrl}cd58.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-59', url: `${localBaseUrl}cd59.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-60', url: `${localBaseUrl}cd60.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-61', url: `${localBaseUrl}cd61.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-62', url: `${localBaseUrl}cd62.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-63', url: `${localBaseUrl}cd63.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-64', url: `${localBaseUrl}cd64.jpg`, tags: ['gallery'] },
  
  // Ceremony
  { id: 'crysta-david-8', url: `${localBaseUrl}cd8.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-9', url: `${localBaseUrl}cd9.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-10', url: `${localBaseUrl}cd10.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-11', url: `${localBaseUrl}cd11.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-12', url: `${localBaseUrl}cd12.jpg`, tags: ['gallery'] },
  
  // Venue
  { id: 'crysta-david-14', url: `${localBaseUrl}cd14.jpg`, tags: ['gallery'], featured: true },
  { id: 'crysta-david-16', url: `${localBaseUrl}cd16.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-49', url: `${localBaseUrl}cd49.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-50', url: `${localBaseUrl}cd50.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-51', url: `${localBaseUrl}cd51.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-52', url: `${localBaseUrl}cd52.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-53', url: `${localBaseUrl}cd53.jpg`, tags: ['gallery'] },
  
  // Details
  { id: 'crysta-david-15', url: `${localBaseUrl}cd15.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-18', url: `${localBaseUrl}cd18.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-46', url: `${localBaseUrl}cd46.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-47', url: `${localBaseUrl}cd47.jpg`, tags: ['gallery'] },
  
  // Reception
  { id: 'crysta-david-20', url: `${localBaseUrl}cd20.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-21', url: `${localBaseUrl}cd21.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-22', url: `${localBaseUrl}cd22.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-24', url: `${localBaseUrl}cd24.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-25', url: `${localBaseUrl}cd25.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-27', url: `${localBaseUrl}cd27.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-28', url: `${localBaseUrl}cd28.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-29', url: `${localBaseUrl}cd29.jpg`, tags: ['gallery'] },
  { id: 'crysta-david-30', url: `${localBaseUrl}cd30.jpg`, tags: ['gallery'] }
].map(img => {
  // Extract filename from URL
  const filename = img.url.split('/').pop() || '';
  const isLandscape = isLandscapeImage(filename);
  
  return {
    ...img,
    thumbnailUrl: img.url,
    width: isLandscape ? 1200 : 800,
    height: isLandscape ? 800 : 1200,
    featured: img.featured || false
  };
});

// Export both as named and default export to ensure compatibility
export const crystaDavidImages = crystaDavidImagesList;
export default crystaDavidImages;
