import React, { useState } from 'react';
import { Link as LinkIcon, Youtube, Twitter, Instagram, Music, Video, X } from 'lucide-react';
import { generateSocialEmbed, isSocialMediaUrl, EmbedData } from '../../utils/socialEmbeds';

interface SocialEmbedWidgetProps {
  onEmbedInsert: (embedCode: string) => void;
  onClose: () => void;
}

const SocialEmbedWidget: React.FC<SocialEmbedWidgetProps> = ({ onEmbedInsert, onClose }) => {
  const [url, setUrl] = useState('');
  const [embedData, setEmbedData] = useState<EmbedData | null>(null);
  const [error, setError] = useState('');

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setError('');
    setEmbedData(null);

    if (value.trim()) {
      if (isSocialMediaUrl(value)) {
        const data = generateSocialEmbed(value);
        if (data) {
          setEmbedData(data);
        } else {
          setError('Unable to generate embed for this URL');
        }
      } else if (value.startsWith('http')) {
        setError('This URL is not supported. Try YouTube, Twitter, Instagram, TikTok, Vimeo, or Spotify links.');
      }
    }
  };

  const handleInsert = () => {
    if (embedData) {
      onEmbedInsert(embedData.embedCode);
      setUrl('');
      setEmbedData(null);
      onClose();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'youtube':
      case 'vimeo':
        return <Youtube className="w-5 h-5 text-red-500" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-blue-500" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'tiktok':
        return <Video className="w-5 h-5 text-black" />;
      case 'spotify':
        return <Music className="w-5 h-5 text-green-500" />;
      default:
        return <LinkIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const exampleUrls = [
    { type: 'YouTube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', icon: <Youtube className="w-4 h-4 text-red-500" /> },
    { type: 'Twitter', url: 'https://twitter.com/user/status/123456789', icon: <Twitter className="w-4 h-4 text-blue-500" /> },
    { type: 'Instagram', url: 'https://www.instagram.com/p/ABC123/', icon: <Instagram className="w-4 h-4 text-pink-500" /> },
    { type: 'TikTok', url: 'https://www.tiktok.com/@user/video/123456789', icon: <Video className="w-4 h-4 text-black" /> },
    { type: 'Vimeo', url: 'https://vimeo.com/123456789', icon: <Video className="w-4 h-4 text-blue-600" /> },
    { type: 'Spotify', url: 'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh', icon: <Music className="w-4 h-4 text-green-500" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Insert Social Media Embed</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Media URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Paste any social media URL here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Preview */}
          {embedData && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                {getIcon(embedData.type)}
                <span className="font-medium capitalize">{embedData.type} Embed</span>
              </div>

              <div className="mb-4">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: embedData.embedCode }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Ready to insert
                </span>
                <button
                  onClick={handleInsert}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Insert Embed
                </button>
              </div>
            </div>
          )}

          {/* Examples */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Supported Platforms:</h4>
            <div className="grid grid-cols-2 gap-2">
              {exampleUrls.map((example, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleUrlChange(example.url)}
                >
                  {example.icon}
                  <span className="text-sm font-medium">{example.type}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Click on any platform above to see example format
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">How to use:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Copy a URL from YouTube, Twitter, Instagram, TikTok, Vimeo, or Spotify</li>
              <li>2. Paste it in the field above</li>
              <li>3. Preview the embed and click "Insert Embed"</li>
              <li>4. The embed will be added to your blog post content</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialEmbedWidget;