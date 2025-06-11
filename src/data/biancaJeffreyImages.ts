// Bianca & Jeffrey Wedding Gallery Images
const prepPath = '/MoStuff/Featured Wedding/Bianca & Jeffrey\'s Wedding/Bride & Groom Prep/';
const firstLookPath = '/MoStuff/Featured Wedding/Bianca & Jeffrey\'s Wedding/THE FIRST LOOK/';
const ceremonyPath = '/MoStuff/Featured Wedding/Bianca & Jeffrey\'s Wedding/The Ceremony/';
const receptionPath = '/MoStuff/Featured Wedding/Bianca & Jeffrey\'s Wedding/The Reception/';

// Helper function to determine if an image is likely landscape or portrait based on filename
const isLandscapeImage = (filename: string): boolean => {
  // Add specific filenames that you know are landscape
  const knownLandscapeImages = [
    'Bianca & Jeff_s Wedding-457.jpg',
    'Bianca & Jeff_s Wedding-459.jpg',
    'Bianca & Jeff_s Wedding-466.jpg',
    'Bianca & Jeff_s Wedding-475.jpg',
    'Bianca & Jeff_s Wedding-479.jpg',
    'Bianca & Jeff_s Wedding-485.jpg',
    'Bianca & Jeff_s Wedding-494.jpg',
    'Bianca & Jeff_s Wedding-502.jpg',
    'Bianca & Jeff_s Wedding-655.jpg',
    'Bianca & Jeff_s Wedding-661.jpg',
    'Bianca & Jeff_s Wedding-677.jpg',
    'Bianca & Jeff_s Wedding-710.jpg',
    'Bianca & Jeff_s Wedding-749.jpg',
    'Bianca & Jeff_s Wedding-784.jpg',
    'Bianca & Jeff_s Wedding-813.jpg',
    'Bianca & Jeff_s Wedding-823.jpg',
    'Bianca & Jeff_s Wedding-1337.jpg'
  ];
  
  return knownLandscapeImages.includes(filename);
};

// All images from all subdirectories
export const biancaJeffreyImages = [
  // Featured thumbnail - using one of the best images as the thumbnail
  { id: 'bianca-jeffrey-featured', url: `${firstLookPath}Bianca & Jeff_s Wedding-475.jpg`, tags: ['featured'], featured: true },
  
  // TOP FEATURED IMAGE
  { id: 'bianca-jeffrey-top-feature', url: `${firstLookPath}Bianca & Jeff_s Wedding-475.jpg`, tags: ['special', 'wedding'], featured: true },
  
  // Bride & Groom Prep
  { id: 'bianca-jeffrey-prep-1', url: `${prepPath}Bianca & Jeff_s Wedding-7.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-2', url: `${prepPath}Bianca & Jeff_s Wedding-9.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-3', url: `${prepPath}Bianca & Jeff_s Wedding-10.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-4', url: `${prepPath}Bianca & Jeff_s Wedding-17.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-5', url: `${prepPath}Bianca & Jeff_s Wedding-21.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-6', url: `${prepPath}Bianca & Jeff_s Wedding-24.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-7', url: `${prepPath}Bianca & Jeff_s Wedding-35.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-8', url: `${prepPath}Bianca & Jeff_s Wedding-43.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-9', url: `${prepPath}Bianca & Jeff_s Wedding-58.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-10', url: `${prepPath}Bianca & Jeff_s Wedding-74.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-11', url: `${prepPath}Bianca & Jeff_s Wedding-85.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-12', url: `${prepPath}Bianca & Jeff_s Wedding-89.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-13', url: `${prepPath}Bianca & Jeff_s Wedding-97.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-14', url: `${prepPath}Bianca & Jeff_s Wedding-103.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-15', url: `${prepPath}Bianca & Jeff_s Wedding-109.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-16', url: `${prepPath}Bianca & Jeff_s Wedding-112.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-17', url: `${prepPath}Bianca & Jeff_s Wedding-115.jpg`, tags: ['prep'], featured: true },
  { id: 'bianca-jeffrey-prep-18', url: `${prepPath}Bianca & Jeff_s Wedding-127.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-19', url: `${prepPath}Bianca & Jeff_s Wedding-129.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-20', url: `${prepPath}Bianca & Jeff_s Wedding-137.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-21', url: `${prepPath}Bianca & Jeff_s Wedding-141.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-22', url: `${prepPath}Bianca & Jeff_s Wedding-142.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-23', url: `${prepPath}Bianca & Jeff_s Wedding-145.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-24', url: `${prepPath}Bianca & Jeff_s Wedding-150.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-25', url: `${prepPath}Bianca & Jeff_s Wedding-154.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-26', url: `${prepPath}Bianca & Jeff_s Wedding-160.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-27', url: `${prepPath}Bianca & Jeff_s Wedding-166.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-28', url: `${prepPath}Bianca & Jeff_s Wedding-168.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-29', url: `${prepPath}Bianca & Jeff_s Wedding-181.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-30', url: `${prepPath}Bianca & Jeff_s Wedding-193.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-31', url: `${prepPath}Bianca & Jeff_s Wedding-203.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-32', url: `${prepPath}Bianca & Jeff_s Wedding-211.jpg`, tags: ['prep'], featured: true },
  { id: 'bianca-jeffrey-prep-33', url: `${prepPath}Bianca & Jeff_s Wedding-224.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-34', url: `${prepPath}Bianca & Jeff_s Wedding-225.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-35', url: `${prepPath}Bianca & Jeff_s Wedding-241.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-36', url: `${prepPath}Bianca & Jeff_s Wedding-279.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-37', url: `${prepPath}Bianca & Jeff_s Wedding-286.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-38', url: `${prepPath}Bianca & Jeff_s Wedding-289.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-39', url: `${prepPath}Bianca & Jeff_s Wedding-294.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-40', url: `${prepPath}Bianca & Jeff_s Wedding-300.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-41', url: `${prepPath}Bianca & Jeff_s Wedding-302.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-42', url: `${prepPath}Bianca & Jeff_s Wedding-315.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-43', url: `${prepPath}Bianca & Jeff_s Wedding-327.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-44', url: `${prepPath}Bianca & Jeff_s Wedding-328.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-45', url: `${prepPath}Bianca & Jeff_s Wedding-329.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-46', url: `${prepPath}Bianca & Jeff_s Wedding-350.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-47', url: `${prepPath}Bianca & Jeff_s Wedding-356.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-48', url: `${prepPath}Bianca & Jeff_s Wedding-362.jpg`, tags: ['prep'] },
  { id: 'bianca-jeffrey-prep-49', url: `${prepPath}Bianca & Jeff_s Wedding-373.jpg`, tags: ['prep'] },
  
  // First Look
  { id: 'bianca-jeffrey-firstlook-1', url: `${firstLookPath}Bianca & Jeff_s Wedding-457.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-2', url: `${firstLookPath}Bianca & Jeff_s Wedding-459.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-3', url: `${firstLookPath}Bianca & Jeff_s Wedding-460.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-4', url: `${firstLookPath}Bianca & Jeff_s Wedding-466.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-5', url: `${firstLookPath}Bianca & Jeff_s Wedding-468.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-6', url: `${firstLookPath}Bianca & Jeff_s Wedding-475.jpg`, tags: ['first-look'], featured: true },
  { id: 'bianca-jeffrey-firstlook-7', url: `${firstLookPath}Bianca & Jeff_s Wedding-476.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-8', url: `${firstLookPath}Bianca & Jeff_s Wedding-479.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-9', url: `${firstLookPath}Bianca & Jeff_s Wedding-480.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-10', url: `${firstLookPath}Bianca & Jeff_s Wedding-485.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-11', url: `${firstLookPath}Bianca & Jeff_s Wedding-494.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-12', url: `${firstLookPath}Bianca & Jeff_s Wedding-495.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-13', url: `${firstLookPath}Bianca & Jeff_s Wedding-502.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-14', url: `${firstLookPath}Bianca & Jeff_s Wedding-513.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-15', url: `${firstLookPath}Bianca & Jeff_s Wedding-535.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-16', url: `${firstLookPath}Bianca & Jeff_s Wedding-542.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-17', url: `${firstLookPath}Bianca & Jeff_s Wedding-546.jpg`, tags: ['first-look'], featured: true },
  { id: 'bianca-jeffrey-firstlook-18', url: `${firstLookPath}Bianca & Jeff_s Wedding-548.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-19', url: `${firstLookPath}Bianca & Jeff_s Wedding-549.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-20', url: `${firstLookPath}Bianca & Jeff_s Wedding-552.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-21', url: `${firstLookPath}Bianca & Jeff_s Wedding-560.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-22', url: `${firstLookPath}Bianca & Jeff_s Wedding-570.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-23', url: `${firstLookPath}Bianca & Jeff_s Wedding-574.jpg`, tags: ['first-look'] },
  { id: 'bianca-jeffrey-firstlook-24', url: `${firstLookPath}Bianca & Jeff_s Wedding-577.jpg`, tags: ['first-look'] },
  
  // Ceremony
  { id: 'bianca-jeffrey-ceremony-1', url: `${ceremonyPath}Bianca & Jeff_s Wedding-594.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-2', url: `${ceremonyPath}Bianca & Jeff_s Wedding-598.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-3', url: `${ceremonyPath}Bianca & Jeff_s Wedding-655.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-4', url: `${ceremonyPath}Bianca & Jeff_s Wedding-658.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-5', url: `${ceremonyPath}Bianca & Jeff_s Wedding-661.jpg`, tags: ['ceremony'], featured: true },
  { id: 'bianca-jeffrey-ceremony-6', url: `${ceremonyPath}Bianca & Jeff_s Wedding-662.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-7', url: `${ceremonyPath}Bianca & Jeff_s Wedding-677.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-8', url: `${ceremonyPath}Bianca & Jeff_s Wedding-684.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-9', url: `${ceremonyPath}Bianca & Jeff_s Wedding-695.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-10', url: `${ceremonyPath}Bianca & Jeff_s Wedding-710.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-11', url: `${ceremonyPath}Bianca & Jeff_s Wedding-731.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-12', url: `${ceremonyPath}Bianca & Jeff_s Wedding-744.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-13', url: `${ceremonyPath}Bianca & Jeff_s Wedding-749.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-14', url: `${ceremonyPath}Bianca & Jeff_s Wedding-784.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-15', url: `${ceremonyPath}Bianca & Jeff_s Wedding-800.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-16', url: `${ceremonyPath}Bianca & Jeff_s Wedding-806.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-17', url: `${ceremonyPath}Bianca & Jeff_s Wedding-813.jpg`, tags: ['ceremony'], featured: true },
  { id: 'bianca-jeffrey-ceremony-18', url: `${ceremonyPath}Bianca & Jeff_s Wedding-817.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-19', url: `${ceremonyPath}Bianca & Jeff_s Wedding-823.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-20', url: `${ceremonyPath}Bianca & Jeff_s Wedding-825.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-21', url: `${ceremonyPath}Bianca & Jeff_s Wedding-826.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-22', url: `${ceremonyPath}Bianca & Jeff_s Wedding-829.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-23', url: `${ceremonyPath}Bianca & Jeff_s Wedding-832.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-24', url: `${ceremonyPath}Bianca & Jeff_s Wedding-848.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-25', url: `${ceremonyPath}Bianca & Jeff_s Wedding-878.jpg`, tags: ['ceremony'] },
  { id: 'bianca-jeffrey-ceremony-26', url: `${ceremonyPath}Bianca & Jeff_s Wedding-880.jpg`, tags: ['ceremony'] },
  
  // Reception
  { id: 'bianca-jeffrey-reception-1', url: `${receptionPath}Bianca & Jeff_s Wedding-1337.jpg`, tags: ['reception'], featured: true },
  { id: 'bianca-jeffrey-reception-2', url: `${receptionPath}Bianca & Jeff_s Wedding-1338.jpg`, tags: ['reception'] },
  { id: 'bianca-jeffrey-reception-3', url: `${receptionPath}Bianca & Jeff_s Wedding-1339.jpg`, tags: ['reception'] }
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
