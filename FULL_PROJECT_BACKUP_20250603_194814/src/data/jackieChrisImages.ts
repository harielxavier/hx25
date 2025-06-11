// Jackie & Chris Wedding Gallery Images
const jmtImagesPath = '/MoStuff/Featured Wedding/Jackie & Chriss Wedding /';
const jmtThumbPath = '/MoStuff/jmt/';

// Helper function to determine if an image is likely landscape or portrait based on filename
const isLandscapeImage = (filename: string): boolean => {
  // Add specific filenames that you know are landscape
  const knownLandscapeImages = [
    'jmt (1 of 61).jpg',
    'jmt (3 of 61).jpg',
    'jmt (5 of 61).jpg',
    'jmt (7 of 61).jpg',
    'jmt (10 of 61).jpg',
    'jmt (12 of 61).jpg',
    'jmt (15 of 61).jpg',
    'jmt (18 of 61).jpg',
    'jmt (20 of 61).jpg',
    'jmt (22 of 61).jpg',
    'jmt (25 of 61).jpg',
    'jmt (30 of 61).jpg',
    'jmt (35 of 61).jpg',
    'jmt (40 of 61).jpg',
    'jmt (45 of 61).jpg',
    'jmt (50 of 61).jpg',
    'jmt (55 of 61).jpg'
  ];
  
  return knownLandscapeImages.includes(filename);
};

export const jackieChrisImages = [
  // Featured thumbnail
  { id: 'jackie-chris-featured', url: `${jmtThumbPath}jackiethumb.jpg`, tags: ['featured'], featured: true },
  
  // TOP FEATURED IMAGE - Blue highlighted image
  { id: 'jackie-chris-top-feature', url: `${jmtImagesPath}jmt (58 of 61).jpg`, tags: ['special', 'wedding'], featured: true },
  
  // Images in exact chronological order from the folder
  { id: 'jackie-chris-01', url: `${jmtImagesPath}jmt (1 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-02', url: `${jmtImagesPath}jmt (2 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-03', url: `${jmtImagesPath}jmt (3 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-04', url: `${jmtImagesPath}jmt (4 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-05', url: `${jmtImagesPath}jmt (5 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-06', url: `${jmtImagesPath}jmt (6 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-07', url: `${jmtImagesPath}jmt (7 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-08', url: `${jmtImagesPath}jmt (8 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-09', url: `${jmtImagesPath}jmt (9 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-10', url: `${jmtImagesPath}jmt (10 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-11', url: `${jmtImagesPath}jmt (11 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-12', url: `${jmtImagesPath}jmt (12 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-13', url: `${jmtImagesPath}jmt (13 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-14', url: `${jmtImagesPath}jmt (14 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-15', url: `${jmtImagesPath}jmt (15 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-16', url: `${jmtImagesPath}jmt (16 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-17', url: `${jmtImagesPath}jmt (17 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-18', url: `${jmtImagesPath}jmt (18 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-19', url: `${jmtImagesPath}jmt (19 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-20', url: `${jmtImagesPath}jmt (20 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-21', url: `${jmtImagesPath}jmt (21 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-22', url: `${jmtImagesPath}jmt (22 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-23', url: `${jmtImagesPath}jmt (23 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-24', url: `${jmtImagesPath}jmt (24 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-25', url: `${jmtImagesPath}jmt (25 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-26', url: `${jmtImagesPath}jmt (26 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-27', url: `${jmtImagesPath}jmt (27 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-28', url: `${jmtImagesPath}jmt (28 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-29', url: `${jmtImagesPath}jmt (29 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-30', url: `${jmtImagesPath}jmt (30 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-31', url: `${jmtImagesPath}jmt (31 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-32', url: `${jmtImagesPath}jmt (32 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-33', url: `${jmtImagesPath}jmt (33 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-34', url: `${jmtImagesPath}jmt (34 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-35', url: `${jmtImagesPath}jmt (35 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-36', url: `${jmtImagesPath}jmt (36 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-37', url: `${jmtImagesPath}jmt (37 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-38', url: `${jmtImagesPath}jmt (38 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-39', url: `${jmtImagesPath}jmt (39 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-40', url: `${jmtImagesPath}jmt (40 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-41', url: `${jmtImagesPath}jmt (41 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-42', url: `${jmtImagesPath}jmt (42 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-43', url: `${jmtImagesPath}jmt (43 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-44', url: `${jmtImagesPath}jmt (44 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-45', url: `${jmtImagesPath}jmt (45 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-46', url: `${jmtImagesPath}jmt (46 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-47', url: `${jmtImagesPath}jmt (47 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-48', url: `${jmtImagesPath}jmt (48 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-49', url: `${jmtImagesPath}jmt (49 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-50', url: `${jmtImagesPath}jmt (50 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-51', url: `${jmtImagesPath}jmt (51 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-52', url: `${jmtImagesPath}jmt (52 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-53', url: `${jmtImagesPath}jmt (53 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-54', url: `${jmtImagesPath}jmt (54 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-55', url: `${jmtImagesPath}jmt (55 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-56', url: `${jmtImagesPath}jmt (56 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-57', url: `${jmtImagesPath}jmt (57 of 61).jpg`, tags: ['wedding'] },
  // Image 58 is moved to the top
  { id: 'jackie-chris-59', url: `${jmtImagesPath}jmt (59 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-60', url: `${jmtImagesPath}jmt (60 of 61).jpg`, tags: ['wedding'] },
  { id: 'jackie-chris-61', url: `${jmtImagesPath}jmt (61 of 61).jpg`, tags: ['wedding'] }
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
