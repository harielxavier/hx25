// Sussex County NJ Wedding Venues Data
// Comprehensive data for the Venue Lighting Simulator

export const sussexVenues = [
  // Luxury/Resort Venues
  {
    id: 'crystal-springs-grand-cascades',
    name: 'Crystal Springs Resort - Grand Cascades Lodge',
    address: '1 Wild Turkey Way, Hamburg, NJ 07419',
    category: 'luxury',
    subcategory: 'resort',
    coordinates: { lat: 41.1511, lng: -74.5335 },
    features: [
      'Mountain views', 
      'Ballroom with floor-to-ceiling windows', 
      'Outdoor ceremony space'
    ],
    lightingNotes: 'West-facing windows capture sunset, dramatic mountain backdrop',
    bestTimes: {
      spring: ['16:00', '18:00', '19:30'],
      summer: ['17:00', '19:00', '20:30'],
      fall: ['15:00', '17:00', '18:30'],
      winter: ['14:00', '15:30', '16:30']
    },
    imageUrls: {
      exterior: '/venues/crystal-springs-grand-cascades/exterior.jpg',
      interior: '/venues/crystal-springs-grand-cascades/interior.jpg',
      ceremony: '/venues/crystal-springs-grand-cascades/ceremony.jpg',
      reception: '/venues/crystal-springs-grand-cascades/reception.jpg',
      goldenhour: '/venues/crystal-springs-grand-cascades/goldenhour.jpg'
    }
  },
  {
    id: 'crystal-springs-ballyowen',
    name: 'Crystal Springs Resort - Ballyowen Golf Club',
    address: '105 Wheatsworth Road, Hamburg, NJ 07419',
    category: 'luxury',
    subcategory: 'golf',
    coordinates: { lat: 41.1589, lng: -74.5214 },
    features: [
      'Celtic-inspired clubhouse', 
      'Panoramic golf course views', 
      'Outdoor ceremony space'
    ],
    lightingNotes: 'Elevated position provides excellent golden hour lighting',
    bestTimes: {
      spring: ['16:30', '18:30', '19:45'],
      summer: ['17:30', '19:30', '20:45'],
      fall: ['15:30', '17:30', '18:45'],
      winter: ['14:30', '16:00', '17:00']
    },
    imageUrls: {
      exterior: '/venues/crystal-springs-ballyowen/exterior.jpg',
      interior: '/venues/crystal-springs-ballyowen/interior.jpg',
      ceremony: '/venues/crystal-springs-ballyowen/ceremony.jpg',
      reception: '/venues/crystal-springs-ballyowen/reception.jpg',
      goldenhour: '/venues/crystal-springs-ballyowen/goldenhour.jpg'
    }
  },
  {
    id: 'crystal-springs-black-bear',
    name: 'Crystal Springs Resort - Black Bear Golf Club',
    address: '138 State Route 23, Franklin, NJ 07416',
    category: 'luxury',
    subcategory: 'golf',
    coordinates: { lat: 41.1201, lng: -74.5803 },
    features: [
      'Rustic clubhouse', 
      'Mountain views', 
      'Outdoor terrace'
    ],
    lightingNotes: 'East-facing morning ceremony location, afternoon shade',
    bestTimes: {
      spring: ['9:30', '10:30', '16:00'],
      summer: ['9:00', '10:00', '17:00'],
      fall: ['10:00', '11:00', '15:30'],
      winter: ['10:30', '11:30', '14:30']
    },
    imageUrls: {
      exterior: '/venues/crystal-springs-black-bear/exterior.jpg',
      interior: '/venues/crystal-springs-black-bear/interior.jpg',
      ceremony: '/venues/crystal-springs-black-bear/ceremony.jpg',
      reception: '/venues/crystal-springs-black-bear/reception.jpg',
      goldenhour: '/venues/crystal-springs-black-bear/goldenhour.jpg'
    }
  },
  
  // Rustic/Barn Venues
  {
    id: 'bear-brook-valley',
    name: 'Bear Brook Valley',
    address: '23 Players Boulevard, Fredon Township, NJ 07860',
    category: 'rustic',
    subcategory: 'modern',
    coordinates: { lat: 41.0550, lng: -74.7769 },
    features: [
      'Modern rustic venue', 
      'Floor-to-ceiling windows', 
      'Outdoor ceremony space'
    ],
    lightingNotes: 'Wooded setting creates dappled light patterns',
    bestTimes: {
      spring: ['15:30', '17:30', '19:00'],
      summer: ['16:30', '18:30', '20:00'],
      fall: ['14:30', '16:30', '18:00'],
      winter: ['13:30', '15:00', '16:00']
    },
    imageUrls: {
      exterior: '/venues/bear-brook-valley/exterior.jpg',
      interior: '/venues/bear-brook-valley/interior.jpg',
      ceremony: '/venues/bear-brook-valley/ceremony.jpg',
      reception: '/venues/bear-brook-valley/reception.jpg',
      goldenhour: '/venues/bear-brook-valley/goldenhour.jpg'
    }
  },
  {
    id: 'perona-farms-barn',
    name: 'The Barn at Perona Farms',
    address: '350 Andover Sparta Road, Andover, NJ 07821',
    category: 'rustic',
    subcategory: 'barn',
    coordinates: { lat: 41.0130, lng: -74.7380 },
    features: [
      'Historic barn', 
      'Rustic elegance', 
      'Outdoor ceremony options'
    ],
    lightingNotes: 'Evening light filters beautifully through barn board walls',
    bestTimes: {
      spring: ['15:00', '17:00', '18:30'],
      summer: ['16:00', '18:00', '19:30'],
      fall: ['14:00', '16:00', '17:30'],
      winter: ['13:00', '14:30', '15:30']
    },
    imageUrls: {
      exterior: '/venues/perona-farms-barn/exterior.jpg',
      interior: '/venues/perona-farms-barn/interior.jpg',
      ceremony: '/venues/perona-farms-barn/ceremony.jpg',
      reception: '/venues/perona-farms-barn/reception.jpg',
      goldenhour: '/venues/perona-farms-barn/goldenhour.jpg'
    }
  },
  
  // Historic/Unique Venues
  {
    id: 'waterloo-village',
    name: 'Waterloo Village',
    address: '525 Waterloo Road, Stanhope, NJ 07874',
    category: 'historic',
    subcategory: 'village',
    coordinates: { lat: 40.9129, lng: -74.7547 },
    features: [
      'Historic canal town', 
      'Rustic buildings', 
      'Outdoor ceremony spaces'
    ],
    lightingNotes: 'Varied lighting conditions across the property',
    bestTimes: {
      spring: ['10:00', '15:00', '18:00'],
      summer: ['10:30', '16:00', '19:00'],
      fall: ['9:30', '14:00', '17:00'],
      winter: ['10:00', '13:00', '15:00']
    },
    imageUrls: {
      exterior: '/venues/waterloo-village/exterior.jpg',
      interior: '/venues/waterloo-village/interior.jpg',
      ceremony: '/venues/waterloo-village/ceremony.jpg',
      reception: '/venues/waterloo-village/reception.jpg',
      goldenhour: '/venues/waterloo-village/goldenhour.jpg'
    }
  },
  
  // Lakefront Venues
  {
    id: 'rock-island-lake-club',
    name: 'Rock Island Lake Club',
    address: '80 Mohawk Avenue, Sparta, NJ 07871',
    category: 'lakefront',
    subcategory: 'modern',
    coordinates: { lat: 41.0346, lng: -74.6400 },
    features: [
      'Private lake', 
      'Modern facilities', 
      'Outdoor ceremony space'
    ],
    lightingNotes: 'Lake reflects sunset colors beautifully',
    bestTimes: {
      spring: ['16:30', '18:30', '19:45'],
      summer: ['17:30', '19:30', '20:45'],
      fall: ['15:30', '17:30', '18:45'],
      winter: ['14:30', '16:00', '17:00']
    },
    imageUrls: {
      exterior: '/venues/rock-island-lake-club/exterior.jpg',
      interior: '/venues/rock-island-lake-club/interior.jpg',
      ceremony: '/venues/rock-island-lake-club/ceremony.jpg',
      reception: '/venues/rock-island-lake-club/reception.jpg',
      goldenhour: '/venues/rock-island-lake-club/goldenhour.jpg'
    }
  },
  {
    id: 'lake-mohawk-country-club',
    name: 'Lake Mohawk Country Club',
    address: '21 The Boardwalk, Sparta, NJ 07871',
    category: 'lakefront',
    subcategory: 'historic',
    coordinates: { lat: 41.0320, lng: -74.6363 },
    features: [
      'Alpine-style clubhouse', 
      'Lakefront setting', 
      'Ballroom with views'
    ],
    lightingNotes: 'West-facing windows capture sunset over lake',
    bestTimes: {
      spring: ['16:00', '18:00', '19:30'],
      summer: ['17:00', '19:00', '20:30'],
      fall: ['15:00', '17:00', '18:30'],
      winter: ['14:00', '15:30', '16:30']
    },
    imageUrls: {
      exterior: '/venues/lake-mohawk-country-club/exterior.jpg',
      interior: '/venues/lake-mohawk-country-club/interior.jpg',
      ceremony: '/venues/lake-mohawk-country-club/ceremony.jpg',
      reception: '/venues/lake-mohawk-country-club/reception.jpg',
      goldenhour: '/venues/lake-mohawk-country-club/goldenhour.jpg'
    }
  },
  
  // Add more venues following the same pattern...
];

// Categories for filtering
export const venueCategories = [
  { id: 'luxury', name: 'Luxury & Resort Venues' },
  { id: 'rustic', name: 'Rustic & Barn Venues' },
  { id: 'historic', name: 'Historic & Unique Venues' },
  { id: 'lakefront', name: 'Lakefront Venues' },
  { id: 'outdoor', name: 'Outdoor & Natural Settings' },
  { id: 'vineyard', name: 'Vineyard & Farm Venues' }
];

// Helper function to find venue by ID
export const getVenueById = (id) => {
  return sussexVenues.find(venue => venue.id === id);
};

// Helper function to get venues by category
export const getVenuesByCategory = (categoryId) => {
  return sussexVenues.filter(venue => venue.category === categoryId);
};

// Calculate sun position for a given date and time at venue coordinates
export const calculateSunPosition = (venue, date, time) => {
  // This is a placeholder - in a real implementation, you would use a solar position algorithm
  // based on the venue's coordinates and the selected date and time
  // For now, we'll return a simple object with direction and elevation
  return {
    direction: 'southwest', // e.g., 'east', 'southwest'
    elevation: 45, // degrees above horizon
    goldenHour: time >= '18:00' && time <= '19:30', // simplified check
    bluHour: time >= '19:30' && time <= '20:00', // simplified check
  };
};

// Get best photography times based on season
export const getBestTimes = (venue, season) => {
  return venue.bestTimes[season] || venue.bestTimes.summer;
};
