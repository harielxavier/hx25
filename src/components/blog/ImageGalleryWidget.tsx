import React, { useState } from 'react';
import { Plus, X, Trash2, Edit, Grid, Move, Image as ImageIcon } from 'lucide-react';
import ImageUploadButton from '../ImageUploadButton';

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  alt?: string;
}

interface ImageGalleryWidgetProps {
  onGalleryInsert: (galleryHtml: string) => void;
  onClose: () => void;
}

const ImageGalleryWidget: React.FC<ImageGalleryWidgetProps> = ({ onGalleryInsert, onClose }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [layout, setLayout] = useState<'grid' | 'masonry' | 'carousel'>('grid');
  const [columns, setColumns] = useState(3);
  const [editingImage, setEditingImage] = useState<string | null>(null);

  const addImage = (url: string) => {
    const newImage: GalleryImage = {
      id: Date.now().toString(),
      url,
      caption: '',
      alt: ''
    };
    setImages(prev => [...prev, newImage]);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const updateImage = (id: string, updates: Partial<GalleryImage>) => {
    setImages(prev => prev.map(img =>
      img.id === id ? { ...img, ...updates } : img
    ));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    setImages(newImages);
  };

  const generateGalleryHtml = () => {
    const galleryId = `gallery-${Date.now()}`;

    const imageElements = images.map((img, index) => {
      return `
        <div class="gallery-item" data-index="${index}">
          <img
            src="${img.url}"
            alt="${img.alt || img.caption || 'Gallery image'}"
            class="gallery-image"
            loading="lazy"
            onclick="openLightbox('${galleryId}', ${index})"
          />
          ${img.caption ? `<div class="gallery-caption">${img.caption}</div>` : ''}
        </div>
      `;
    }).join('');

    const lightboxImages = images.map(img => ({
      src: img.url,
      caption: img.caption || '',
      alt: img.alt || img.caption || 'Gallery image'
    }));

    return `
      <div class="image-gallery ${layout}-layout" id="${galleryId}" data-columns="${columns}">
        ${galleryTitle ? `<h3 class="gallery-title">${galleryTitle}</h3>` : ''}
        <div class="gallery-grid">
          ${imageElements}
        </div>
      </div>

      <style>
        .image-gallery {
          margin: 2rem 0;
          max-width: 100%;
        }

        .gallery-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: center;
        }

        .gallery-grid {
          display: grid;
          gap: 1rem;
        }

        .grid-layout .gallery-grid {
          grid-template-columns: repeat(${columns}, 1fr);
        }

        .masonry-layout .gallery-grid {
          columns: ${columns};
          column-gap: 1rem;
        }

        .carousel-layout .gallery-grid {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          gap: 1rem;
        }

        .carousel-layout .gallery-item {
          flex: 0 0 300px;
          scroll-snap-align: start;
        }

        .masonry-layout .gallery-item {
          break-inside: avoid;
          margin-bottom: 1rem;
        }

        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .gallery-item:hover {
          transform: scale(1.02);
        }

        .gallery-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        .grid-layout .gallery-image {
          aspect-ratio: 1;
        }

        .gallery-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          color: white;
          padding: 1rem;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            columns: 2 !important;
          }
        }

        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
            columns: 1 !important;
          }
        }
      </style>

      <script>
        window.galleryData = window.galleryData || {};
        window.galleryData['${galleryId}'] = ${JSON.stringify(lightboxImages)};

        function openLightbox(galleryId, index) {
          const images = window.galleryData[galleryId];
          if (!images) return;

          // Create lightbox overlay
          const overlay = document.createElement('div');
          overlay.className = 'lightbox-overlay';
          overlay.style.cssText = \`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: pointer;
          \`;

          // Create image container
          const container = document.createElement('div');
          container.style.cssText = \`
            position: relative;
            max-width: 90%;
            max-height: 90%;
            text-align: center;
          \`;

          // Create image
          const img = document.createElement('img');
          img.src = images[index].src;
          img.alt = images[index].alt;
          img.style.cssText = \`
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          \`;

          // Create caption
          const caption = document.createElement('div');
          caption.textContent = images[index].caption;
          caption.style.cssText = \`
            color: white;
            margin-top: 1rem;
            font-size: 1rem;
          \`;

          // Create close button
          const closeBtn = document.createElement('button');
          closeBtn.innerHTML = '×';
          closeBtn.style.cssText = \`
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            width: 40px;
            height: 40px;
          \`;

          container.appendChild(img);
          if (images[index].caption) container.appendChild(caption);
          container.appendChild(closeBtn);
          overlay.appendChild(container);
          document.body.appendChild(overlay);

          // Close on overlay click or close button
          overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target === closeBtn) {
              document.body.removeChild(overlay);
            }
          });

          // Close on escape key
          document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
              document.body.removeChild(overlay);
              document.removeEventListener('keydown', escapeHandler);
            }
          });
        }
      </script>
    `;
  };

  const handleInsertGallery = () => {
    if (images.length === 0) {
      alert('Please add at least one image to the gallery');
      return;
    }

    const galleryHtml = generateGalleryHtml();
    onGalleryInsert(galleryHtml);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Create Image Gallery</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Gallery Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Title (Optional)
              </label>
              <input
                type="text"
                value={galleryTitle}
                onChange={(e) => setGalleryTitle(e.target.value)}
                placeholder="Enter gallery title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Layout Style
              </label>
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="grid">Grid Layout</option>
                <option value="masonry">Masonry Layout</option>
                <option value="carousel">Carousel</option>
              </select>
            </div>

            {layout !== 'carousel' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Columns
                </label>
                <select
                  value={columns}
                  onChange={(e) => setColumns(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={2}>2 Columns</option>
                  <option value={3}>3 Columns</option>
                  <option value={4}>4 Columns</option>
                </select>
              </div>
            )}
          </div>

          {/* Add Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Gallery Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <ImageUploadButton
                onImageUploaded={addImage}
                label="Add Image to Gallery"
                className="mx-auto"
              />
              <p className="mt-2 text-sm text-gray-500">
                Upload multiple images to create your gallery
              </p>
            </div>
          </div>

          {/* Image Grid */}
          {images.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Gallery Images ({images.length})</h4>
                <span className="text-sm text-gray-500">
                  Click on an image to edit its caption
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.alt || `Gallery image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer"
                      onClick={() => setEditingImage(image.id)}
                    />

                    {/* Overlay controls */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                        <button
                          onClick={() => setEditingImage(image.id)}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeImage(image.id)}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Caption preview */}
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-lg">
                        {image.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Edit Modal */}
          {editingImage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h4 className="text-lg font-semibold mb-4">Edit Image</h4>
                {(() => {
                  const image = images.find(img => img.id === editingImage);
                  if (!image) return null;

                  return (
                    <div className="space-y-4">
                      <img
                        src={image.url}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Caption
                        </label>
                        <textarea
                          value={image.caption || ''}
                          onChange={(e) => updateImage(image.id, { caption: e.target.value })}
                          placeholder="Enter image caption..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alt Text (for accessibility)
                        </label>
                        <input
                          type="text"
                          value={image.alt || ''}
                          onChange={(e) => updateImage(image.id, { alt: e.target.value })}
                          placeholder="Describe the image..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingImage(null)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <div className="text-sm text-gray-500">
              {images.length === 0
                ? 'Add images to create a gallery'
                : `Ready to insert gallery with ${images.length} image${images.length > 1 ? 's' : ''}`
              }
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertGallery}
                disabled={images.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Insert Gallery
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryWidget;