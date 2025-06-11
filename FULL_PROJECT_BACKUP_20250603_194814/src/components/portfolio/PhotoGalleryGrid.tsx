import React from 'react';
import { motion } from 'framer-motion';

interface GalleryImage {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  coverImage: string;
  fallbackImage: string;
  tags: string[];
  sections: { id: string, title: string }[];
}

interface PhotoGalleryGridProps {
  stories: GalleryImage[];
  onSelectGallery: (id: string) => void;
  title?: string;
}

const PhotoGalleryGrid: React.FC<PhotoGalleryGridProps> = ({ 
  stories, 
  onSelectGallery,
  title = "Wedding Galleries" 
}) => {
  return (
    <div className="my-12">
      <h2 className="font-playfair text-3xl font-light mb-8 border-b border-[#e5c1c1]/30 pb-2">
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((gallery, index) => (
          <motion.div
            key={gallery.id}
            className="group cursor-pointer overflow-hidden rounded-xl shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => onSelectGallery(gallery.id)}
            whileHover={{ y: -10 }}
          >
            {/* Large Prominent Thumbnail */}
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
              <img
                src={gallery.coverImage}
                alt={`${gallery.title} - ${gallery.subtitle}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = gallery.fallbackImage;
                }}
              />
              
              {/* Gallery Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-playfair text-white text-2xl font-medium mb-2">{gallery.title}</h3>
                <p className="font-inter text-white/90 text-lg mb-2">{gallery.subtitle}</p>
                <p className="font-inter text-white/70 text-sm mb-4">{gallery.location}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {gallery.tags.slice(0, 3).map((tag, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs font-inter"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button 
                  className="px-6 py-3 bg-[#e5c1c1] text-[#333333] font-medium rounded-lg shadow-lg hover:bg-[#e5c1c1]/90 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectGallery(gallery.id);
                  }}
                >
                  View Full Gallery
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGalleryGrid;
