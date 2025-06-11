import React, { useEffect, useRef } from 'react';

interface Destination {
  id: string;
  location: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  featured: boolean;
}

const DestinationWorkSection: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Sample destination data - replace with actual data
  const destinations: Destination[] = [
    {
      id: '1',
      location: 'Ravello',
      country: 'Italy',
      coordinates: { lat: 40.6513, lng: 14.6113 },
      image: 'https://source.unsplash.com/random/800x600/?ravello,wedding',
      featured: true
    },
    {
      id: '2',
      location: 'Santorini',
      country: 'Greece',
      coordinates: { lat: 36.3932, lng: 25.4615 },
      image: 'https://source.unsplash.com/random/800x600/?santorini,wedding',
      featured: true
    },
    {
      id: '3',
      location: 'Paris',
      country: 'France',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      image: 'https://source.unsplash.com/random/800x600/?paris,wedding',
      featured: true
    },
    {
      id: '4',
      location: 'Bali',
      country: 'Indonesia',
      coordinates: { lat: -8.4095, lng: 115.1889 },
      image: 'https://source.unsplash.com/random/800x600/?bali,wedding',
      featured: false
    },
    {
      id: '5',
      location: 'New York',
      country: 'USA',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      image: 'https://source.unsplash.com/random/800x600/?newyork,wedding',
      featured: true
    }
  ];
  
  // Upcoming destinations
  const upcomingDestinations = [
    {
      location: 'Lake Como, Italy',
      dates: 'May 15-30, 2025'
    },
    {
      location: 'Provence, France',
      dates: 'June 10-25, 2025'
    },
    {
      location: 'Mallorca, Spain',
      dates: 'July 5-20, 2025'
    }
  ];
  
  // Initialize map (this would be replaced with actual map implementation)
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Placeholder for map initialization
    // In a real implementation, you would use a library like Google Maps or Mapbox
    const initMap = () => {
      const mapElement = mapRef.current;
      if (!mapElement) return;
      
      // Placeholder for map - in production, replace with actual map implementation
      mapElement.innerHTML = `
        <div class="bg-gray-200 dark:bg-gray-700 rounded-sm h-full w-full flex items-center justify-center">
          <p class="text-gray-500 dark:text-gray-400">Interactive World Map with Destination Pins</p>
        </div>
      `;
    };
    
    initMap();
  }, []);
  
  return (
    <section className="destination-work-section py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl mb-4">Destination Work</h2>
          <p className="font-body text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Capturing extraordinary celebrations in the world's most prestigious locations.
          </p>
        </header>
        
        {/* World map with pins */}
        <div className="mb-16">
          <div ref={mapRef} className="h-[400px] w-full rounded-sm overflow-hidden"></div>
        </div>
        
        {/* Featured international weddings */}
        <div className="mb-16">
          <h3 className="font-display text-2xl mb-8 text-center">Featured Destinations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.filter(d => d.featured).map((destination) => (
              <div key={destination.id} className="destination-card relative overflow-hidden rounded-sm">
                <img 
                  src={destination.image} 
                  alt={`${destination.location}, ${destination.country}`} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h4 className="font-display text-xl">{destination.location}</h4>
                    <p className="font-body text-sm text-white/80">{destination.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Travel calendar */}
        <div className="max-w-2xl mx-auto">
          <h3 className="font-display text-2xl mb-8 text-center">Upcoming Destinations</h3>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-sm">
            <ul className="space-y-6">
              {upcomingDestinations.map((item, index) => (
                <li key={index} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                  <span className="font-display text-lg">{item.location}</span>
                  <span className="font-body text-gray-600 dark:text-gray-400">{item.dates}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 text-center">
              <p className="font-body text-gray-600 dark:text-gray-400 italic">
                Limited availability for destination weddings in these locations.
                <br />Contact for travel fee details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationWorkSection;
