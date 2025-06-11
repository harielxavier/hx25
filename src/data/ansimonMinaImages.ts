// Ansimon & Mina Wedding Gallery Images
const basePath = '/MoStuff/Featured Wedding/Ansimon & Mina\'s Wedding/';

// Helper function to extract the number from the filename
const getImageNumber = (filename: string): number => {
  const match = filename.match(/additional-(\d+)_websize/);
  return match ? parseInt(match[1], 10) : 0;
};

// Function to determine if an image is likely portrait or landscape based on its tags or filename
const isLikelyPortrait = (img: any): boolean => {
  // If it's a portrait shot, it's likely portrait orientation
  if (img.tags && img.tags.includes('portrait')) {
    return true;
  }
  
  // Check filename for clues - this is a heuristic and might need adjustment
  const number = getImageNumber(img.url);
  // Based on known portrait images in the collection
  const knownPortraitNumbers = [
    1, 23, 40, 47, 57, 59, 62, 91, 97, 121, 135, 138, 168, 188, 
    1156, 1175, 1214, 1232, 1243, 1264, 1292, 1299, 1304, 1328
  ];
  
  return knownPortraitNumbers.includes(number);
};

// Create the image array
const unsortedImages = [
  { id: 'ansimon-mina-1', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-2', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-23_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-3', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-40_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-4', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-47_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-5', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-57_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-6', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-59_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-7', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-62_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-8', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-91_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-9', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-97_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-10', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-121_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-11', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-135_websize.jpg`, tags: ['portrait'], featured: true },
  { id: 'ansimon-mina-12', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-138_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-13', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-168_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-14', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-188_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-15', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-210_websize.jpg`, tags: ['details'] },
  { id: 'ansimon-mina-16', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-239_websize.jpg`, tags: ['ceremony'] },
  { id: 'ansimon-mina-17', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-309_websize.jpg`, tags: ['ceremony'] },
  { id: 'ansimon-mina-18', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-372_websize.jpg`, tags: ['ceremony'], featured: true },
  { id: 'ansimon-mina-19', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-373_websize.jpg`, tags: ['ceremony'] },
  { id: 'ansimon-mina-20', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-437_websize.jpg`, tags: ['ceremony'] },
  { id: 'ansimon-mina-21', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-444_websize.jpg`, tags: ['ceremony'] },
  { id: 'ansimon-mina-22', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1028_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-23', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1029_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-24', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1038_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-25', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1045_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-26', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1051_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-27', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1054_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-28', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1058_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-29', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1060_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-30', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1064_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-31', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1069_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-32', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1072_websize.jpg`, tags: ['dance'], featured: true },
  { id: 'ansimon-mina-33', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1140_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-34', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1142_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-35', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1156_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-36', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1175_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-37', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1214_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-38', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1232_websize.jpg`, tags: ['portrait'], featured: true },
  { id: 'ansimon-mina-39', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1243_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-40', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1264_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-41', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1284_websize.jpg`, tags: ['dance'] },
  { id: 'ansimon-mina-42', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1292_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-43', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1299_websize.jpg`, tags: ['portrait'], featured: true },
  { id: 'ansimon-mina-44', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1304_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-45', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1328_websize.jpg`, tags: ['portrait'] },
  { id: 'ansimon-mina-46', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1598_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-47', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1628_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-48', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1642_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-49', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1664_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-50', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1680_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-51', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1690_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-52', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1692_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-53', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1782_websize.jpg`, tags: ['reception'] },
  { id: 'ansimon-mina-54', url: `${basePath}Annie & Steve Ansimon & Mina Wedding additional-1795_websize.jpg`, tags: ['reception'] }
];

// Sort the images by the number in the filename
export const ansimonMinaImages = unsortedImages
  .sort((a, b) => {
    const numA = getImageNumber(a.url);
    const numB = getImageNumber(b.url);
    return numA - numB;
  })
  .map((img, index) => {
    const isPortrait = isLikelyPortrait(img);
    
    // Set dimensions based on orientation
    let width, height;
    if (isPortrait) {
      width = 800;
      height = 1200;
    } else {
      width = 1200;
      height = 800;
    }
    
    return {
      ...img,
      id: `ansimon-mina-${index + 1}`,
      thumbnailUrl: img.url,
      width,
      height,
      featured: img.featured || false,
      // Add PhotoSwipe required properties
      cropped: false,
      original: {
        src: img.url,
        width,
        height
      },
      thumbnail: {
        src: img.url,
        width: Math.floor(width / 4),
        height: Math.floor(height / 4)
      },
      caption: `Ansimon & Mina Wedding - ${img.tags.join(', ')}`
    };
  });
