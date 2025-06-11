import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import fetch from 'node-fetch';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALvXeGHAvlkpkA-WxKUi1LTvtE_o3UL-c",
  authDomain: "harielxavierphotography-18d17.firebaseapp.com",
  projectId: "harielxavierphotography-18d17",
  storageBucket: "harielxavierphotography-18d17.firebasestorage.app",
  messagingSenderId: "1068433512969",
  appId: "1:1068433512969:web:c4b4a0d7b2a5f2d1d9d5f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Verify slider images in Firebase Storage
 */
async function verifySliderImages() {
  try {
    console.log('Verifying slider images in Firebase Storage...');
    
    // Get left image URL
    const leftImageRef = ref(storage, 'sliders/slider1/slider1left.jpg');
    const leftImageUrl = await getDownloadURL(leftImageRef);
    console.log('Left image URL:', leftImageUrl);
    
    // Verify left image is accessible
    const leftResponse = await fetch(leftImageUrl);
    console.log('Left image status:', leftResponse.status, leftResponse.statusText);
    
    // Get right image URL
    const rightImageRef = ref(storage, 'sliders/slider1/slider1right.jpg');
    const rightImageUrl = await getDownloadURL(rightImageRef);
    console.log('Right image URL:', rightImageUrl);
    
    // Verify right image is accessible
    const rightResponse = await fetch(rightImageUrl);
    console.log('Right image status:', rightResponse.status, rightResponse.statusText);
    
    console.log('Verification complete!');
  } catch (error) {
    console.error('Error verifying slider images:', error);
  }
}

// Run the verification
verifySliderImages();
