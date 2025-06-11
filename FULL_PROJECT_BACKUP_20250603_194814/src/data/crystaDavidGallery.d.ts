export interface CrystaDavidImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category: string;
  section?: string;
  featured?: boolean;
}

export interface CrystaDavidVenue {
  name: string;
  location: string;
  description: string;
  images: string[];
  website?: string;
}

export interface CrystaDavidGalleryData {
  id: string;
  title: string;
  coupleName: string;
  date: string;
  venueName: string;
  location: string;
  slug: string;
  description: string;
  coverImage: string;
  featuredImages: string[];
  venue: CrystaDavidVenue;
}

export const crystaDavidImages: CrystaDavidImage[];
export const crystaDavidGalleryData: CrystaDavidGalleryData;
