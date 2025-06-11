import React from 'react';

const LuxuryPositioningBar: React.FC = () => {
  // Sample publication logos - replace with actual logos
  const publications = [
    {
      name: "Vogue",
      logo: "/images/publications/vogue-logo.png" // Replace with actual path
    },
    {
      name: "Martha Stewart Weddings",
      logo: "/images/publications/msw-logo.png" // Replace with actual path
    },
    {
      name: "Brides",
      logo: "/images/publications/brides-logo.png" // Replace with actual path
    },
    {
      name: "Harper's Bazaar",
      logo: "/images/publications/harpers-logo.png" // Replace with actual path
    }
  ];
  
  // Calculate remaining dates for the year
  const currentYear = new Date().getFullYear();
  const remainingDates = 5; // Placeholder - replace with actual calculation or CMS data
  
  return (
    <section className="h-[120px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Artistic philosophy statement */}
        <div className="max-w-md">
          <p className="font-display text-lg italic text-gray-700 dark:text-gray-300">
            "Capturing the poetry of your most meaningful moments with an editorial eye"
          </p>
        </div>
        
        {/* Publication logos */}
        <div className="hidden md:flex items-center space-x-6">
          {publications.map((pub, index) => (
            <div key={index} className="h-8 opacity-80 grayscale hover:grayscale-0 transition-all duration-300">
              {/* Placeholder for logo images */}
              <div className="bg-gray-200 dark:bg-gray-700 h-8 w-20 flex items-center justify-center rounded">
                <span className="text-xs text-gray-500 dark:text-gray-400">{pub.name}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Limited availability indicator */}
        <div className="hidden lg:block">
          <div className="border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Limited Availability</span> • {remainingDates} dates remaining in {currentYear}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxuryPositioningBar;
