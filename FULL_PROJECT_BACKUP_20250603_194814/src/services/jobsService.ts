import { db, storage } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Job interface
export interface JobDocuments {
  contracts: JobDocument[];
  invoices: JobDocument[];
  questionnaires: JobDocument[];
  quotes: JobDocument[];
  otherDocs: JobDocument[];
  [key: string]: JobDocument[]; // Allow string indexing
}

export interface Job {
  id: string;
  name: string;
  type: string;
  leadSource: string;
  mainShootDate: Timestamp | null;
  mainShootEndDate: Timestamp | null;
  location: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  clientId?: string; // Reference to client if available
  // Additional fields
  documents: JobDocuments;
  [key: string]: any; // For custom fields
}

// Job document interface
export interface JobDocument {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: Timestamp;
  size?: number;
}

/**
 * Get all jobs
 * @returns Array of all jobs
 */
export const getAllJobs = async (): Promise<Job[]> => {
  try {
    // Create reference to jobs collection
    const jobsRef = collection(db, 'jobs');
    
    // Create query with proper ordering
    const q = query(jobsRef, orderBy('createdAt', 'desc'));
    
    // Execute query with error handling
    console.log('Fetching jobs from Firestore...');
    const querySnapshot = await getDocs(q);
    console.log(`Successfully retrieved ${querySnapshot.docs.length} job documents`);

    // Transform Firestore documents to Job objects with data validation
    const jobs = querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Ensure all required fields exist with default values if needed
      const job: Job = {
        id: doc.id,
        name: data.name || `Untitled Job (${doc.id})`,
        type: data.type || 'Other',
        leadSource: data.leadSource || 'Unknown',
        mainShootDate: data.mainShootDate || null,
        mainShootEndDate: data.mainShootEndDate || null,
        location: data.location || '',
        clientName: data.clientName || '',
        clientEmail: data.clientEmail || '',
        clientPhone: data.clientPhone || '',
        notes: data.notes || '',
        status: data.status || 'active',
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || Timestamp.now(),
        clientId: data.clientId || undefined,
        documents: data.documents || {
          contracts: [],
          invoices: [],
          questionnaires: [],
          quotes: [],
          otherDocs: []
        },
        ...data // Include any other fields that might exist
      };
      
      return job;
    });

    console.log(`Successfully processed ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error('Error getting jobs:', error);
    // Add more detailed logging for specific errors
    if (error instanceof Error) {
      console.error(`Error message: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
    }
    
    throw error;
  }
};

/**
 * Get a single job by ID
 * @param jobId The job ID
 * @returns The job data
 */
export const getJob = async (jobId: string): Promise<Job | null> => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    const jobSnap = await getDoc(jobRef);

    if (jobSnap.exists()) {
      const data = jobSnap.data();
      return {
        id: jobSnap.id,
        ...data
      } as Job;
    } else {
      console.log('No such job exists');
      return null;
    }
  } catch (error) {
    console.error('Error getting job:', error);
    throw error;
  }
};

/**
 * Create a new job
 * @param jobData The job data
 * @returns The created job ID
 */
export const createJob = async (jobData: Omit<Job, 'id'>): Promise<string> => {
  try {
    // Set timestamps
    const now = Timestamp.now();
    const data = {
      ...jobData,
      createdAt: now,
      updatedAt: now,
      documents: jobData.documents || {
        contracts: [],
        invoices: [],
        questionnaires: [],
        quotes: [],
        otherDocs: []
      }
    };

    const docRef = await addDoc(collection(db, 'jobs'), data);
    console.log('Job created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

/**
 * Update an existing job
 * @param jobId The job ID to update
 * @param jobData The updated job data
 */
export const updateJob = async (jobId: string, jobData: Partial<Job>): Promise<void> => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    
    // Update the timestamp
    const data = {
      ...jobData,
      updatedAt: Timestamp.now()
    };

    await updateDoc(jobRef, data);
    console.log('Job updated:', jobId);
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

/**
 * Delete a job
 * @param jobId The job ID to delete
 */
export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    
    // Get job data to delete associated files if needed
    const jobSnap = await getDoc(jobRef);
    if (jobSnap.exists()) {
      const jobData = jobSnap.data() as Job;
      
      // Delete associated documents from storage
      const docTypes = ['contracts', 'invoices', 'questionnaires', 'quotes', 'otherDocs'];
      for (const docType of docTypes) {
        const docs = jobData.documents?.[docType] || [];
        for (const document of docs) {
          if (document.fileUrl) {
            try {
              // Extract the path from URL and delete the file
              const fileUrl = new URL(document.fileUrl);
              const filePath = decodeURIComponent(fileUrl.pathname.split('/o/')[1].split('?')[0]);
              const fileRef = ref(storage, filePath);
              await deleteObject(fileRef);
            } catch (fileError) {
              console.error('Error deleting file:', fileError);
            }
          }
        }
      }
    }
    
    // Delete the job document
    await deleteDoc(jobRef);
    console.log('Job deleted:', jobId);
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

/**
 * Upload a document for a job
 * @param jobId The job ID
 * @param file The file to upload
 * @param docType The document type (contracts, invoices, etc.)
 * @returns The uploaded document data
 */
export const uploadJobDocument = async (
  jobId: string, 
  file: File, 
  docType: keyof JobDocuments
): Promise<JobDocument> => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    const jobSnap = await getDoc(jobRef);
    
    if (!jobSnap.exists()) {
      throw new Error('Job not found');
    }
    
    // Generate a unique file name
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `jobs/${jobId}/${docType}/${uniqueFileName}`;
    
    // Upload the file to Firebase Storage
    const storageRef = ref(storage, filePath);
    const uploadResult = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    
    // Create the document object
    const newDocument: JobDocument = {
      id: uuidv4(),
      name: file.name,
      fileUrl: downloadUrl,
      fileType: file.type,
      uploadedAt: Timestamp.now(),
      size: file.size
    };
    
    // Update the job document with the new file reference
    const jobData = jobSnap.data() as Job;
    const documents = jobData.documents || {
      contracts: [], 
      invoices: [],
      questionnaires: [],
      quotes: [],
      otherDocs: []
    };
    
    documents[docType].push(newDocument);
    
    await updateDoc(jobRef, {
      documents,
      updatedAt: Timestamp.now()
    });
    
    return newDocument;
  } catch (error) {
    console.error('Error uploading job document:', error);
    throw error;
  }
};

/**
 * Delete a document from a job
 * @param jobId The job ID
 * @param docId The document ID to delete
 * @param docType The document type
 */
export const deleteJobDocument = async (
  jobId: string,
  docId: string,
  docType: keyof JobDocuments
): Promise<void> => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    const jobSnap = await getDoc(jobRef);
    
    if (!jobSnap.exists()) {
      throw new Error('Job not found');
    }
    
    const jobData = jobSnap.data() as Job;
    const documents = jobData.documents || {
      contracts: [],
      invoices: [],
      questionnaires: [],
      quotes: [],
      otherDocs: []
    };
    
    // Find the document to delete
    const docIndex = documents[docType].findIndex(doc => doc.id === docId);
    if (docIndex === -1) {
      throw new Error('Document not found');
    }
    
    const documentToDelete = documents[docType][docIndex];
    
    // Delete the file from storage
    if (documentToDelete.fileUrl) {
      try {
        // Extract the path from URL and delete the file
        const fileUrl = new URL(documentToDelete.fileUrl);
        const filePath = decodeURIComponent(fileUrl.pathname.split('/o/')[1].split('?')[0]);
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
      }
    }
    
    // Remove the document from the array
    documents[docType].splice(docIndex, 1);
    
    // Update the job with the modified documents array
    await updateDoc(jobRef, {
      documents,
      updatedAt: Timestamp.now()
    });
    
    console.log('Job document deleted:', docId);
  } catch (error) {
    console.error('Error deleting job document:', error);
    throw error;
  }
};

/**
 * Batch import jobs from CSV data
 * @param jobsData Array of job data objects
 * @returns Statistics about the import
 */
export const batchImportJobs = async (jobsData: Omit<Job, 'id'>[]): Promise<{ added: number, updated: number, failed: number }> => {
  const stats = { added: 0, updated: 0, failed: 0 };
  
  try {
    const batch = writeBatch(db);
    
    for (const jobData of jobsData) {
      try {
        // Generate a deterministic ID based on client email and job name for de-duplication
        const idBase = `${jobData.clientEmail || ''}_${jobData.name || ''}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const jobId = idBase || uuidv4();
        const jobRef = doc(db, 'jobs', jobId);
        
        // Add timestamps if not present
        const now = Timestamp.now();
        const data = {
          ...jobData,
          createdAt: jobData.createdAt || now,
          updatedAt: now,
          documents: jobData.documents || {
            contracts: [],
            invoices: [],
            questionnaires: [],
            quotes: [],
            otherDocs: []
          }
        };
        
        // Add to batch
        batch.set(jobRef, data, { merge: true });
        stats.updated++;
      } catch (error) {
        console.error('Error processing job for batch import:', error);
        stats.failed++;
      }
    }
    
    // Commit the batch
    await batch.commit();
    console.log(`Batch import complete. Added/Updated: ${stats.updated}, Failed: ${stats.failed}`);
    return stats;
  } catch (error) {
    console.error('Error in batch import:', error);
    throw error;
  }
};
