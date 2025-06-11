import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { app } from '../src/firebase/config.ts';
import { readFile } from 'fs/promises';

const storage = getStorage(app);
const filePath = 'public/images/backgroundclient.jpg';

try {
  const fileBuffer = await readFile(filePath);
  const storageRef = ref(storage, 'images/' + filePath.split('/').pop());
  const snapshot = await uploadBytes(storageRef, fileBuffer);
  console.log(`Successfully uploaded ${filePath}`);
  console.log('Metadata:', snapshot.metadata);
} catch (error) {
  console.error('Upload failed:', error);
  process.exit(1);
}
