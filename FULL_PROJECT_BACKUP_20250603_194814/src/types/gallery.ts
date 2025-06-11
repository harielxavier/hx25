// Gallery image type definition
export interface GalleryImage {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}

// Gallery type definition
export interface Gallery {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  images: GalleryImage[];
}
