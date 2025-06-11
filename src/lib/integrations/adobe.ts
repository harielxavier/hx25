import { createClient } from '@adobe/lightroom-api';

export interface AdobeConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class AdobeIntegration {
  private client: any;

  constructor(config: AdobeConfig) {
    this.client = createClient({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri
    });
  }

  async syncPhotos(albumId: string) {
    // Sync photos with Adobe Lightroom
    return this.client.albums.getPhotos(albumId);
  }

  async createAlbum(name: string, metadata: any) {
    // Create a new album in Lightroom
    return this.client.albums.create({ name, metadata });
  }

  async exportEdits(photoIds: string[]) {
    // Export edited photos
    return this.client.photos.export(photoIds);
  }
}