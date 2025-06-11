import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  Timestamp,
  writeBatch,
  doc
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxZL40_7Enc-I9IwRt0DllOMqlMwneje8",
  authDomain: "harielxavierphotograph.firebaseapp.com",
  projectId: "harielxavierphotograph",
  storageBucket: "harielxavierphotograph.appspot.com",
  messagingSenderId: "829105046643",
  appId: "1:829105046643:web:6d22b9c17ac453472fd606",
  measurementId: "G-0TQFQH1YLC"
};

// Initialize Firebase
// IMPORTANT: Use the shared Firebase instance from src/lib/firebase.ts instead of initializing a new one
// This prevents the "Firebase App named '[DEFAULT]' already exists" error
import app from '../lib/firebase';
// const app = initializeApp(firebaseConfig); // This line is commented out to prevent duplicate initialization;
const db = getFirestore(app);

// Sample gallery data
const sampleGalleries = [
  {
    title: "Mountain Wedding",
    slug: "mountain-wedding",
    description: "A beautiful wedding in the mountains of Colorado",
    coverImage: "https://source.unsplash.com/random/800x600/?wedding,mountain",
    thumbnailImage: "https://source.unsplash.com/random/400x300/?wedding,mountain",
    clientName: "John & Sarah Smith",
    clientEmail: "john.sarah@example.com",
    eventDate: Timestamp.fromDate(new Date(2024, 2, 15)),
    expiresAt: Timestamp.fromDate(new Date(2025, 2, 15)),
    password: null,
    isPublic: true,
    isPasswordProtected: false,
    allowDownloads: true,
    allowSharing: true,
    category: "weddings",
    location: "Aspen, Colorado",
    featured: true,
    tags: ["wedding", "mountains", "outdoor"],
    createdAt: Timestamp.now(),
    imageCount: 5
  },
  {
    title: "Beach Engagement",
    slug: "beach-engagement",
    description: "Romantic engagement photoshoot at sunset on the beach",
    coverImage: "https://source.unsplash.com/random/800x600/?engagement,beach",
    thumbnailImage: "https://source.unsplash.com/random/400x300/?engagement,beach",
    clientName: "Michael & Emma Johnson",
    clientEmail: "michael.emma@example.com",
    eventDate: Timestamp.fromDate(new Date(2024, 1, 10)),
    expiresAt: Timestamp.fromDate(new Date(2025, 1, 10)),
    password: null,
    isPublic: true,
    isPasswordProtected: false,
    allowDownloads: true,
    allowSharing: true,
    category: "engagements",
    location: "Miami Beach, Florida",
    featured: true,
    tags: ["engagement", "beach", "sunset"],
    createdAt: Timestamp.now(),
    imageCount: 3
  },
  {
    title: "Urban Portrait Session",
    slug: "urban-portrait",
    description: "Modern portrait photography in an urban setting",
    coverImage: "https://source.unsplash.com/random/800x600/?portrait,urban",
    thumbnailImage: "https://source.unsplash.com/random/400x300/?portrait,urban",
    clientName: "Alex Chen",
    clientEmail: "alex.chen@example.com",
    eventDate: Timestamp.fromDate(new Date(2024, 0, 20)),
    expiresAt: Timestamp.fromDate(new Date(2025, 0, 20)),
    password: null,
    isPublic: true,
    isPasswordProtected: false,
    allowDownloads: true,
    allowSharing: true,
    category: "portraits",
    location: "New York City",
    featured: false,
    tags: ["portrait", "urban", "city"],
    createdAt: Timestamp.now(),
    imageCount: 4
  },
  {
    title: "Family Reunion",
    slug: "family-reunion",
    description: "Multi-generational family photoshoot in a park",
    coverImage: "https://source.unsplash.com/random/800x600/?family,park",
    thumbnailImage: "https://source.unsplash.com/random/400x300/?family,park",
    clientName: "The Williams Family",
    clientEmail: "williams@example.com",
    eventDate: Timestamp.fromDate(new Date(2023, 11, 5)),
    expiresAt: Timestamp.fromDate(new Date(2024, 11, 5)),
    password: null,
    isPublic: true,
    isPasswordProtected: false,
    allowDownloads: true,
    allowSharing: true,
    category: "families",
    location: "Central Park, New York",
    featured: false,
    tags: ["family", "park", "reunion"],
    createdAt: Timestamp.now(),
    imageCount: 6
  },
  {
    title: "Corporate Event",
    slug: "corporate-event",
    description: "Annual corporate gala and awards ceremony",
    coverImage: "https://source.unsplash.com/random/800x600/?corporate,event",
    thumbnailImage: "https://source.unsplash.com/random/400x300/?corporate,event",
    clientName: "TechCorp Inc.",
    clientEmail: "events@techcorp.com",
    eventDate: Timestamp.fromDate(new Date(2023, 10, 15)),
    expiresAt: Timestamp.fromDate(new Date(2024, 10, 15)),
    password: "techcorp2023",
    isPublic: false,
    isPasswordProtected: true,
    allowDownloads: false,
    allowSharing: false,
    category: "events",
    location: "Grand Hyatt, San Francisco",
    featured: false,
    tags: ["corporate", "event", "gala"],
    createdAt: Timestamp.now(),
    imageCount: 8
  }
];

// Function to create sample galleries
async function createSampleGalleries() {
  console.log('Creating sample galleries...');
  
  try {
    // Use a batch to create multiple galleries at once
    const batch = writeBatch(db);
    
    // Create a reference to the galleries collection
    const galleriesRef = collection(db, 'galleries');
    
    // Add each gallery to the batch
    for (const gallery of sampleGalleries) {
      const newDocRef = doc(galleriesRef);
      batch.set(newDocRef, gallery);
      console.log(`Added gallery: ${gallery.title}`);
    }
    
    // Commit the batch
    await batch.commit();
    
    console.log('Sample galleries created successfully!');
  } catch (error) {
    console.error('Error creating sample galleries:', error);
  }
}

// Run the initialization
try {
  await createSampleGalleries();
  console.log('Firebase initialization complete!');
} catch (error) {
  console.error('Firebase initialization failed:', error);
}
