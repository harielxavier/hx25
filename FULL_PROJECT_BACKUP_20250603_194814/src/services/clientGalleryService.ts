import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  orderBy,
  Timestamp,
  serverTimestamp,
  increment,
  writeBatch,
  arrayUnion,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { GalleryMedia } from './galleryService';
import storageService from '../firebase/storageService';
import { sendEmail } from '../services/emailService';

// Client interface
export interface Client {
  id: string;
  email: string;
  name: string;
  phone?: string;
  galleries: string[]; // IDs of galleries the client has access to
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Client Selection interface
export interface ClientSelection {
  id: string;
  clientId: string;
  galleryId: string;
  mediaId: string;
  selected: boolean;
  comment?: string;
  selectionDate: Timestamp;
}

// Gallery Access interface
export interface GalleryAccess {
  id: string;
  galleryId: string;
  clientId: string;
  accessType: 'view' | 'select' | 'download';
  expiryDate: Timestamp | null;
  selectionDeadline: Timestamp | null;
  maxSelections: number | null;
  selectionCount: number;
  lastAccessed: Timestamp | null;
  accessCode?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Selection Package interface
export interface SelectionPackage {
  id: string;
  galleryId: string;
  clientId: string;
  name: string;
  status: 'draft' | 'submitted' | 'approved' | 'delivered';
  selectionIds: string[];
  submittedAt: Timestamp | null;
  approvedAt: Timestamp | null;
  deliveredAt: Timestamp | null;
  comments?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Create a new client
 * @param clientData - Client data
 * @returns Client ID
 */
export const createClient = async (clientData: Partial<Client>): Promise<string> => {
  try {
    // Check if client with this email already exists
    const existingClient = await getClientByEmail(clientData.email || '');
    
    if (existingClient) {
      return existingClient.id; // Return existing client ID
    }
    
    const clientRef = collection(db, 'clients');
    const newClient = {
      email: clientData.email || '',
      name: clientData.name || '',
      phone: clientData.phone || '',
      galleries: clientData.galleries || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(clientRef, newClient);
    return docRef.id;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

/**
 * Get a client by ID
 * @param clientId - Client ID
 * @returns Client object or null
 */
export const getClient = async (clientId: string): Promise<Client | null> => {
  try {
    const clientRef = doc(db, 'clients', clientId);
    const clientSnap = await getDoc(clientRef);
    
    if (clientSnap.exists()) {
      return {
        id: clientSnap.id,
        ...clientSnap.data()
      } as Client;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting client:', error);
    throw error;
  }
};

/**
 * Get a client by email
 * @param email - Client email
 * @returns Client object or null
 */
export const getClientByEmail = async (email: string): Promise<Client | null> => {
  try {
    if (!email) return null;
    
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const clientDoc = querySnapshot.docs[0];
      return {
        id: clientDoc.id,
        ...clientDoc.data()
      } as Client;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting client by email:', error);
    throw error;
  }
};

/**
 * Update a client
 * @param clientId - Client ID
 * @param clientData - Client data to update
 */
export const updateClient = async (
  clientId: string, 
  clientData: Partial<Client>
): Promise<void> => {
  try {
    const clientRef = doc(db, 'clients', clientId);
    
    await updateDoc(clientRef, {
      ...clientData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

/**
 * Delete a client
 * @param clientId - Client ID
 */
export const deleteClient = async (clientId: string): Promise<void> => {
  try {
    // Delete client document
    const clientRef = doc(db, 'clients', clientId);
    await deleteDoc(clientRef);
    
    // Delete client selections
    const selectionsRef = collection(db, 'clients', clientId, 'selections');
    const selectionsSnapshot = await getDocs(selectionsRef);
    
    const batch = writeBatch(db);
    selectionsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Delete gallery access
    const accessRef = collection(db, 'galleryAccess');
    const accessQuery = query(accessRef, where('clientId', '==', clientId));
    const accessSnapshot = await getDocs(accessQuery);
    
    accessSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

/**
 * Grant gallery access to a client
 * @param galleryId - Gallery ID
 * @param clientId - Client ID
 * @param accessData - Access settings
 * @returns Access ID
 */
export const grantGalleryAccess = async (
  galleryId: string,
  clientId: string,
  accessData: Partial<GalleryAccess>
): Promise<string> => {
  try {
    // Check if access already exists
    const existingAccess = await getGalleryAccess(galleryId, clientId);
    
    if (existingAccess) {
      // Update existing access
      const accessRef = doc(db, 'galleryAccess', existingAccess.id);
      await updateDoc(accessRef, {
        ...accessData,
        updatedAt: serverTimestamp()
      });
      
      return existingAccess.id;
    }
    
    // Create new access
    const accessRef = collection(db, 'galleryAccess');
    const newAccess = {
      galleryId,
      clientId,
      accessType: accessData.accessType || 'view',
      expiryDate: accessData.expiryDate || null,
      selectionDeadline: accessData.selectionDeadline || null,
      maxSelections: accessData.maxSelections || null,
      selectionCount: 0,
      lastAccessed: null,
      accessCode: generateAccessCode(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(accessRef, newAccess);
    
    // Add gallery to client's galleries array
    const clientRef = doc(db, 'clients', clientId);
    await updateDoc(clientRef, {
      galleries: arrayUnion(galleryId),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error granting gallery access:', error);
    throw error;
  }
};

/**
 * Get gallery access for a client
 * @param galleryId - Gallery ID
 * @param clientId - Client ID
 * @returns Gallery access or null
 */
export const getGalleryAccess = async (
  galleryId: string,
  clientId: string
): Promise<GalleryAccess | null> => {
  try {
    const accessRef = collection(db, 'galleryAccess');
    const q = query(
      accessRef, 
      where('galleryId', '==', galleryId),
      where('clientId', '==', clientId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const accessDoc = querySnapshot.docs[0];
      return {
        id: accessDoc.id,
        ...accessDoc.data()
      } as GalleryAccess;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting gallery access:', error);
    throw error;
  }
};

/**
 * Revoke gallery access from a client
 * @param galleryId - Gallery ID
 * @param clientId - Client ID
 */
export const revokeGalleryAccess = async (
  galleryId: string,
  clientId: string
): Promise<void> => {
  try {
    const access = await getGalleryAccess(galleryId, clientId);
    
    if (access) {
      // Delete access document
      const accessRef = doc(db, 'galleryAccess', access.id);
      await deleteDoc(accessRef);
      
      // Remove gallery from client's galleries array
      const clientRef = doc(db, 'clients', clientId);
      const clientSnap = await getDoc(clientRef);
      
      if (clientSnap.exists()) {
        const clientData = clientSnap.data();
        const galleries = clientData.galleries || [];
        const updatedGalleries = galleries.filter((id: string) => id !== galleryId);
        
        await updateDoc(clientRef, {
          galleries: updatedGalleries,
          updatedAt: serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.error('Error revoking gallery access:', error);
    throw error;
  }
};

/**
 * Get all clients with access to a gallery
 * @param galleryId - Gallery ID
 * @returns Array of clients with access
 */
export const getGalleryClients = async (galleryId: string): Promise<Client[]> => {
  try {
    const accessRef = collection(db, 'galleryAccess');
    const q = query(accessRef, where('galleryId', '==', galleryId));
    const querySnapshot = await getDocs(q);
    
    const clients: Client[] = [];
    
    for (const accessDoc of querySnapshot.docs) {
      const accessData = accessDoc.data();
      const clientId = accessData.clientId;
      
      const client = await getClient(clientId);
      if (client) {
        clients.push(client);
      }
    }
    
    return clients;
  } catch (error) {
    console.error('Error getting gallery clients:', error);
    throw error;
  }
};

/**
 * Toggle client selection of a media item
 * @param clientId - Client ID
 * @param galleryId - Gallery ID
 * @param mediaId - Media ID
 * @param selected - Whether the item is selected
 * @param comment - Optional comment
 */
export const toggleClientSelection = async (
  clientId: string,
  galleryId: string,
  mediaId: string,
  selected: boolean,
  comment: string = ''
): Promise<void> => {
  try {
    // Get gallery access to check permissions
    const access = await getGalleryAccess(galleryId, clientId);
    
    if (!access || access.accessType === 'view') {
      throw new Error('Client does not have selection permission for this gallery');
    }
    
    // Check if selection deadline has passed
    if (access.selectionDeadline && access.selectionDeadline.toMillis() < Date.now()) {
      throw new Error('Selection deadline has passed');
    }
    
    // Check if max selections reached
    if (selected && access.maxSelections && access.selectionCount >= access.maxSelections) {
      throw new Error(`Maximum selections (${access.maxSelections}) reached`);
    }
    
    // Get existing selection
    const selectionRef = doc(db, 'clients', clientId, 'selections', mediaId);
    const selectionSnap = await getDoc(selectionRef);
    
    if (selected) {
      // Create or update selection
      await setDoc(selectionRef, {
        clientId,
        galleryId,
        mediaId,
        selected: true,
        comment: comment || '',
        selectionDate: serverTimestamp()
      });
      
      // Update selection count if this is a new selection
      if (!selectionSnap.exists()) {
        const accessRef = doc(db, 'galleryAccess', access.id);
        await updateDoc(accessRef, {
          selectionCount: increment(1),
          updatedAt: serverTimestamp()
        });
      }
    } else if (selectionSnap.exists()) {
      // Delete selection
      await deleteDoc(selectionRef);
      
      // Update selection count
      const accessRef = doc(db, 'galleryAccess', access.id);
      await updateDoc(accessRef, {
        selectionCount: increment(-1),
        updatedAt: serverTimestamp()
      });
    }
    
    // Update the media item in the gallery to reflect selection
    const mediaRef = doc(db, 'galleries', galleryId, 'media', mediaId);
    await updateDoc(mediaRef, {
      clientSelected: selected,
      clientComment: comment || '',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling client selection:', error);
    throw error;
  }
};

/**
 * Get client selections for a gallery
 * @param clientId - Client ID
 * @param galleryId - Gallery ID
 * @returns Array of selected media items
 */
export const getClientSelections = async (
  clientId: string,
  galleryId: string
): Promise<GalleryMedia[]> => {
  try {
    // Get selections from client's selections subcollection
    const selectionsRef = collection(db, 'clients', clientId, 'selections');
    const q = query(
      selectionsRef, 
      where('galleryId', '==', galleryId),
      where('selected', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Get the actual media items from the gallery
    const mediaItems: GalleryMedia[] = [];
    
    for (const selectionDoc of querySnapshot.docs) {
      const selectionData = selectionDoc.data();
      const mediaId = selectionData.mediaId;
      
      const mediaRef = doc(db, 'galleries', galleryId, 'media', mediaId);
      const mediaSnap = await getDoc(mediaRef);
      
      if (mediaSnap.exists()) {
        mediaItems.push({
          id: mediaSnap.id,
          ...mediaSnap.data(),
          clientComment: selectionData.comment || ''
        } as GalleryMedia);
      }
    }
    
    return mediaItems;
  } catch (error) {
    console.error('Error getting client selections:', error);
    throw error;
  }
};

/**
 * Create a selection package
 * @param galleryId - Gallery ID
 * @param clientId - Client ID
 * @param packageData - Package data
 * @returns Package ID
 */
export const createSelectionPackage = async (
  galleryId: string,
  clientId: string,
  packageData: Partial<SelectionPackage>
): Promise<string> => {
  try {
    // Get client selections
    const selections = await getClientSelections(clientId, galleryId);
    
    if (selections.length === 0) {
      throw new Error('No selections found for this client and gallery');
    }
    
    const packageRef = collection(db, 'selectionPackages');
    const newPackage = {
      galleryId,
      clientId,
      name: packageData.name || 'Selection Package',
      status: 'draft',
      selectionIds: selections.map(item => item.id),
      submittedAt: null,
      approvedAt: null,
      deliveredAt: null,
      comments: packageData.comments || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(packageRef, newPackage);
    return docRef.id;
  } catch (error) {
    console.error('Error creating selection package:', error);
    throw error;
  }
};

/**
 * Get selection packages for a client and gallery
 * @param clientId - Client ID
 * @param galleryId - Gallery ID
 * @returns Array of selection packages
 */
export const getSelectionPackages = async (
  clientId: string,
  galleryId: string
): Promise<SelectionPackage[]> => {
  try {
    const packagesRef = collection(db, 'selectionPackages');
    const q = query(
      packagesRef, 
      where('clientId', '==', clientId),
      where('galleryId', '==', galleryId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SelectionPackage));
  } catch (error) {
    console.error('Error getting selection packages:', error);
    throw error;
  }
};

/**
 * Update selection package status
 * @param packageId - Package ID
 * @param status - New status
 * @param comments - Optional comments
 */
export const updatePackageStatus = async (
  packageId: string,
  status: SelectionPackage['status'],
  comments?: string
): Promise<void> => {
  try {
    const packageRef = doc(db, 'selectionPackages', packageId);
    
    const updates: any = {
      status,
      updatedAt: serverTimestamp()
    };
    
    if (comments) {
      updates.comments = comments;
    }
    
    // Set timestamp based on status
    if (status === 'submitted') {
      updates.submittedAt = serverTimestamp();
    } else if (status === 'approved') {
      updates.approvedAt = serverTimestamp();
    } else if (status === 'delivered') {
      updates.deliveredAt = serverTimestamp();
    }
    
    await updateDoc(packageRef, updates);
    
    // Notify client if approved or delivered
    if (status === 'approved' || status === 'delivered') {
      const packageSnap = await getDoc(packageRef);
      
      if (packageSnap.exists()) {
        const packageData = packageSnap.data() as SelectionPackage;
        const client = await getClient(packageData.clientId);
        
        if (client && client.email) {
          await sendSelectionNotification(
            client.email,
            client.name,
            packageData.galleryId,
            status
          );
        }
      }
    }
  } catch (error) {
    console.error('Error updating package status:', error);
    throw error;
  }
};

/**
 * Generate download links for a selection package
 * @param packageId - Package ID
 * @param expirationHours - Hours until links expire
 * @returns Array of download links
 */
export const generatePackageDownloadLinks = async (
  packageId: string,
  expirationHours: number = 48
): Promise<{ imageId: string, url: string, expires: Date }[]> => {
  try {
    const packageRef = doc(db, 'selectionPackages', packageId);
    const packageSnap = await getDoc(packageRef);
    
    if (!packageSnap.exists()) {
      throw new Error('Selection package not found');
    }
    
    const packageData = packageSnap.data() as SelectionPackage;
    
    if (packageData.status !== 'approved' && packageData.status !== 'delivered') {
      throw new Error('Package must be approved before generating download links');
    }
    
    const downloadLinks = [];
    
    for (const imageId of packageData.selectionIds) {
      const mediaRef = doc(db, 'galleries', packageData.galleryId, 'media', imageId);
      const mediaSnap = await getDoc(mediaRef);
      
      if (mediaSnap.exists()) {
        const mediaData = mediaSnap.data() as GalleryMedia;
        
        // Generate a signed URL for the original image
        const downloadUrl = await storageService.generateSignedUrl(
          mediaData.url,
          expirationHours
        );
        
        downloadLinks.push({
          imageId,
          url: downloadUrl,
          expires: new Date(Date.now() + expirationHours * 60 * 60 * 1000)
        });
        
        // Track the download
        await trackMediaDownload(packageData.galleryId, imageId);
      }
    }
    
    // Update package status to delivered
    await updatePackageStatus(packageId, 'delivered');
    
    return downloadLinks;
  } catch (error) {
    console.error('Error generating package download links:', error);
    throw error;
  }
};

/**
 * Track when a media item is downloaded
 * @param galleryId - Gallery ID
 * @param mediaId - Media ID
 */
export const trackMediaDownload = async (
  galleryId: string,
  mediaId: string
): Promise<void> => {
  try {
    const mediaRef = doc(db, 'galleries', galleryId, 'media', mediaId);
    
    await updateDoc(mediaRef, {
      downloadCount: increment(1),
      lastDownloaded: serverTimestamp()
    });
  } catch (error) {
    console.error('Error tracking media download:', error);
    throw error;
  }
};

/**
 * Send notification email about selection status
 * @param email - Recipient email
 * @param name - Recipient name
 * @param galleryId - Gallery ID
 * @param status - Selection status
 */
export const sendSelectionNotification = async (
  email: string,
  name: string,
  galleryId: string,
  status: 'approved' | 'delivered'
): Promise<void> => {
  try {
    // Get gallery details
    const galleryRef = doc(db, 'galleries', galleryId);
    const gallerySnap = await getDoc(galleryRef);
    
    if (!gallerySnap.exists()) {
      throw new Error('Gallery not found');
    }
    
    const galleryData = gallerySnap.data();
    
    // Prepare email content
    const subject = status === 'approved' 
      ? `Your selections for ${galleryData.title} have been approved!`
      : `Your photos from ${galleryData.title} are ready for download!`;
    
    const message = status === 'approved'
      ? `Hi ${name},\n\nYour selections for the gallery "${galleryData.title}" have been approved. You'll receive another email when your photos are ready for download.\n\nThank you!`
      : `Hi ${name},\n\nYour photos from the gallery "${galleryData.title}" are now ready for download. Please log in to your client area to access them.\n\nThank you!`;
    
    // Send email
    await sendEmail(email, subject, message);
  } catch (error) {
    console.error('Error sending selection notification:', error);
    throw error;
  }
};

/**
 * Generate a random access code for gallery access
 * @returns Random 6-character code
 */
const generateAccessCode = (): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  
  return code;
};

/**
 * Verify gallery access code
 * @param galleryId - Gallery ID
 * @param accessCode - Access code to verify
 * @returns Client ID if valid, null otherwise
 */
export const verifyGalleryAccessCode = async (
  galleryId: string,
  accessCode: string
): Promise<string | null> => {
  try {
    const accessRef = collection(db, 'galleryAccess');
    const q = query(
      accessRef, 
      where('galleryId', '==', galleryId),
      where('accessCode', '==', accessCode)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const accessDoc = querySnapshot.docs[0];
      const accessData = accessDoc.data() as GalleryAccess;
      
      // Check if access has expired
      if (accessData.expiryDate && accessData.expiryDate.toMillis() < Date.now()) {
        return null;
      }
      
      // Update last accessed timestamp
      await updateDoc(accessDoc.ref, {
        lastAccessed: serverTimestamp()
      });
      
      return accessData.clientId;
    }
    
    return null;
  } catch (error) {
    console.error('Error verifying gallery access code:', error);
    throw error;
  }
};

/**
 * Get all clients
 * @returns Array of all clients
 */
export const getAllClients = async (): Promise<Client[]> => {
  try {
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const clients = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      } as Client;
    });
    
    console.log(`Found ${clients.length} clients`);
    return clients;
  } catch (error) {
    console.error('Error getting clients:', error);
    throw error;
  }
};

/**
 * Submit client selections for a gallery
 * @param clientId - Client ID
 * @param galleryId - Gallery ID
 * @param selections - Array of selected media IDs
 * @param comment - Optional comment
 */
export const submitClientSelections = async (
  clientId: string,
  galleryId: string,
  selections: string[],
  comment: string = ''
): Promise<void> => {
  try {
    // Get gallery access to check if selection is allowed
    const accessData = await getGalleryAccess(galleryId, clientId);
    
    if (!accessData) {
      throw new Error('Client does not have access to this gallery');
    }
    
    if (accessData.accessType !== 'select') {
      throw new Error('Client does not have selection permissions for this gallery');
    }
    
    // Check if selection deadline has passed
    if (accessData.selectionDeadline && accessData.selectionDeadline.toMillis() < Date.now()) {
      throw new Error('Selection deadline has passed');
    }
    
    // Check if max selections is exceeded
    if (accessData.maxSelections && selections.length > accessData.maxSelections) {
      throw new Error(`Maximum number of selections (${accessData.maxSelections}) exceeded`);
    }
    
    // Get current selections to compare
    await getClientSelections(clientId, galleryId);
    
    // Create a batch to handle multiple operations
    const batch = writeBatch(db);
    
    // Clear previous selections
    const selectionsRef = collection(db, 'clientSelections');
    const q = query(
      selectionsRef,
      where('clientId', '==', clientId),
      where('galleryId', '==', galleryId)
    );
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Add new selections
    for (const mediaId of selections) {
      const newSelection = {
        clientId,
        galleryId,
        mediaId,
        selected: true,
        comment,
        selectionDate: serverTimestamp()
      };
      
      const newSelectionRef = doc(collection(db, 'clientSelections'));
      batch.set(newSelectionRef, newSelection);
    }
    
    // Update selection count in gallery access
    const accessRef = doc(db, 'galleryAccess', accessData.id);
    batch.update(accessRef, {
      selectionCount: selections.length,
      updatedAt: serverTimestamp()
    });
    
    // Commit the batch
    await batch.commit();
    
    // Notify photographer about the selections
    await notifyPhotographerAboutSelections(clientId, galleryId, selections.length, comment);
    
  } catch (error) {
    console.error('Error submitting client selections:', error);
    throw error;
  }
};

/**
 * Check if selection deadline has passed for a gallery
 * @param gallery - Gallery object with selectionDeadline property
 * @returns Boolean indicating if deadline has passed
 */
export const hasSelectionDeadlinePassed = (gallery: { selectionDeadline: any }): boolean => {
  if (!gallery.selectionDeadline) return false;
  
  // Convert to Date if it's a Timestamp
  const deadline = gallery.selectionDeadline instanceof Timestamp 
    ? gallery.selectionDeadline.toDate() 
    : new Date(gallery.selectionDeadline);
  
  return deadline.getTime() < Date.now();
};

/**
 * Notify photographer about client selections
 * @param clientId - Client ID
 * @param galleryId - Gallery ID
 * @param selectionCount - Number of selections
 * @param comment - Client comment
 */
const notifyPhotographerAboutSelections = async (
  clientId: string,
  galleryId: string,
  selectionCount: number,
  comment: string
): Promise<void> => {
  try {
    // Get client and gallery details
    const client = await getClient(clientId);
    
    if (!client) {
      throw new Error('Client not found');
    }
    
    const galleryRef = doc(db, 'galleries', galleryId);
    const gallerySnap = await getDoc(galleryRef);
    
    if (!gallerySnap.exists()) {
      throw new Error('Gallery not found');
    }
    
    const galleryData = gallerySnap.data();
    
    // Create notification in database
    await addDoc(collection(db, 'notifications'), {
      type: 'selection',
      clientId,
      clientName: client.name,
      clientEmail: client.email,
      galleryId,
      galleryName: galleryData.title,
      selectionCount,
      comment,
      read: false,
      createdAt: serverTimestamp()
    });
    
    // Send email notification to photographer
    // This assumes you have a settings collection with photographer email
    const settingsRef = doc(db, 'settings', 'general');
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      const settings = settingsSnap.data();
      const photographerEmail = settings.email;
      
      if (photographerEmail) {
        const subject = `New Selections: ${client.name} has selected ${selectionCount} photos`;
        const message = `
          Client: ${client.name} (${client.email})
          Gallery: ${galleryData.title}
          Selections: ${selectionCount}
          
          ${comment ? `Client message: ${comment}` : 'No comment provided.'}
          
          You can view these selections in your admin dashboard.
        `;
        
        await sendEmail(photographerEmail, subject, message);
      }
    }
  } catch (error) {
    console.error('Error notifying about selections:', error);
    // Don't throw here, as this is a secondary operation
  }
};

/**
 * Get client galleries
 * @param clientId - Client ID
 * @returns Array of galleries the client has access to
 */
export const getClientGalleries = async (clientId: string): Promise<any[]> => {
  try {
    // Get gallery access records for this client
    const accessRef = collection(db, 'galleryAccess');
    const q = query(accessRef, where('clientId', '==', clientId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return [];
    }
    
    // Get gallery details for each access record
    const galleries = [];
    
    for (const accessDoc of querySnapshot.docs) {
      const accessData = accessDoc.data() as GalleryAccess;
      
      // Skip expired access
      if (accessData.expiryDate && accessData.expiryDate.toMillis() < Date.now()) {
        continue;
      }
      
      const galleryRef = doc(db, 'galleries', accessData.galleryId);
      const gallerySnap = await getDoc(galleryRef);
      
      if (gallerySnap.exists()) {
        const galleryData = gallerySnap.data();
        
        // Get image count
        const imagesRef = collection(db, 'galleries', accessData.galleryId, 'images');
        const imagesSnapshot = await getDocs(imagesRef);
        
        // Determine gallery status
        let status: 'active' | 'expired' | 'completed' = 'active';
        
        if (accessData.expiryDate && accessData.expiryDate.toMillis() < Date.now()) {
          status = 'expired';
        } else if (accessData.selectionDeadline && 
                  accessData.maxSelections && 
                  accessData.selectionCount >= accessData.maxSelections) {
          status = 'completed';
        }
        
        galleries.push({
          id: gallerySnap.id,
          name: galleryData.title,
          description: galleryData.description,
          coverImage: galleryData.coverImage,
          date: galleryData.eventDate || galleryData.createdAt,
          expiresAt: accessData.expiryDate,
          imageCount: imagesSnapshot.size,
          selectionCount: accessData.selectionCount || 0,
          selectionRequired: accessData.maxSelections || 0,
          selectionDeadline: accessData.selectionDeadline,
          status,
          slug: galleryData.slug || gallerySnap.id
        });
      }
    }
    
    // Sort by date (newest first)
    galleries.sort((a, b) => {
      const dateA = a.date ? a.date.toMillis() : 0;
      const dateB = b.date ? b.date.toMillis() : 0;
      return dateB - dateA;
    });
    
    return galleries;
  } catch (error) {
    console.error('Error getting client galleries:', error);
    throw error;
  }
};

export default {
  createClient,
  getClient,
  getClientByEmail,
  updateClient,
  deleteClient,
  grantGalleryAccess,
  getGalleryAccess,
  revokeGalleryAccess,
  getGalleryClients,
  toggleClientSelection,
  getClientSelections,
  createSelectionPackage,
  getSelectionPackages,
  updatePackageStatus,
  generatePackageDownloadLinks,
  trackMediaDownload,
  sendSelectionNotification,
  verifyGalleryAccessCode,
  getAllClients,
  generateAccessCode,
  submitClientSelections,
  hasSelectionDeadlinePassed,
  getClientGalleries
};
