import React from 'react';

// Skeleton for portfolio grid items
export const PortfolioItemSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden">
      <div className="aspect-[3/4] w-full"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  );
};

// Skeleton for portfolio grid
export const PortfolioGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
      {Array(9).fill(0).map((_, index) => (
        <PortfolioItemSkeleton key={index} />
      ))}
    </div>
  );
};

// Skeleton for hero section
export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative h-[85vh] bg-gray-200 dark:bg-gray-700 animate-pulse overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-64 mb-6"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-80"></div>
      </div>
    </div>
  );
};

// Skeleton for luxury positioning bar
export const LuxuryBarSkeleton: React.FC = () => {
  return (
    <div className="h-[120px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-pulse">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
        <div className="hidden md:flex items-center space-x-6">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="h-8 bg-gray-200 dark:bg-gray-700 w-20 rounded"></div>
          ))}
        </div>
        <div className="hidden lg:block">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-48"></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for featured wedding
export const FeaturedWeddingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto"></div>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
          </div>
          
          <div className="mb-16">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="col-span-full bg-gray-200 dark:bg-gray-700 rounded-sm h-96"></div>
            <div className="col-span-1 row-span-2 bg-gray-200 dark:bg-gray-700 rounded-sm h-96"></div>
            <div className="col-span-1 bg-gray-200 dark:bg-gray-700 rounded-sm h-44"></div>
            <div className="col-span-1 bg-gray-200 dark:bg-gray-700 rounded-sm h-44"></div>
            <div className="col-span-2 bg-gray-200 dark:bg-gray-700 rounded-sm h-64"></div>
            <div className="col-span-full bg-gray-200 dark:bg-gray-700 rounded-sm h-96"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for testimonials
export const TestimonialsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 animate-pulse">
      {Array(3).fill(0).map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-900 shadow-xl p-8 md:p-10 rounded-sm">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          
          <div className="mb-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
            
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton for application form
export const ApplicationFormSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-xl p-8 md:p-12 rounded-sm animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {Array(4).fill(0).map((_, index) => (
          <div key={index}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
      
      {Array(4).fill(0).map((_, index) => (
        <div key={`field-${index}`} className="mb-8">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      ))}
      
      <div className="text-center">
        <div className="inline-block h-12 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
      </div>
    </div>
  );
};

// Skeleton for destination map
export const DestinationMapSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-[400px] w-full bg-gray-200 dark:bg-gray-700 rounded-sm mb-16"></div>
      
      <div className="mb-8">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-sm h-64"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
