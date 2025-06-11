import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';

// Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  template_type: 'welcome' | 'reminder' | 'follow_up' | 'promotional' | 'custom';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface EmailSequence {
  id: string;
  name: string;
  description?: string;
  trigger_event: string;
  is_active: boolean;
  steps?: EmailSequenceStep[];
  created_at: Date;
  updated_at: Date;
}

export interface EmailSequenceStep {
  id: string;
  sequence_id: string;
  step_order: number;
  delay_days: number;
  template_id: string;
  is_active: boolean;
  created_at: Date;
}

export interface EmailLog {
  id: string;
  recipient_email: string;
  template_id?: string;
  sequence_id?: string;
  subject: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sent_at: Date;
  opened_at?: Date;
  clicked_at?: Date;
  error_message?: string;
  created_at: Date;
}

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  try {
    const q = query(
      collection(db, 'email_templates'),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate(),
      updated_at: doc.data().updated_at?.toDate()
    })) as EmailTemplate[];
  } catch (error) {
    console.error('Error fetching email templates:', error);
    throw error;
  }
}

export async function createEmailTemplate(template: Partial<EmailTemplate>): Promise<EmailTemplate> {
  try {
    const docRef = await addDoc(collection(db, 'email_templates'), {
      ...template,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    
    const newTemplate = {
      id: docRef.id,
      ...template,
      created_at: new Date(),
      updated_at: new Date()
    } as EmailTemplate;
    
    return newTemplate;
  } catch (error) {
    console.error('Error creating email template:', error);
    throw error;
  }
}

export async function updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> {
  try {
    const docRef = doc(db, 'email_templates', id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: Timestamp.now()
    });
    
    const updatedTemplate = {
      id,
      ...updates,
      updated_at: new Date()
    } as EmailTemplate;
    
    return updatedTemplate;
  } catch (error) {
    console.error('Error updating email template:', error);
    throw error;
  }
}

export async function getEmailSequences(): Promise<EmailSequence[]> {
  try {
    const q = query(
      collection(db, 'email_sequences'),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate(),
      updated_at: doc.data().updated_at?.toDate()
    })) as EmailSequence[];
  } catch (error) {
    console.error('Error fetching email sequences:', error);
    throw error;
  }
}

export async function createEmailSequence(sequence: Partial<EmailSequence>): Promise<EmailSequence> {
  try {
    const docRef = await addDoc(collection(db, 'email_sequences'), {
      ...sequence,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    
    // Create sequence steps if provided
    if (sequence.steps?.length) {
      const stepPromises = sequence.steps.map(step => 
        addDoc(collection(db, 'sequence_steps'), {
          ...step,
          sequence_id: docRef.id,
          created_at: Timestamp.now()
        })
      );
      await Promise.all(stepPromises);
    }
    
    const newSequence = {
      id: docRef.id,
      ...sequence,
      created_at: new Date(),
      updated_at: new Date()
    } as EmailSequence;
    
    return newSequence;
  } catch (error) {
    console.error('Error creating email sequence:', error);
    throw error;
  }
}

export async function getEmailLogs(
  recipientEmail?: string,
  templateId?: string,
  status?: string,
  limit_count?: number
): Promise<EmailLog[]> {
  try {
    let q = query(collection(db, 'email_logs'));
    
    if (recipientEmail) {
      q = query(q, where('recipient_email', '==', recipientEmail));
    }
    if (templateId) {
      q = query(q, where('template_id', '==', templateId));
    }
    if (status) {
      q = query(q, where('status', '==', status));
    }
    
    q = query(q, orderBy('sent_at', 'desc'));
    
    if (limit_count) {
      q = query(q, limit(limit_count));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      sent_at: doc.data().sent_at?.toDate(),
      opened_at: doc.data().opened_at?.toDate(),
      clicked_at: doc.data().clicked_at?.toDate(),
      created_at: doc.data().created_at?.toDate()
    })) as EmailLog[];
  } catch (error) {
    console.error('Error fetching email logs:', error);
    throw error;
  }
}

export async function trackEmailOpen(emailId: string): Promise<void> {
  try {
    const docRef = doc(db, 'email_logs', emailId);
    await updateDoc(docRef, {
      status: 'opened',
      opened_at: Timestamp.now()
    });
  } catch (error) {
    console.error('Error tracking email open:', error);
    throw error;
  }
}

export async function trackEmailClick(emailId: string): Promise<void> {
  try {
    const docRef = doc(db, 'email_logs', emailId);
    await updateDoc(docRef, {
      status: 'clicked',
      clicked_at: Timestamp.now()
    });
  } catch (error) {
    console.error('Error tracking email click:', error);
    throw error;
  }
}

export async function logEmailSent(
  recipientEmail: string,
  subject: string,
  templateId?: string,
  sequenceId?: string
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'email_logs'), {
      recipient_email: recipientEmail,
      template_id: templateId || null,
      sequence_id: sequenceId || null,
      subject,
      status: 'sent',
      sent_at: Timestamp.now(),
      created_at: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error logging email sent:', error);
    throw error;
  }
}

export async function updateEmailStatus(
  emailId: string,
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed',
  errorMessage?: string
): Promise<void> {
  try {
    const docRef = doc(db, 'email_logs', emailId);
    const updateData: any = { status };
    
    if (errorMessage) {
      updateData.error_message = errorMessage;
    }
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating email status:', error);
    throw error;
  }
}
