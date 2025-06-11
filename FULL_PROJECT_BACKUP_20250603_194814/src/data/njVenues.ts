// This file contains a comprehensive list of wedding venues in New Jersey
// This allows for fast autocomplete even when offline and reduces API calls

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  county: string;
  type: VenueType;
  capacity?: number;
  website?: string;
}

export enum VenueType {
  BALLROOM = 'Ballroom',
  BARN = 'Barn',
  BEACH = 'Beach',
  COUNTRY_CLUB = 'Country Club',
  ESTATE = 'Estate',
  GARDEN = 'Garden',
  HISTORIC = 'Historic',
  HOTEL = 'Hotel',
  INDUSTRIAL = 'Industrial',
  MANSION = 'Mansion',
  RESTAURANT = 'Restaurant',
  VINEYARD = 'Vineyard',
  WATERFRONT = 'Waterfront',
  OTHER = 'Other'
}

// Top wedding venues in New Jersey
export const njVenues: Venue[] = [
  {
    id: 'park-chateau',
    name: 'Park Chateau Estate & Gardens',
    address: '678 Cranbury Rd',
    city: 'East Brunswick',
    county: 'Middlesex',
    type: VenueType.ESTATE,
    capacity: 400,
    website: 'https://parkchateauevents.com'
  },
  {
    id: 'naninas-in-the-park',
    name: 'Nanina\'s in the Park',
    address: '540 Mill St',
    city: 'Belleville',
    county: 'Essex',
    type: VenueType.ESTATE,
    capacity: 400,
    website: 'https://naninasinthepark.com'
  },
  {
    id: 'the-ashford-estate',
    name: 'The Ashford Estate',
    address: '637 Province Line Rd',
    city: 'Allentown',
    county: 'Monmouth',
    type: VenueType.ESTATE,
    capacity: 275,
    website: 'https://theashfordestate.com'
  },
  {
    id: 'the-palace-at-somerset-park',
    name: 'The Palace at Somerset Park',
    address: '333 Davidson Ave',
    city: 'Somerset',
    county: 'Somerset',
    type: VenueType.BALLROOM,
    capacity: 600,
    website: 'https://palacesomersetpark.com'
  },
  {
    id: 'the-grove',
    name: 'The Grove',
    address: '691 Pompton Ave',
    city: 'Cedar Grove',
    county: 'Essex',
    type: VenueType.BALLROOM,
    capacity: 700,
    website: 'https://thegrove.com'
  },
  {
    id: 'crystal-plaza',
    name: 'Crystal Plaza',
    address: '305 W Northfield Rd',
    city: 'Livingston',
    county: 'Essex',
    type: VenueType.MANSION,
    capacity: 400,
    website: 'https://crystalplaza.com'
  },
  {
    id: 'the-legacy-castle',
    name: 'The Legacy Castle',
    address: '141 NJ-23',
    city: 'Pompton Plains',
    county: 'Morris',
    type: VenueType.BALLROOM,
    capacity: 1500,
    website: 'https://thelegacycastle.com'
  },
  {
    id: 'pleasantdale-chateau',
    name: 'Pleasantdale Chateau',
    address: '757 Eagle Rock Ave',
    city: 'West Orange',
    county: 'Essex',
    type: VenueType.ESTATE,
    capacity: 300,
    website: 'https://pleasantdale.com'
  },
  {
    id: 'the-ryland-inn',
    name: 'The Ryland Inn',
    address: '115 Old Hwy 28',
    city: 'Whitehouse Station',
    county: 'Hunterdon',
    type: VenueType.HISTORIC,
    capacity: 200,
    website: 'https://rylandinnnj.com'
  },
  {
    id: 'the-venetian',
    name: 'The Venetian',
    address: '546 River Dr',
    city: 'Garfield',
    county: 'Bergen',
    type: VenueType.BALLROOM,
    capacity: 800,
    website: 'https://venetiannj.com'
  },
  {
    id: 'the-stone-house-at-stirling-ridge',
    name: 'The Stone House at Stirling Ridge',
    address: '50 Stirling Rd',
    city: 'Warren',
    county: 'Somerset',
    type: VenueType.RESTAURANT,
    capacity: 325,
    website: 'https://stonehouseatstirlingridge.com'
  },
  {
    id: 'the-merion',
    name: 'The Merion',
    address: '1301 US-130',
    city: 'Cinnaminson',
    county: 'Burlington',
    type: VenueType.BALLROOM,
    capacity: 550,
    website: 'https://themerion.com'
  },
  {
    id: 'shadowbrook',
    name: 'Shadowbrook at Shrewsbury',
    address: '1 Obre Pl',
    city: 'Shrewsbury',
    county: 'Monmouth',
    type: VenueType.ESTATE,
    capacity: 300,
    website: 'https://shadowbrook.com'
  },
  {
    id: 'the-manor',
    name: 'The Manor',
    address: '111 Prospect Ave',
    city: 'West Orange',
    county: 'Essex',
    type: VenueType.ESTATE,
    capacity: 500,
    website: 'https://themanorrestaurant.com'
  },
  {
    id: 'olde-mill-inn',
    name: 'Olde Mill Inn',
    address: '225 NJ-202',
    city: 'Basking Ridge',
    county: 'Somerset',
    type: VenueType.HOTEL,
    capacity: 240,
    website: 'https://oldemillinn.com'
  },
  {
    id: 'battello',
    name: 'Battello',
    address: '502 Washington Blvd',
    city: 'Jersey City',
    county: 'Hudson',
    type: VenueType.WATERFRONT,
    capacity: 225,
    website: 'https://battellojc.com'
  },
  {
    id: 'the-madison-hotel',
    name: 'The Madison Hotel',
    address: '1 Convent Rd',
    city: 'Morristown',
    county: 'Morris',
    type: VenueType.HOTEL,
    capacity: 300,
    website: 'https://madisonhotel.com'
  },
  {
    id: 'the-rockleigh',
    name: 'The Rockleigh',
    address: '26 Paris Ave',
    city: 'Rockleigh',
    county: 'Bergen',
    type: VenueType.BALLROOM,
    capacity: 850,
    website: 'https://therockleigh.net'
  },
  {
    id: 'the-westmount-country-club',
    name: 'The Westmount Country Club',
    address: '728 Rifle Camp Rd',
    city: 'Woodland Park',
    county: 'Passaic',
    type: VenueType.COUNTRY_CLUB,
    capacity: 700,
    website: 'https://westmountcc.com'
  },
  {
    id: 'the-waterside',
    name: 'The Waterside',
    address: '45 NJ-34',
    city: 'Colts Neck',
    county: 'Monmouth',
    type: VenueType.WATERFRONT,
    capacity: 300,
    website: 'https://watersiderestaurant.com'
  },
  {
    id: 'perona-farms',
    name: 'Perona Farms',
    address: '350 Andover Sparta Rd',
    city: 'Andover',
    county: 'Sussex',
    type: VenueType.BARN,
    capacity: 300,
    website: 'https://peronafarms.com'
  },
  {
    id: 'the-addison-park',
    name: 'The Addison Park',
    address: '150 NJ-35',
    city: 'Aberdeen Township',
    county: 'Monmouth',
    type: VenueType.BALLROOM,
    capacity: 500,
    website: 'https://addisonpark.com'
  },
  {
    id: 'the-estate-at-florentine-gardens',
    name: 'The Estate at Florentine Gardens',
    address: '97 Rivervale Rd',
    city: 'River Vale',
    county: 'Bergen',
    type: VenueType.GARDEN,
    capacity: 360,
    website: 'https://florentinegardens.com'
  },
  {
    id: 'the-berkeley-oceanfront-hotel',
    name: 'The Berkeley Oceanfront Hotel',
    address: '1401 Ocean Ave',
    city: 'Asbury Park',
    county: 'Monmouth',
    type: VenueType.HOTEL,
    capacity: 450,
    website: 'https://berkeleyhotelnj.com'
  },
  {
    id: 'the-tides-estate',
    name: 'The Tides Estate',
    address: '1245 Belmont Ave',
    city: 'North Haledon',
    county: 'Passaic',
    type: VenueType.BALLROOM,
    capacity: 400,
    website: 'https://thetidesestate.com'
  }
];

// Function to search venues by name or city
export const searchVenues = (query: string): Venue[] => {
  if (!query || query.length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  return njVenues.filter(venue => 
    venue.name.toLowerCase().includes(lowercaseQuery) || 
    venue.city.toLowerCase().includes(lowercaseQuery) ||
    venue.county.toLowerCase().includes(lowercaseQuery)
  );
};

// Function to get venue by ID
export const getVenueById = (id: string): Venue | undefined => {
  return njVenues.find(venue => venue.id === id);
};

// Function to get venues by type
export const getVenuesByType = (type: VenueType): Venue[] => {
  return njVenues.filter(venue => venue.type === type);
};

// Function to get venues by county
export const getVenuesByCounty = (county: string): Venue[] => {
  return njVenues.filter(venue => venue.county.toLowerCase() === county.toLowerCase());
};
