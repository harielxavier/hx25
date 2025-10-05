import { supabase } from '../../lib/supabase';

/**
 * Supabase Storage Service
 * Handles image and file uploads to Supabase Storage buckets
 */

const BUCKETS = {
  GALLERIES: 'galleries',
  BLOG_IMAGES: 'blog-images',
  PROFILE_IMAGES: 'profile-images',
  DOCUMENTS: 'documents',
};

export const storageService = {
  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: File | Blob,
    options?: { upsert?: boolean; contentType?: string }
  ): Promise<{ url: string; path: string }> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: options?.upsert ?? false,
        contentType: options?.contentType || file.type,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  },

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    bucket: string,
    files: Array<{ path: string; file: File | Blob }>
  ): Promise<Array<{ url: string; path: string }>> {
    const uploads = files.map(({ path, file }) =>
      this.uploadFile(bucket, path, file)
    );

    return Promise.all(uploads);
  },

  /**
   * Delete a file from storage
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  },

  /**
   * Delete multiple files
   */
  async deleteMultipleFiles(bucket: string, paths: string[]): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) throw error;
  },

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  /**
   * List files in a bucket
   */
  async listFiles(bucket: string, folder?: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) throw error;
    return data;
  },

  /**
   * Create a signed URL for private files
   */
  async createSignedUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  },

  /**
   * Upload gallery image
   */
  async uploadGalleryImage(
    galleryId: string,
    file: File
  ): Promise<{ url: string; path: string }> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${galleryId}/${fileName}`;

    return this.uploadFile(BUCKETS.GALLERIES, filePath, file);
  },

  /**
   * Upload blog image
   */
  async uploadBlogImage(file: File): Promise<{ url: string; path: string }> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    return this.uploadFile(BUCKETS.BLOG_IMAGES, filePath, file);
  },

  /**
   * Upload profile image
   */
  async uploadProfileImage(
    userId: string,
    file: File
  ): Promise<{ url: string; path: string }> {
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    return this.uploadFile(BUCKETS.PROFILE_IMAGES, filePath, file, {
      upsert: true,
    });
  },

  /**
   * Create bucket if it doesn't exist
   */
  async ensureBucketExists(bucketName: string, isPublic: boolean = true): Promise<void> {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const bucketExists = buckets?.some(b => b.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 52428800, // 50MB
      });
      
      if (error) throw error;
      console.log(`✅ Created bucket: ${bucketName}`);
    }
  },

  /**
   * Initialize all required buckets
   */
  async initializeBuckets(): Promise<void> {
    await Promise.all([
      this.ensureBucketExists(BUCKETS.GALLERIES, true),
      this.ensureBucketExists(BUCKETS.BLOG_IMAGES, true),
      this.ensureBucketExists(BUCKETS.PROFILE_IMAGES, true),
      this.ensureBucketExists(BUCKETS.DOCUMENTS, false),
    ]);
  },
};

export default storageService;
export { BUCKETS };
