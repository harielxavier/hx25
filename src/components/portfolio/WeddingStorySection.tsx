import React from 'react';
import { transformImageUrl } from '../../utils/imageOptimizationUtils';

const WeddingStorySection: React.FC = () => {
  return (
    <div className="wedding-stories space-y-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light tracking-wide mb-4">Wedding Stories</h2>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed">
          Each wedding tells a unique story. Browse through these complete wedding journeys to experience the full emotional narrative of the day.
        </p>
      </div>
      
      {/* Wedding Story 1: Karni & Zilvinas */}
      <div className="wedding-story">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <div className="md:w-1/3">
            <h3 className="text-2xl font-light mb-3">Karni & Zilvinas</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-1">The Plaza Hotel</p>
            <p className="text-gray-500 dark:text-gray-500 mb-4">New York City • June 2024</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              An elegant celebration that blended traditional elements with modern sophistication. From the emotional first look to the last dance, every moment was filled with joy and connection.
            </p>
            <button className="mt-6 border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white px-6 py-2 rounded-full transition duration-300 text-sm tracking-wider">
              VIEW FULL GALLERY
            </button>
          </div>
          <div className="md:w-2/3 grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-lg shadow-lg col-span-2">
              <a 
                href={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/karni-zilvinas/images/karni-zilvinas-1.jpg', 1800)}
                className="gallery-item block"
                data-pswp-width={1200}
                data-pswp-height={800}
              >
                <img 
                  src={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/karni-zilvinas/images/karni-zilvinas-1.jpg', 1200)}
                  alt="Karni & Zilvinas" 
                  className="w-full h-auto transition-transform duration-1000 hover:scale-105"
                />
              </a>
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <a 
                href={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/karni-zilvinas/images/karni-zilvinas-3.jpg', 1800)}
                className="gallery-item block"
                data-pswp-width={1200}
                data-pswp-height={800}
              >
                <img 
                  src={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/karni-zilvinas/images/karni-zilvinas-3.jpg', 600)}
                  alt="Bride preparation" 
                  className="w-full h-auto transition-transform duration-1000 hover:scale-105"
                />
              </a>
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <a 
                href={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/karni-zilvinas/images/karni-zilvinas-5.jpg', 1800)}
                className="gallery-item block"
                data-pswp-width={1200}
                data-pswp-height={800}
              >
                <img 
                  src={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/karni-zilvinas/images/karni-zilvinas-5.jpg', 600)}
                  alt="Wedding ceremony" 
                  className="w-full h-auto transition-transform duration-1000 hover:scale-105"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wedding Story 2: Crysta & David */}
      <div className="wedding-story">
        <div className="flex flex-col md:flex-row-reverse items-center md:items-start gap-8 mb-12">
          <div className="md:w-1/3">
            <h3 className="text-2xl font-light mb-3">Crysta & David</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-1">Castle Hill</p>
            <p className="text-gray-500 dark:text-gray-500 mb-4">Newport • September 2023</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              A breathtaking seaside celebration with timeless elegance. The historic venue provided a stunning backdrop for a day filled with heartfelt moments and joyful celebrations.
            </p>
            <button className="mt-6 border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white px-6 py-2 rounded-full transition duration-300 text-sm tracking-wider">
              VIEW FULL GALLERY
            </button>
          </div>
          <div className="md:w-2/3 grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-lg shadow-lg col-span-2">
              <a 
                href={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/crysta-david/images/cdw-322.jpg', 1800)}
                className="gallery-item block"
                data-pswp-width={1200}
                data-pswp-height={800}
              >
                <img 
                  src={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/crysta-david/images/cdw-322.jpg', 1200)}
                  alt="Crysta & David" 
                  className="w-full h-auto transition-transform duration-1000 hover:scale-105"
                />
              </a>
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <a 
                href={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/crysta-david/images/cdw-170.jpg', 1800)}
                className="gallery-item block"
                data-pswp-width={1200}
                data-pswp-height={800}
              >
                <img 
                  src={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/crysta-david/images/cdw-170.jpg', 600)}
                  alt="Romantic couple portrait" 
                  className="w-full h-auto transition-transform duration-1000 hover:scale-105"
                />
              </a>
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <a 
                href={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/crysta-david/images/cdw-25.jpg', 1800)}
                className="gallery-item block"
                data-pswp-width={1200}
                data-pswp-height={800}
              >
                <img 
                  src={transformImageUrl('https://storage.googleapis.com/harielxavierphotography-18d17.firebasestorage.app/portfolios/crysta-david/images/cdw-25.jpg', 600)}
                  alt="Bride getting ready" 
                  className="w-full h-auto transition-transform duration-1000 hover:scale-105"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wedding Day Timeline */}
      <div className="wedding-day-timeline py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-light text-center mb-12">The Wedding Day Journey</h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-rose-200 dark:bg-rose-900"></div>
            
            {/* Timeline Items */}
            <div className="space-y-24 relative">
              {/* Getting Ready */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                  <h4 className="text-xl font-light mb-2">Getting Ready</h4>
                  <p className="text-gray-600 dark:text-gray-400">The quiet moments of anticipation as the bride and groom prepare for their day.</p>
                </div>
                <div className="md:w-1/2 md:pl-12">
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
                <div className="md:w-1/2 md:pl-12 md:text-left mb-6 md:mb-0">
                  <h4 className="text-xl font-light mb-2">The Ceremony</h4>
                  <p className="text-gray-600 dark:text-gray-400">The emotional exchange of vows and rings as two become one.</p>
                </div>
                <div className="md:w-1/2 md:pr-12">
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
                <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                  <h4 className="text-xl font-light mb-2">Couple Portraits</h4>
                  <p className="text-gray-600 dark:text-gray-400">Intimate moments captured between the newlyweds in their first hours of marriage.</p>
                </div>
                <div className="md:w-1/2 md:pl-12">
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
                <div className="md:w-1/2 md:pl-12 md:text-left mb-6 md:mb-0">
                  <h4 className="text-xl font-light mb-2">The Reception</h4>
                  <p className="text-gray-600 dark:text-gray-400">The celebration continues with dining, dancing, and cherished traditions.</p>
                </div>
                <div className="md:w-1/2 md:pr-12">
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
    </div>
  );
};

export default WeddingStorySection;
