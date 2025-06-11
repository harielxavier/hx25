// Mock data for portfolio while Firebase collections are being set up
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category?: string;
  subcategory?: string;
  featured?: boolean;
  order?: number;
}

export interface Gallery {
  id: string;
  title: string;
  coupleName: string;
  venueName: string;
  venueId?: string;
  location: string;
  date: string;
  coverImage: string;
  description: string;
  type: 'wedding' | 'engagement';
  slug: string;
  featured: boolean;
  images: GalleryImage[];
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  description: string;
  highlightImages: string[];
  website?: string;
}

// Hero slider images
export const heroImages: GalleryImage[] = [
  {
    id: 'hero1',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    alt: 'Bride and groom embracing in sunset',
    width: 1920,
    height: 1080,
    featured: true,
    order: 1
  },
  {
    id: 'hero2',
    src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a',
    alt: 'Couple walking through garden',
    width: 1920,
    height: 1080,
    featured: true,
    order: 2
  },
  {
    id: 'hero3',
    src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff',
    alt: 'First dance at wedding reception',
    width: 1920,
    height: 1080,
    featured: true,
    order: 3
  },
  {
    id: 'hero4',
    src: 'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f',
    alt: 'Bride with bouquet',
    width: 1920,
    height: 1080,
    featured: true,
    order: 4
  }
];

// Wedding galleries
export const weddingGalleries: Gallery[] = [
  {
    id: 'wedding1',
    title: 'Elegant Vineyard Wedding',
    coupleName: 'Sarah & Michael',
    venueName: 'Willow Creek Vineyard',
    venueId: 'venue1',
    location: 'Napa Valley, CA',
    date: '2024-06-15',
    coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b',
    description: 'A beautiful summer wedding at a scenic vineyard with stunning mountain views.',
    type: 'wedding',
    slug: 'sarah-michael-vineyard-wedding',
    featured: true,
    images: Array(24).fill(null).map((_, i) => ({
      id: `wedding1-${i}`,
      src: `https://images.unsplash.com/photo-${1537633552985 + i}`,
      alt: `Sarah & Michael wedding photo ${i+1}`,
      width: 1200,
      height: 800,
      category: i < 8 ? 'ceremony' : i < 16 ? 'reception' : 'portraits'
    }))
  },
  {
    id: 'wedding2',
    title: 'Rustic Barn Wedding',
    coupleName: 'Emma & James',
    venueName: 'Oakwood Barn',
    venueId: 'venue2',
    location: 'Hudson Valley, NY',
    date: '2024-05-22',
    coverImage: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74',
    description: 'A charming rustic wedding in a renovated barn with countryside views.',
    type: 'wedding',
    slug: 'emma-james-barn-wedding',
    featured: true,
    images: Array(20).fill(null).map((_, i) => ({
      id: `wedding2-${i}`,
      src: `https://images.unsplash.com/photo-${1532712938310 + i}`,
      alt: `Emma & James wedding photo ${i+1}`,
      width: 1200,
      height: 800,
      category: i < 6 ? 'ceremony' : i < 14 ? 'reception' : 'portraits'
    }))
  },
  {
    id: 'wedding3',
    title: 'Beachfront Celebration',
    coupleName: 'Olivia & Daniel',
    venueName: 'Azure Beach Resort',
    venueId: 'venue3',
    location: 'Malibu, CA',
    date: '2024-04-08',
    coverImage: 'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f',
    description: 'A breathtaking sunset wedding on the beach with ocean views.',
    type: 'wedding',
    slug: 'olivia-daniel-beach-wedding',
    featured: true,
    images: Array(22).fill(null).map((_, i) => ({
      id: `wedding3-${i}`,
      src: `https://images.unsplash.com/photo-${1546032996 + i}`,
      alt: `Olivia & Daniel wedding photo ${i+1}`,
      width: 1200,
      height: 800,
      category: i < 7 ? 'ceremony' : i < 15 ? 'reception' : 'portraits'
    }))
  },
  {
    id: 'wedding4',
    title: 'Garden Estate Wedding',
    coupleName: 'Sophia & William',
    venueName: 'Rosewood Estate',
    venueId: 'venue4',
    location: 'Charleston, SC',
    date: '2024-03-19',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    description: 'An elegant garden wedding at a historic estate with beautiful architecture.',
    type: 'wedding',
    slug: 'sophia-william-estate-wedding',
    featured: false,
    images: Array(18).fill(null).map((_, i) => ({
      id: `wedding4-${i}`,
      src: `https://images.unsplash.com/photo-${1519741497674 + i}`,
      alt: `Sophia & William wedding photo ${i+1}`,
      width: 1200,
      height: 800,
      category: i < 6 ? 'ceremony' : i < 12 ? 'reception' : 'portraits'
    }))
  },
  {
    id: 'wedding5',
    title: 'Modern City Wedding',
    coupleName: 'Ava & Benjamin',
    venueName: 'The Metropolitan',
    venueId: 'venue5',
    location: 'Chicago, IL',
    date: '2024-02-11',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
    description: 'A sophisticated urban wedding with stunning city skyline views.',
    type: 'wedding',
    slug: 'ava-benjamin-city-wedding',
    featured: false,
    images: Array(25).fill(null).map((_, i) => ({
      id: `wedding5-${i}`,
      src: `https://images.unsplash.com/photo-${1511795409834 + i}`,
      alt: `Ava & Benjamin wedding photo ${i+1}`,
      width: 1200,
      height: 800,
      category: i < 8 ? 'ceremony' : i < 16 ? 'reception' : 'portraits'
    }))
  },
  {
    id: 'wedding6',
    title: 'Mountain Lodge Wedding',
    coupleName: 'Isabella & Ethan',
    venueName: 'Pine Ridge Lodge',
    venueId: 'venue6',
    location: 'Aspen, CO',
    date: '2024-01-28',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a',
    description: 'A cozy winter wedding in a mountain lodge surrounded by snow-capped peaks.',
    type: 'wedding',
    slug: 'isabella-ethan-mountain-wedding',
    featured: false,
    images: Array(21).fill(null).map((_, i) => ({
      id: `wedding6-${i}`,
      src: `https://images.unsplash.com/photo-${1583939003579 + i}`,
      alt: `Isabella & Ethan wedding photo ${i+1}`,
      width: 1200,
      height: 800,
      category: i < 7 ? 'ceremony' : i < 14 ? 'reception' : 'portraits'
    }))
  }
];

// Engagement galleries
export const engagementGalleries: Gallery[] = [
  {
    id: 'engagement1',
    title: 'Sunset Beach Engagement',
    coupleName: 'Jessica & Ryan',
    venueName: 'Golden Gate Beach',
    location: 'San Francisco, CA',
    date: '2024-05-10',
    coverImage: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5',
    description: 'A romantic sunset engagement session on the beach.',
    type: 'engagement',
    slug: 'jessica-ryan-beach-engagement',
    featured: true,
    images: Array(15).fill(null).map((_, i) => ({
      id: `engagement1-${i}`,
      src: `https://images.unsplash.com/photo-${1529634597503 + i}`,
      alt: `Jessica & Ryan engagement photo ${i+1}`,
      width: 1200,
      height: 800
    }))
  },
  {
    id: 'engagement2',
    title: 'Urban Downtown Engagement',
    coupleName: 'Mia & Noah',
    venueName: 'Historic District',
    location: 'New York, NY',
    date: '2024-04-22',
    coverImage: 'https://images.unsplash.com/photo-1522673607200-164d1b3ce551',
    description: 'A stylish engagement session in the heart of the city.',
    type: 'engagement',
    slug: 'mia-noah-urban-engagement',
    featured: true,
    images: Array(14).fill(null).map((_, i) => ({
      id: `engagement2-${i}`,
      src: `https://images.unsplash.com/photo-${1522673607200 + i}`,
      alt: `Mia & Noah engagement photo ${i+1}`,
      width: 1200,
      height: 800
    }))
  },
  {
    id: 'engagement3',
    title: 'Autumn Park Engagement',
    coupleName: 'Charlotte & Lucas',
    venueName: 'Central Park',
    location: 'New York, NY',
    date: '2024-03-15',
    coverImage: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff',
    description: 'A beautiful fall engagement session with colorful foliage.',
    type: 'engagement',
    slug: 'charlotte-lucas-autumn-engagement',
    featured: true,
    images: Array(16).fill(null).map((_, i) => ({
      id: `engagement3-${i}`,
      src: `https://images.unsplash.com/photo-${1591604466107 + i}`,
      alt: `Charlotte & Lucas engagement photo ${i+1}`,
      width: 1200,
      height: 800
    }))
  },
  {
    id: 'engagement4',
    title: 'Vineyard Engagement',
    coupleName: 'Amelia & Alexander',
    venueName: 'Sunset Vineyard',
    location: 'Sonoma, CA',
    date: '2024-02-28',
    coverImage: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a',
    description: 'A romantic engagement session among the vines at sunset.',
    type: 'engagement',
    slug: 'amelia-alexander-vineyard-engagement',
    featured: false,
    images: Array(13).fill(null).map((_, i) => ({
      id: `engagement4-${i}`,
      src: `https://images.unsplash.com/photo-${1469371670807 + i}`,
      alt: `Amelia & Alexander engagement photo ${i+1}`,
      width: 1200,
      height: 800
    }))
  }
];

// Maternity images
export const maternityImages: GalleryImage[] = Array(24).fill(null).map((_, i) => ({
  id: `maternity-${i}`,
  src: `https://images.unsplash.com/photo-${1590486803898 + i * 1000}`,
  alt: `Maternity photo ${i+1}`,
  width: 1200,
  height: 800,
  category: 'maternity',
  subcategory: i < 8 ? 'studio' : i < 16 ? 'outdoor' : 'lifestyle'
}));

// Portrait images
export const portraitImages: GalleryImage[] = Array(30).fill(null).map((_, i) => ({
  id: `portrait-${i}`,
  src: `https://images.unsplash.com/photo-${1580489944761 + i * 1000}`,
  alt: `Portrait photo ${i+1}`,
  width: 1200,
  height: 800,
  category: 'portrait',
  subcategory: i < 10 ? 'family' : i < 20 ? 'individual' : 'couples'
}));

// Commercial images
export const commercialImages: GalleryImage[] = Array(18).fill(null).map((_, i) => ({
  id: `commercial-${i}`,
  src: `https://images.unsplash.com/photo-${1560264280 + i * 1000}`,
  alt: `Commercial photo ${i+1}`,
  width: 1200,
  height: 800,
  category: 'commercial',
  subcategory: i < 6 ? 'product' : i < 12 ? 'real-estate' : 'corporate'
}));

// Venues
export const venues: Venue[] = [
  {
    id: 'venue1',
    name: 'Willow Creek Vineyard',
    location: 'Napa Valley, CA',
    description: 'A stunning vineyard venue with panoramic views of the valley and mountains. Perfect for elegant outdoor ceremonies and receptions.',
    highlightImages: [
      'https://images.unsplash.com/photo-1519671482248-5219bcc8e0bf',
      'https://images.unsplash.com/photo-1505944270255-72b8c68c6a70',
      'https://images.unsplash.com/photo-1510076857177-7470076d4098'
    ],
    website: 'https://example.com/willow-creek-vineyard'
  },
  {
    id: 'venue2',
    name: 'Oakwood Barn',
    location: 'Hudson Valley, NY',
    description: 'A charming restored barn venue with rustic elegance. Features exposed wooden beams, string lights, and beautiful countryside surroundings.',
    highlightImages: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
      'https://images.unsplash.com/photo-1505944357431-27579db47e72'
    ],
    website: 'https://example.com/oakwood-barn'
  },
  {
    id: 'venue3',
    name: 'Azure Beach Resort',
    location: 'Malibu, CA',
    description: 'A breathtaking beachfront venue with panoramic ocean views. Perfect for sunset ceremonies on the sand and elegant receptions overlooking the water.',
    highlightImages: [
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21',
      'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6'
    ],
    website: 'https://example.com/azure-beach-resort'
  }
];

// Helper function to get a venue by ID
export const getVenueById = (id: string): Venue | undefined => {
  return venues.find(venue => venue.id === id);
};

// Helper function to get a gallery by slug
export const getGalleryBySlug = (slug: string): Gallery | undefined => {
  return [...weddingGalleries, ...engagementGalleries].find(gallery => gallery.slug === slug);
};
