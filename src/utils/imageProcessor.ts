/**
 * Image processing utilities for the photography website
 * Handles resizing, compression, and consistent naming
 */

/**
 * Options for image processing
 */
export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  namePrefix?: string;
  nameSuffix?: string;
  namingConvention?: 'date-title' | 'title-date' | 'custom';
}

/**
 * Default options for image processing
 */
const defaultOptions: ImageProcessingOptions = {
  maxWidth: 2000,
  maxHeight: 2000,
  quality: 0.8,
  format: 'jpeg',
  namePrefix: '',
  nameSuffix: '',
  namingConvention: 'date-title'
};

/**
 * Result of image processing
 */
export interface ProcessedImage {
  file: File;
  originalFile: File;
  width: number;
  height: number;
  size: number;
  name: string;
}

/**
 * Process an image file - resize, compress, and rename
 * @param file Original image file
 * @param options Processing options
 * @returns Processed image data
 */
export const processImage = async (
  file: File,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> => {
  // Merge defaults with provided options
  const settings = { ...defaultOptions, ...options };
  
  // Create a new name based on the naming convention
  const newName = generateConsistentName(file.name, settings);
  
  // Process the image (resize and compress)
  const { blob, width, height } = await resizeAndCompressImage(file, settings);
  
  // Create a new File object with the processed image
  const processedFile = new File(
    [blob], 
    newName, 
    { type: `image/${settings.format}` }
  );
  
  return {
    file: processedFile,
    originalFile: file,
    width,
    height,
    size: processedFile.size,
    name: newName
  };
};

/**
 * Process multiple images in batch
 * @param files Array of image files
 * @param options Processing options
 * @returns Array of processed images
 */
export const processImages = async (
  files: File[],
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage[]> => {
  const processedImages: ProcessedImage[] = [];
  
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      try {
        const processed = await processImage(file, options);
        processedImages.push(processed);
      } catch (error) {
        console.error(`Failed to process image ${file.name}:`, error);
      }
    } else {
      console.warn(`Skipping non-image file: ${file.name}`);
    }
  }
  
  return processedImages;
};

/**
 * Generate a consistent filename based on the specified naming convention
 * @param originalName Original filename
 * @param options Naming options
 * @returns New consistent filename
 */
const generateConsistentName = (
  originalName: string,
  options: ImageProcessingOptions
): string => {
  // Extract the base name without extension
  const baseName = originalName.split('.')[0].trim();
  
  // Clean the name - replace spaces with hyphens, remove special characters
  const cleanName = baseName
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  
  // Get the current date formatted as YYYY-MM-DD
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  
  // Generate name based on convention
  let newName = '';
  
  switch (options.namingConvention) {
    case 'date-title':
      newName = `${dateStr}-${cleanName}`;
      break;
    case 'title-date':
      newName = `${cleanName}-${dateStr}`;
      break;
    case 'custom':
      newName = cleanName;
      break;
    default:
      newName = `${dateStr}-${cleanName}`;
  }
  
  // Add prefix and suffix if provided
  if (options.namePrefix) {
    newName = `${options.namePrefix}-${newName}`;
  }
  
  if (options.nameSuffix) {
    newName = `${newName}-${options.nameSuffix}`;
  }
  
  // Add extension based on format
  return `${newName}.${options.format}`;
};

/**
 * Resize and compress an image
 * @param file Original image file
 * @param options Processing options
 * @returns Processed image as Blob with dimensions
 */
const resizeAndCompressImage = async (
  file: File,
  options: ImageProcessingOptions
): Promise<{ blob: Blob; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    // Create a FileReader to read the image
    const reader = new FileReader();
    
    reader.onload = (event) => {
      // Create an image element to get dimensions
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        // Resize if needed - use default values if options are undefined
        const maxWidth = options.maxWidth || 2000;
        const maxHeight = options.maxHeight || 2000;
        
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const ratio = Math.min(widthRatio, heightRatio);
          
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress the image
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with quality adjustment
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, width, height });
            } else {
              reject(new Error('Failed to create image blob'));
            }
          },
          `image/${options.format}`,
          options.quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Create a thumbnail version of an image
 * @param file Original image file
 * @param maxWidth Maximum width for the thumbnail
 * @param quality Compression quality (0-1)
 * @returns Thumbnail as Blob
 */
export const createThumbnail = async (
  file: File,
  maxWidth: number = 400,
  quality: number = 0.7
): Promise<Blob> => {
  const { blob } = await resizeAndCompressImage(
    file,
    {
      maxWidth,
      maxHeight: 1000,
      quality,
      format: 'jpeg'
    }
  );
  
  return blob;
};
