import React from 'react';

const ExclusiveOfferings: React.FC = () => {
  return (
    <section className="exclusive-offerings py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl mb-6">Exclusive Offerings</h2>
          
          <p className="font-body text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Bespoke photography services designed for discerning couples who value artistry, emotion, and exceptional quality.
          </p>
          
          {/* Limited availability messaging */}
          <div className="mb-16 py-6 px-8 border border-gray-200 dark:border-gray-700 inline-block">
            <p className="font-display text-lg">
              <span className="text-gray-500 dark:text-gray-400">Limited to</span> 15-20 <span className="text-gray-500 dark:text-gray-400">weddings per year</span>
            </p>
          </div>
          
          {/* Experience-focused rather than package-focused */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-left">
            <div className="experience-card">
              <h3 className="font-display text-xl mb-4">The Editorial Experience</h3>
              <p className="font-body text-gray-600 dark:text-gray-400 leading-relaxed">
                A comprehensive approach to wedding documentation with an editorial perspective. Includes pre-wedding consultation, full-day coverage, and a bespoke heirloom album.
              </p>
            </div>
            
            <div className="experience-card">
              <h3 className="font-display text-xl mb-4">The Destination Experience</h3>
              <p className="font-body text-gray-600 dark:text-gray-400 leading-relaxed">
                Extended coverage for destination celebrations, including welcome events and farewell gatherings. Crafted for multi-day celebrations in remarkable locations.
              </p>
            </div>
            
            <div className="experience-card">
              <h3 className="font-display text-xl mb-4">The Intimate Experience</h3>
              <p className="font-body text-gray-600 dark:text-gray-400 leading-relaxed">
                Tailored for elopements and intimate weddings with 50 guests or fewer. Focuses on capturing authentic moments and environmental portraits.
              </p>
            </div>
          </div>
          
          {/* "Begin the Conversation" CTA */}
          <div>
            <a 
              href="#apply" 
              className="inline-block bg-transparent border-2 border-black dark:border-white px-8 py-4 font-display text-lg tracking-wider transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            >
              Begin the Conversation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExclusiveOfferings;
