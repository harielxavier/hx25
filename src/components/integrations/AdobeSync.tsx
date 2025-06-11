import React, { useState } from 'react';
import { AdobeIntegration } from '../../lib/integrations/adobe';
import { Camera, Upload, Check } from 'lucide-react';

export default function AdobeSync() {
  const [syncing, setSyncing] = useState(false);
  const [albums, setAlbums] = useState<any[]>([]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const adobe = new AdobeIntegration({
        clientId: process.env.ADOBE_CLIENT_ID!,
        clientSecret: process.env.ADOBE_CLIENT_SECRET!,
        redirectUri: process.env.ADOBE_REDIRECT_URI!
      });

      // Sync with Adobe Lightroom
      const syncedAlbums = await adobe.syncPhotos('recent');
      setAlbums(syncedAlbums);
    } catch (error) {
      console.error('Adobe sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Camera className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Adobe Lightroom Sync</h2>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {syncing ? (
            <>
              <Upload className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Sync Now
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {albums.map((album) => (
          <div
            key={album.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h3 className="font-medium text-gray-900">{album.name}</h3>
              <p className="text-sm text-gray-500">{album.photoCount} photos</p>
            </div>
            <Check className="w-5 h-5 text-green-500" />
          </div>
        ))}
      </div>
    </div>
  );
}