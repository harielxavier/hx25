import React from 'react';
import { transformImageUrl } from '../../utils/imageOptimizationUtils';

interface WeddingStory {
  id: string;
  couple: string;
  venue: string;
  location: string;
  date: string;
  description: string;
  coverImage: string;
  images: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }[];
  testimonial?: {
    quote: string;
    author: string;
  };
}

const weddingStories: WeddingStory[] = [
  {
    id: 'karni-zilvinas',
    couple: 'Karni & Zilvinas',
    venue: 'The Plaza Hotel',
    location: 'New York City',
    date: 'June 2024',
    description: 'An elegant celebration that blended traditional elements with modern sophistication. From the emotional first look to the last dance, every moment was filled with joy and connection.',
    coverImage: 'https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/karni-zilvinas/images/karni-zilvinas-1.jpg',
    images: [
      {
        src: 'https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/karni-zilvinas/images/karni-zilvinas-3.jpg',
        alt: 'Bride preparation',
        width: 1200,
        height: 800
      },
      {
        src: 'https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/karni-zilvinas/images/karni-zilvinas-5.jpg',
        alt: 'Wedding ceremony',
        width: 1200,
        height: 800
      }
    ],
    testimonial: {
      quote: "Hariel captured our wedding day perfectly. The photos are beyond what we could have imagined - they tell the complete story of our day with so much emotion and beauty.",
      author: "Karni & Zilvinas"
    }
  },
  {
    id: 'crysta-david',
    couple: 'Crysta & David',
    venue: 'Castle Hill',
    location: 'Newport',
    date: 'September 2023',
    description: 'A breathtaking seaside celebration with timeless elegance. The historic venue provided a stunning backdrop for a day filled with heartfelt moments and joyful celebrations.',
    coverImage: 'https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/crysta-david/images/cdw-322.jpg',
    images: [
      {
        src: 'https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/crysta-david/images/cdw-170.jpg',
        alt: 'Romantic couple portrait',
        width: 1200,
        height: 800
      },
      {
        src: 'https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/crysta-david/images/cdw-25.jpg',
        alt: 'Bride getting ready',
        width: 1200,
        height: 800
      }
    ],
    testimonial: {
      quote: "Working with Hariel was the best decision we made for our wedding. Not only are the photos stunning, but he made us feel completely comfortable throughout the day.",
      author: "Crysta & David"
    }
  }
];

const WeddingStoriesGallery: React.FC = () => {
  return (
    <div className="wedding-stories space-y-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-light tracking-wide mb-4">Wedding Stories</h2>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed">
          Each wedding is a unique story filled with emotion, connection, and beauty. 
          Browse through these complete wedding journeys to experience how I document these precious moments.
        </p>
      </div>

      {weddingStories.map((story, index) => (
        <div key={story.id} className="wedding-story">
          {/* Story Header with Large Cover Image */}
          <div className="relative mb-16 overflow-hidden rounded-xl shadow-2xl">
            <div className="aspect-w-16 aspect-h-9 overflow-hidden">
              <img 
                src={transformImageUrl(story.coverImage, 1800)} 
                alt={`${story.couple} Wedding`}
                className="w-full h-full object-cover transition-transform duration-2000 hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
              <div className="p-8 md:p-12 w-full">
                <h3 className="text-3xl md:text-4xl font-light text-white mb-2">{story.couple}</h3>
                <p className="text-white/80 text-lg">{story.venue} | {story.location}</p>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Story Details */}
            <div className="md:col-span-4 space-y-6">
              <div>
                <h4 className="text-2xl font-light mb-4">Their Story</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {story.description}
                </p>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-px bg-rose-300 dark:bg-rose-700"></div>
                  <p className="text-rose-500 font-light">{story.date}</p>
                </div>
              </div>

              {/* Testimonial */}
              {story.testimonial && (
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-rose-400 dark:border-rose-600">
                  <p className="italic text-gray-600 dark:text-gray-400 mb-4">
                    "{story.testimonial.quote}"
                  </p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">— {story.testimonial.author}</p>
                </div>
              )}

              <button className="mt-6 border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white px-8 py-3 rounded-full transition duration-300 text-sm tracking-wider">
                VIEW FULL GALLERY
              </button>
            </div>

            {/* Story Gallery */}
            <div className="md:col-span-8">
              <div className="grid grid-cols-2 gap-6">
                {story.images.map((image, imgIndex) => (
                  <div 
                    key={imgIndex} 
                    className={`overflow-hidden rounded-lg shadow-lg ${imgIndex === 0 ? 'col-span-2' : ''}`}
                  >
                    <a 
                      href={transformImageUrl(image.src, 1800)}
                      className="gallery-item block"
                      data-pswp-width={image.width}
                      data-pswp-height={image.height}
                    >
                      <img 
                        src={transformImageUrl(image.src, imgIndex === 0 ? 1200 : 600)}
                        alt={image.alt} 
                        className="w-full h-auto transition-transform duration-1000 hover:scale-105"
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Wedding Day Journey Timeline */}
      <div className="wedding-day-journey py-20 my-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-light text-center mb-16">The Wedding Day Journey</h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-rose-200 dark:bg-rose-800"></div>
            
            {/* Timeline Items */}
            <div className="space-y-32 relative">
              {/* Getting Ready */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-16 md:text-right mb-8 md:mb-0 relative">
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 border-4 border-white dark:border-gray-800 z-10"></div>
                  <h4 className="text-xl font-light mb-3">Getting Ready</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    The quiet moments of anticipation as the bride and groom prepare for their day. 
                    These intimate moments set the emotional tone for the entire wedding story.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-16">
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <a 
                      href={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/karni-zilvinas/images/karni-zilvinas-3.jpg', 1800)}
                      className="gallery-item block"
                      data-pswp-width={1200}
                      data-pswp-height={800}
                    >
                      <img 
                        src={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/karni-zilvinas/images/karni-zilvinas-3.jpg', 800)}
                        alt="Bride preparation" 
                        className="w-full h-auto transition-transform duration-1000 hover:scale-105"
                      />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Ceremony */}
              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 md:pl-16 md:text-left mb-8 md:mb-0 relative">
                  <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 border-4 border-white dark:border-gray-800 z-10"></div>
                  <h4 className="text-xl font-light mb-3">The Ceremony</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    The emotional exchange of vows and rings as two become one. 
                    I capture both the grand moments and the subtle emotions that make this time so special.
                  </p>
                </div>
                <div className="md:w-1/2 md:pr-16">
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <a 
                      href={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/karni-zilvinas/images/karni-zilvinas-5.jpg', 1800)}
                      className="gallery-item block"
                      data-pswp-width={1200}
                      data-pswp-height={800}
                    >
                      <img 
                        src={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/karni-zilvinas/images/karni-zilvinas-5.jpg', 800)}
                        alt="Wedding ceremony" 
                        className="w-full h-auto transition-transform duration-1000 hover:scale-105"
                      />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Portraits */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-16 md:text-right mb-8 md:mb-0 relative">
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 border-4 border-white dark:border-gray-800 z-10"></div>
                  <h4 className="text-xl font-light mb-3">Couple Portraits</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Intimate moments captured between the newlyweds in their first hours of marriage.
                    These images showcase both the connection between the couple and the beauty of their surroundings.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-16">
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <a 
                      href={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/crysta-david/images/cdw-170.jpg', 1800)}
                      className="gallery-item block"
                      data-pswp-width={1200}
                      data-pswp-height={800}
                    >
                      <img 
                        src={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/crysta-david/images/cdw-170.jpg', 800)}
                        alt="Romantic couple portrait" 
                        className="w-full h-auto transition-transform duration-1000 hover:scale-105"
                      />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Reception */}
              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 md:pl-16 md:text-left mb-8 md:mb-0 relative">
                  <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 border-4 border-white dark:border-gray-800 z-10"></div>
                  <h4 className="text-xl font-light mb-3">The Reception</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    The celebration continues with dining, dancing, and cherished traditions.
                    From emotional toasts to joyful dance floor moments, I document the full spectrum of emotions.
                  </p>
                </div>
                <div className="md:w-1/2 md:pr-16">
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <a 
                      href={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/crysta-david/images/cdw-322.jpg', 1800)}
                      className="gallery-item block"
                      data-pswp-width={1200}
                      data-pswp-height={800}
                    >
                      <img 
                        src={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/crysta-david/images/cdw-322.jpg', 800)}
                        alt="Castle wedding reception" 
                        className="w-full h-auto transition-transform duration-1000 hover:scale-105"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="text-center py-12 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
        <h3 className="text-2xl font-light mb-4">Ready to Tell Your Wedding Story?</h3>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 mb-8">
          I'd love to capture the unique moments and emotions of your wedding day. 
          Let's create a visual story that you'll treasure for generations.
        </p>
        <button className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full transition duration-300 text-sm tracking-wider">
          BOOK A CONSULTATION
        </button>
      </div>
    </div>
  );
};

export default WeddingStoriesGallery;
