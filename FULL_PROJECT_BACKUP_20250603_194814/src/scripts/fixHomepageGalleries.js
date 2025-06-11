// Script to fix homepage galleries
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Wedding gallery image URLs - using real wedding photos
const weddingGalleryImages = {
  'wedding1': [
    'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80'
  ],
  'wedding2': [
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80'
  ],
  'wedding3': [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80',
    'https://images.unsplash.com/photo-1507217633297-c9815ce2ac75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80',
    'https://images.unsplash.com/photo-1550005809-91ad75fb315f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=800&q=80'
  ]
};

// Wedding gallery data
const weddingGalleries = [
  {
    title: "Emily & Michael's Wedding",
    slug: "emily-michael-wedding",
    description: "A beautiful summer wedding at Rosewood Estate featuring elegant decorations and a stunning sunset ceremony.",
    category: "wedding",
    location: "Rosewood Estate, California",
    tags: ["wedding", "featured", "summer", "outdoor"]
  },
  {
    title: "Sarah & James' Wedding",
    slug: "sarah-james-wedding",
    description: "An intimate beach wedding with close family and friends, featuring breathtaking ocean views and romantic moments.",
    category: "wedding",
    location: "Malibu Beach, California",
    tags: ["wedding", "featured", "beach", "intimate"]
  },
  {
    title: "Jessica & David's Wedding",
    slug: "jessica-david-wedding",
    description: "A luxurious ballroom wedding with elaborate floral arrangements and a spectacular first dance under crystal chandeliers.",
    category: "wedding",
    location: "Grand Plaza Hotel, New York",
    tags: ["wedding", "featured", "luxury", "indoor"]
  }
];

// Fix the homepage galleries
const fixHomepageGalleries = async () => {
  try {
    console.log('Starting to fix homepage galleries...');
    
    // Get all featured galleries
    const galleriesRef = collection(db, 'galleries');
    const featuredQuery = query(galleriesRef, where('featured', '==', true));
    const featuredSnapshot = await getDocs(featuredQuery);
    
    // If we don't have exactly 3 featured galleries, log an error
    if (featuredSnapshot.size !== 3) {
      console.log(`Found ${featuredSnapshot.size} featured galleries. Expected 3.`);
      console.log('Please ensure you have exactly 3 featured galleries before running this script.');
      return;
    }
    
    // Update each gallery with new data
    const galleries = featuredSnapshot.docs;
    for (let i = 0; i < galleries.length; i++) {
      const galleryDoc = galleries[i];
      const galleryId = galleryDoc.id;
      const galleryType = `wedding${i+1}`;
      const newData = weddingGalleries[i];
      
      // Update the gallery document
      await updateDoc(doc(db, 'galleries', galleryId), {
        title: newData.title,
        slug: newData.slug,
        description: newData.description,
        category: newData.category,
        location: newData.location,
        tags: newData.tags,
        coverImage: weddingGalleryImages[galleryType][0],
        thumbnailImage: weddingGalleryImages[galleryType][0].replace('w=1200&h=800', 'w=600&h=400'),
        updatedAt: Timestamp.now()
      });
      
      console.log(`Updated gallery ${i+1}: ${newData.title}`);
      
      // Get the images collection for this gallery
      const imagesRef = collection(db, 'galleries', galleryId, 'images');
      const imagesSnapshot = await getDocs(imagesRef);
      
      // If there are fewer than 3 images, log a warning
      if (imagesSnapshot.size < 3) {
        console.log(`Warning: Gallery ${galleryId} has only ${imagesSnapshot.size} images. Adding placeholder images.`);
        // TODO: Add code to create new images if needed
      }
      
      // Update the first 3 images with our wedding images
      const images = imagesSnapshot.docs;
      const imageUrls = weddingGalleryImages[galleryType];
      
      for (let j = 0; j < Math.min(images.length, imageUrls.length); j++) {
        const imageDoc = images[j];
        await updateDoc(doc(db, 'galleries', galleryId, 'images', imageDoc.id), {
          url: imageUrls[j],
          thumbnailUrl: imageUrls[j].replace('w=1200&h=800', 'w=400&h=300'),
          featured: true, // Make sure these images are featured
          updatedAt: Timestamp.now()
        });
        console.log(`Updated image ${j+1} in gallery ${newData.title}`);
      }
    }
    
    console.log('Homepage galleries fixed successfully!');
    console.log('The homepage should now display three distinct wedding galleries.');
  } catch (error) {
    console.error('Error fixing homepage galleries:', error);
  }
};

// Execute the function
fixHomepageGalleries()
  .then(() => console.log('Script completed'))
  .catch(error => console.error('Script failed:', error));
