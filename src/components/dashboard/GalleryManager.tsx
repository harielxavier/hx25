import React from 'react';
import { Image, Upload, Share2, Download } from 'lucide-react';

interface Gallery {
  title: string;
  date: string;
  photos: number;
  thumbnail: string;
}

export default function GalleryManager() {
  const [galleries] = React.useState<Gallery[]>([
    {
      title: 'Sarah & John Wedding',
      date: '2024-03-15',
      photos: 850,
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552'
    },
    {
      title: 'Emma Engagement',
      date: '2024-03-10',
      photos: 120,
      thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a'
    }
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Recent Galleries</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {galleries.map((gallery, index) => (
          <div key={index} className="group relative overflow-hidden rounded-lg">
            <img 
              src={gallery.thumbnail}
              alt={gallery.title}
              className="w-full aspect-[3/2] object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <h4 className="text-white font-medium">{gallery.title}</h4>
              <p className="text-white/80 text-sm">{gallery.photos} photos</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}