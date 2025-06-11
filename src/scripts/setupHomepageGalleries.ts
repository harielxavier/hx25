// Script to set up homepage galleries using the existing gallery service
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Gallery } from '../services/galleryService';

interface SampleImage {
  url: string;
  thumbnailUrl: string;
  filename: string;
  title: string;
  description: string;
  featured: boolean;
  order: number;
  width: number;
  height: number;
  size: number;
  createdAt: Timestamp;
  tags: string[];
}

// Create three featured galleries for the homepage
const setupHomepageGalleries = async (): Promise<void> => {
  try {
    // Check if featured galleries already exist
    const galleriesRef = collection(db, 'galleries');
    const featuredQuery = query(galleriesRef, where('featured', '==', true));
    const existingFeatured = await getDocs(featuredQuery);
    
    if (!existingFeatured.empty) {
      console.log(`${existingFeatured.size} featured galleries already exist. Skipping creation.`);
      return;
    }
    
    // Create three featured galleries for the homepage
    const featuredGalleries: Partial<Gallery>[] = [
      {
        title: "Homepage Feature 1 - Wedding",
        slug: "homepage-feature-1-wedding",
        description: "This is the first featured gallery that appears on the homepage. Edit this gallery to change what appears in the first position of the homepage showcase.",
        coverImage: "https://source.unsplash.com/random/1200x800/?wedding",
        thumbnailImage: "https://source.unsplash.com/random/600x400/?wedding",
        clientName: "Homepage Feature 1",
        clientEmail: "admin@example.com",
        eventDate: Timestamp.fromDate(new Date()),
        expiresAt: null,
        password: null,
        isPublic: true,
        isPasswordProtected: false,
        allowDownloads: true,
        allowSharing: true,
        category: "homepage",
        location: "Homepage Position 1",
        featured: true,
        tags: ["homepage", "featured", "position-1", "wedding"],
        createdAt: Timestamp.now(),
        imageCount: 0
      },
      {
        title: "Homepage Feature 2 - Portrait",
        slug: "homepage-feature-2-portrait",
        description: "This is the second featured gallery that appears on the homepage. Edit this gallery to change what appears in the second position of the homepage showcase.",
        coverImage: "https://source.unsplash.com/random/1200x800/?portrait",
        thumbnailImage: "https://source.unsplash.com/random/600x400/?portrait",
        clientName: "Homepage Feature 2",
        clientEmail: "admin@example.com",
        eventDate: Timestamp.fromDate(new Date()),
        expiresAt: null,
        password: null,
        isPublic: true,
        isPasswordProtected: false,
        allowDownloads: true,
        allowSharing: true,
        category: "homepage",
        location: "Homepage Position 2",
        featured: true,
        tags: ["homepage", "featured", "position-2", "portrait"],
        createdAt: Timestamp.now(),
        imageCount: 0
      },
      {
        title: "Homepage Feature 3 - Landscape",
        slug: "homepage-feature-3-landscape",
        description: "This is the third featured gallery that appears on the homepage. Edit this gallery to change what appears in the third position of the homepage showcase.",
        coverImage: "https://source.unsplash.com/random/1200x800/?landscape",
        thumbnailImage: "https://source.unsplash.com/random/600x400/?landscape",
        clientName: "Homepage Feature 3",
        clientEmail: "admin@example.com",
        eventDate: Timestamp.fromDate(new Date()),
        expiresAt: null,
        password: null,
        isPublic: true,
        isPasswordProtected: false,
        allowDownloads: true,
        allowSharing: true,
        category: "homepage",
        location: "Homepage Position 3",
        featured: true,
        tags: ["homepage", "featured", "position-3", "landscape"],
        createdAt: Timestamp.now(),
        imageCount: 0
      }
    ];
    
    // Create each featured gallery
    const createdGalleries: Array<Partial<Gallery> & { id: string }> = [];
    for (const gallery of featuredGalleries) {
      const docRef = await addDoc(galleriesRef, gallery);
      console.log(`Created featured gallery: ${gallery.title} with ID: ${docRef.id}`);
      createdGalleries.push({
        id: docRef.id,
        ...gallery
      });
    }
    
    // Add sample images to each gallery
    await addSampleImagesToGalleries(createdGalleries);
    
    console.log('Featured galleries for homepage created successfully!');
    console.log('You can now edit these galleries in the admin panel to customize your homepage.');
  } catch (error) {
    console.error('Error creating featured galleries:', error);
  }
};

// Add sample images to the galleries
const addSampleImagesToGalleries = async (galleries: Array<Partial<Gallery> & { id: string }>): Promise<void> => {
  try {
    // Sample images for each category
    const sampleImages: Record<string, string[]> = {
      'wedding': [
        'https://source.unsplash.com/random/1200x800/?wedding,bride',
        'https://source.unsplash.com/random/1200x800/?wedding,couple',
        'https://source.unsplash.com/random/1200x800/?wedding,ceremony',
        'https://source.unsplash.com/random/1200x800/?wedding,reception',
        'https://source.unsplash.com/random/1200x800/?wedding,cake'
      ],
      'portrait': [
        'https://source.unsplash.com/random/1200x800/?portrait,woman',
        'https://source.unsplash.com/random/1200x800/?portrait,man',
        'https://source.unsplash.com/random/1200x800/?portrait,family',
        'https://source.unsplash.com/random/1200x800/?portrait,child',
        'https://source.unsplash.com/random/1200x800/?portrait,senior'
      ],
      'landscape': [
        'https://source.unsplash.com/random/1200x800/?landscape,mountain',
        'https://source.unsplash.com/random/1200x800/?landscape,beach',
        'https://source.unsplash.com/random/1200x800/?landscape,forest',
        'https://source.unsplash.com/random/1200x800/?landscape,desert',
        'https://source.unsplash.com/random/1200x800/?landscape,lake'
      ]
    };
    
    // Process each gallery
    for (const gallery of galleries) {
      console.log(`Adding images to gallery: ${gallery.title}`);
      
      // Determine which image set to use based on gallery tags or title
      let imageCategory = 'wedding'; // default
      
      if (gallery.title?.toLowerCase().includes('portrait') || gallery.tags?.includes('portrait')) {
        imageCategory = 'portrait';
      } else if (gallery.title?.toLowerCase().includes('landscape') || gallery.tags?.includes('landscape')) {
        imageCategory = 'landscape';
      }
      
      const images = sampleImages[imageCategory];
      const imagesCollectionRef = collection(db, 'galleries', gallery.id, 'images');
      
      // Add images to the gallery
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        const thumbnailUrl = imageUrl.replace('1200x800', '400x300');
        
        const imageData: SampleImage = {
          url: imageUrl,
          thumbnailUrl: thumbnailUrl,
          filename: `sample-image-${i + 1}.jpg`,
          title: `Sample Image ${i + 1}`,
          description: `This is a sample image for the gallery. Replace with your own content.`,
          featured: i < 3, // First 3 images are featured
          order: i,
          width: 1200,
          height: 800,
          size: 500000, // Fake size ~500KB
          createdAt: Timestamp.now(),
          tags: gallery.tags || []
        };
        
        await addDoc(imagesCollectionRef, imageData);
        
        console.log(`Added image ${i + 1} to gallery ${gallery.title}`);
      }
      
      // Update the gallery's cover and thumbnail images to use the first image
      await updateDoc(doc(db, 'galleries', gallery.id), {
        coverImage: images[0],
        thumbnailImage: images[0].replace('1200x800', '400x300'),
        imageCount: images.length
      });
      
      console.log(`Updated gallery ${gallery.title} with new cover and thumbnail images`);
    }
    
    console.log('Sample images added to all featured galleries successfully!');
  } catch (error) {
    console.error('Error adding sample images to galleries:', error);
  }
};

// Export the function for use in other files
export default setupHomepageGalleries;
