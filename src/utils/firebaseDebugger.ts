import { db, storage } from '../firebase/config';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

/**
 * Utility to diagnose and fix common Firebase issues
 */
export const diagnoseFirebaseIssues = async () => {
  const issues = [];
  const fixes = [];
  
  // Test 1: Check if we can access Firestore
  try {
    const testCollection = collection(db, 'test_connection');
    await getDocs(testCollection);
    console.log('✅ Firestore connection successful');
  } catch (error: any) {
    console.error('❌ Firestore connection error:', error);
    issues.push({
      type: 'firestore_connection',
      message: `Firestore connection error: ${error.message}`,
      code: error.code
    });
    
    if (error.code === 'failed-precondition') {
      fixes.push({
        type: 'firestore_indexes',
        message: 'You need to deploy Firestore indexes. Run: firebase deploy --only firestore:indexes'
      });
    }
  }
  
  // Test 2: Check if we can access Storage
  try {
    const testRef = ref(storage, 'test.txt');
    try {
      await getDownloadURL(testRef);
      console.log('✅ Storage connection successful');
    } catch (storageError: any) {
      // 404 is expected if the file doesn't exist, but means connection works
      if (storageError.code === 'storage/object-not-found') {
        console.log('✅ Storage connection successful (file not found, but connection works)');
      } else {
        throw storageError;
      }
    }
  } catch (error: any) {
    console.error('❌ Storage connection error:', error);
    issues.push({
      type: 'storage_connection',
      message: `Storage connection error: ${error.message}`,
      code: error.code
    });
  }
  
  // Test 3: Check if galleries collection exists and has documents
  try {
    const galleriesCollection = collection(db, 'galleries');
    const galleries = await getDocs(galleriesCollection);
    
    if (galleries.empty) {
      console.log('⚠️ Galleries collection exists but is empty');
      issues.push({
        type: 'empty_galleries',
        message: 'The galleries collection exists but has no documents'
      });
      fixes.push({
        type: 'create_sample_galleries',
        message: 'Create sample galleries to populate the database'
      });
    } else {
      console.log(`✅ Galleries collection exists with ${galleries.size} documents`);
    }
  } catch (error: any) {
    console.error('❌ Error checking galleries collection:', error);
    issues.push({
      type: 'galleries_access',
      message: `Error accessing galleries collection: ${error.message}`,
      code: error.code
    });
  }
  
  return {
    issues,
    fixes,
    timestamp: new Date().toISOString()
  };
};

/**
 * Create a simple test gallery to verify Firestore write access
 */
export const createTestGallery = async () => {
  try {
    const testGallery = {
      title: "Test Gallery",
      slug: "test-gallery",
      description: "This is a test gallery to verify Firestore write access.",
      coverImage: "https://via.placeholder.com/800x600",
      thumbnailImage: "https://via.placeholder.com/400x300",
      clientName: "Test Client",
      clientEmail: "test@example.com",
      eventDate: Timestamp.fromDate(new Date()),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
      password: null,
      isPublic: true,
      isPasswordProtected: false,
      allowDownloads: true,
      allowSharing: true,
      category: "test",
      location: "Test Location",
      featured: true,
      tags: ["test"],
      createdAt: Timestamp.now(),
      imageCount: 0
    };
    
    const docRef = await addDoc(collection(db, 'galleries'), testGallery);
    console.log('✅ Test gallery created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating test gallery:', error);
    throw error;
  }
};
