import { supabase } from '../lib/supabase';
import storageService from './storageService';

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
  mainShootDate: string | null; // Changed from Timestamp to ISO string
  mainShootEndDate: string | null; // Changed from Timestamp to ISO string
  location: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string; // Changed from Timestamp to ISO string
  updatedAt: string; // Changed from Timestamp to ISO string
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
  uploadedAt: string; // Changed from Timestamp to ISO string
  size?: number;
}

/**
 * Get all jobs
 * @returns Array of all jobs
 */
export const getAllJobs = async (): Promise<Job[]> => {
  try {
    console.log('Fetching jobs from Supabase...');

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log('No jobs found in database');
      return [];
    }

    console.log(`Successfully retrieved ${data.length} job documents`);

    // Transform database rows to Job objects with data validation
    const jobs: Job[] = data.map((row: Record<string, any>) => {
      // Ensure all required fields exist with default values if needed
      const job: Job = {
        id: row.id || '',
        name: row.title || row.name || `Untitled Job (${row.id})`,
        type: row.type || 'Other',
        leadSource: row.lead_source || row.leadSource || 'Unknown',
        mainShootDate: row.date || row.mainShootDate || null,
        mainShootEndDate: row.mainShootEndDate || null,
        location: row.location || '',
        clientName: row.client_name || row.clientName || '',
        clientEmail: row.client_email || row.clientEmail || '',
        clientPhone: row.client_phone || row.clientPhone || '',
        notes: row.notes || '',
        status: row.status || 'active',
        createdAt: row.created_at || new Date().toISOString(),
        updatedAt: row.updated_at || new Date().toISOString(),
        clientId: row.client_id || row.clientId || undefined,
        documents: row.documents || {
          contracts: [],
          invoices: [],
          questionnaires: [],
          quotes: [],
          otherDocs: []
        }
      };

      return job;
    });

    console.log(`Successfully processed ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.error('Error getting jobs:', error);
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
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('No such job exists');
        return null;
      }
      throw error;
    }

    if (!data) return null;

    // Transform to Job interface
    const job: Job = {
      id: data.id,
      name: data.title || data.name || 'Untitled Job',
      type: data.type || 'Other',
      leadSource: data.lead_source || 'Unknown',
      mainShootDate: data.date || null,
      mainShootEndDate: data.mainShootEndDate || null,
      location: data.location || '',
      clientName: data.client_name || '',
      clientEmail: data.client_email || '',
      clientPhone: data.client_phone || '',
      notes: data.notes || '',
      status: data.status || 'active',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      clientId: data.client_id,
      documents: data.documents || {
        contracts: [],
        invoices: [],
        questionnaires: [],
        quotes: [],
        otherDocs: []
      }
    };

    return job;
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
    const now = new Date().toISOString();

    // Transform to database schema
    const dbData = {
      title: jobData.name,
      type: jobData.type,
      date: jobData.mainShootDate,
      location: jobData.location,
      status: jobData.status || 'active',
      client_id: jobData.clientId,
      client_name: jobData.clientName,
      client_email: jobData.clientEmail,
      client_phone: jobData.clientPhone,
      notes: jobData.notes,
      documents: jobData.documents || {
        contracts: [],
        invoices: [],
        questionnaires: [],
        quotes: [],
        otherDocs: []
      },
      lead_source: jobData.leadSource,
      created_at: now,
      updated_at: now
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert([dbData])
      .select('id')
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');

    console.log('Job created with ID:', data.id);
    return data.id;
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
    const now = new Date().toISOString();

    // Transform to database schema
    const dbData: Record<string, any> = {
      updated_at: now
    };

    if (jobData.name !== undefined) dbData.title = jobData.name;
    if (jobData.type !== undefined) dbData.type = jobData.type;
    if (jobData.mainShootDate !== undefined) dbData.date = jobData.mainShootDate;
    if (jobData.location !== undefined) dbData.location = jobData.location;
    if (jobData.status !== undefined) dbData.status = jobData.status;
    if (jobData.clientId !== undefined) dbData.client_id = jobData.clientId;
    if (jobData.clientName !== undefined) dbData.client_name = jobData.clientName;
    if (jobData.clientEmail !== undefined) dbData.client_email = jobData.clientEmail;
    if (jobData.clientPhone !== undefined) dbData.client_phone = jobData.clientPhone;
    if (jobData.notes !== undefined) dbData.notes = jobData.notes;
    if (jobData.documents !== undefined) dbData.documents = jobData.documents;
    if (jobData.leadSource !== undefined) dbData.lead_source = jobData.leadSource;

    const { error } = await supabase
      .from('jobs')
      .update(dbData)
      .eq('id', jobId);

    if (error) throw error;
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
    // Get job data to delete associated files if needed
    const { data: jobData, error: fetchError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (fetchError) throw fetchError;

    if (jobData && jobData.documents) {
      // Delete associated documents from storage
      const docTypes = ['contracts', 'invoices', 'questionnaires', 'quotes', 'otherDocs'];
      for (const docType of docTypes) {
        const docs = jobData.documents[docType] || [];
        for (const document of docs) {
          if (document.fileUrl) {
            try {
              // Delete from Supabase Storage or Cloudinary
              const filePath = `jobs/${jobId}/${docType}/${document.id}`;
              await storageService.deleteFile(filePath);
            } catch (fileError) {
              console.error('Error deleting file:', fileError);
            }
          }
        }
      }
    }

    // Delete the job document
    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (deleteError) throw deleteError;
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
    const { data: jobData, error: fetchError } = await supabase
      .from('jobs')
      .select('documents')
      .eq('id', jobId)
      .single();

    if (fetchError || !jobData) {
      throw new Error('Job not found');
    }

    // Generate a unique file name
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}.${fileExtension}`;
    const filePath = `jobs/${jobId}/${docType}/${uniqueFileName}`;

    // Upload the file to Storage (Supabase Storage or Cloudinary)
    const { url: downloadUrl } = await storageService.uploadFile(filePath, file);

    // Create the document object
    const newDocument: JobDocument = {
      id: `${timestamp}`,
      name: file.name,
      fileUrl: downloadUrl,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
      size: file.size
    };

    // Update the job document with the new file reference
    const documents = jobData.documents || {
      contracts: [],
      invoices: [],
      questionnaires: [],
      quotes: [],
      otherDocs: []
    };

    documents[docType].push(newDocument);

    const { error: updateError } = await supabase
      .from('jobs')
      .update({
        documents,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    if (updateError) throw updateError;

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
    const { data: jobData, error: fetchError } = await supabase
      .from('jobs')
      .select('documents')
      .eq('id', jobId)
      .single();

    if (fetchError || !jobData) {
      throw new Error('Job not found');
    }

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
        const filePath = `jobs/${jobId}/${docType}/${docId}`;
        await storageService.deleteFile(filePath);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
      }
    }

    // Remove the document from the array
    documents[docType].splice(docIndex, 1);

    // Update the job with the modified documents array
    const { error: updateError } = await supabase
      .from('jobs')
      .update({
        documents,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    if (updateError) throw updateError;

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
    const now = new Date().toISOString();

    for (const jobData of jobsData) {
      try {
        // Transform to database schema
        const dbData = {
          title: jobData.name,
          type: jobData.type,
          date: jobData.mainShootDate,
          location: jobData.location,
          status: jobData.status || 'active',
          client_name: jobData.clientName,
          client_email: jobData.clientEmail,
          client_phone: jobData.clientPhone,
          notes: jobData.notes,
          lead_source: jobData.leadSource,
          documents: jobData.documents || {
            contracts: [],
            invoices: [],
            questionnaires: [],
            quotes: [],
            otherDocs: []
          },
          created_at: jobData.createdAt || now,
          updated_at: now
        };

        // Upsert using client_email + name as unique key
        const { error } = await supabase
          .from('jobs')
          .upsert(dbData, {
            onConflict: 'client_email,title',
            ignoreDuplicates: false
          });

        if (error) {
          console.error('Error in batch import item:', error);
          stats.failed++;
        } else {
          stats.updated++;
        }
      } catch (error) {
        console.error('Error processing job for batch import:', error);
        stats.failed++;
      }
    }

    console.log(`Batch import complete. Added/Updated: ${stats.updated}, Failed: ${stats.failed}`);
    return stats;
  } catch (error) {
    console.error('Error in batch import:', error);
    throw error;
  }
};
