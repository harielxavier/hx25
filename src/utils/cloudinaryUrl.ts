import cloudinaryMapping from '../../cloudinary-url-mapping.json';

/**
 * Transform a local image path to its Cloudinary URL using the mapping
 * @param localPath - The local path (e.g., '/MoStuff/black.png')
 * @returns The Cloudinary URL or the original path if no mapping exists
 */
export function getCloudinaryUrl(localPath: string | undefined): string {
  if (!localPath) {
    return '/placeholder-image.jpg';
  }

  // Check if it's already a Cloudinary URL
  if (localPath.includes('res.cloudinary.com')) {
    return localPath;
  }

  // Look up the mapping
  const cloudinaryUrl = (cloudinaryMapping as Record<string, string>)[localPath];

  if (cloudinaryUrl) {
    return cloudinaryUrl;
  }

  // If no mapping found, return the original path
  console.warn(`No Cloudinary mapping found for: ${localPath}`);
  return localPath;
}

/**
 * Transform multiple local paths to Cloudinary URLs
 * @param paths - Array of local paths
 * @returns Array of Cloudinary URLs
 */
export function getCloudinaryUrls(paths: string[]): string[] {
  return paths.map(path => getCloudinaryUrl(path));
}