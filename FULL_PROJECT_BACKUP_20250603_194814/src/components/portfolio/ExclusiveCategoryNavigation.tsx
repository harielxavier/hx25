import React from 'react';

interface ExclusiveCategoryNavigationProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const ExclusiveCategoryNavigation: React.FC<ExclusiveCategoryNavigationProps> = ({ 
  activeCategory, 
  setActiveCategory 
}) => {
  // Premium categories
  const categories = [
    'Editorial',
    'Destination',
    'Black Tie',
    'Intimate'
  ];
  
  return (
    <nav className="exclusive-category-nav py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className={`relative mx-6 md:mx-10 py-3 font-display text-lg tracking-wide transition-all duration-500 ${
                activeCategory === category
                  ? 'text-black dark:text-white'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
              
              {/* Custom indicator for active category */}
              {activeCategory === category && (
                <span className="absolute bottom-0 left-0 w-full h-px bg-black dark:bg-white transform origin-left transition-transform duration-500 scale-x-100"></span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default ExclusiveCategoryNavigation;
