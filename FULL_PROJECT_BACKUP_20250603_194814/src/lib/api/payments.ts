import { db } from '../../firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';

export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  stripe_payment_intent_id?: string;
  due_date: Date;
  paid_at?: Date;
  description?: string;
  invoice_number?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentFormData {
  client_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  due_date: Date;
  description?: string;
  invoice_number?: string;
}

export async function createPayment(paymentData: PaymentFormData): Promise<Payment> {
  try {
    const docRef = await addDoc(collection(db, 'payments'), {
      ...paymentData,
      status: 'pending',
      due_date: Timestamp.fromDate(paymentData.due_date),
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    
    const newPayment = {
      id: docRef.id,
      ...paymentData,
      status: 'pending' as const,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return newPayment;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}

export async function getPayments(
  clientId?: string,
  status?: string
): Promise<Payment[]> {
  try {
    let q = query(collection(db, 'payments'));
    
    if (clientId) {
      q = query(q, where('client_id', '==', clientId));
    }
    if (status) {
      q = query(q, where('status', '==', status));
    }
    
    q = query(q, orderBy('created_at', 'desc'));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      due_date: doc.data().due_date?.toDate(),
      paid_at: doc.data().paid_at?.toDate(),
      created_at: doc.data().created_at?.toDate(),
      updated_at: doc.data().updated_at?.toDate()
    })) as Payment[];
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: 'pending' | 'paid' | 'failed' | 'refunded',
  stripePaymentIntentId?: string
): Promise<void> {
  try {
    const updateData: any = {
      status,
      updated_at: Timestamp.now()
    };
    
    if (status === 'paid') {
      updateData.paid_at = Timestamp.now();
    }
    
    if (stripePaymentIntentId) {
      updateData.stripe_payment_intent_id = stripePaymentIntentId;
    }
    
    const docRef = doc(db, 'payments', paymentId);
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
}

export async function sendPaymentReminder(paymentId: string): Promise<void> {
  try {
    // This would typically trigger a cloud function to send the reminder
    // For now, we'll just log the action
    console.log(`Payment reminder sent for payment: ${paymentId}`);
    
    // You could add a reminder log entry to track when reminders were sent
    await addDoc(collection(db, 'payment_reminders'), {
      payment_id: paymentId,
      sent_at: Timestamp.now(),
      created_at: Timestamp.now()
    });
  } catch (error) {
    console.error('Error sending payment reminder:', error);
    throw error;
  }
}

export async function getPaymentById(paymentId: string): Promise<Payment | null> {
  try {
    const docRef = doc(db, 'payments', paymentId);
    const docSnap = await getDocs(query(collection(db, 'payments'), where('__name__', '==', paymentId)));
    
    if (docSnap.empty) {
      return null;
    }
    
    const paymentDoc = docSnap.docs[0];
    return {
      id: paymentDoc.id,
      ...paymentDoc.data(),
      due_date: paymentDoc.data().due_date?.toDate(),
      paid_at: paymentDoc.data().paid_at?.toDate(),
      created_at: paymentDoc.data().created_at?.toDate(),
      updated_at: paymentDoc.data().updated_at?.toDate()
    } as Payment;
  } catch (error) {
    console.error('Error fetching payment by ID:', error);
    throw error;
  }
}

export async function getOverduePayments(): Promise<Payment[]> {
  try {
    const today = new Date();
    const q = query(
      collection(db, 'payments'),
      where('status', '==', 'pending'),
      where('due_date', '<', Timestamp.fromDate(today)),
      orderBy('due_date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      due_date: doc.data().due_date?.toDate(),
      paid_at: doc.data().paid_at?.toDate(),
      created_at: doc.data().created_at?.toDate(),
      updated_at: doc.data().updated_at?.toDate()
    })) as Payment[];
  } catch (error) {
    console.error('Error fetching overdue payments:', error);
    throw error;
  }
}

export async function importPaymentsFromCSV(csvData: string): Promise<{ success: number; errors: string[] }> {
  try {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    let success = 0;
    const errors: string[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        const values = line.split(',').map(v => v.trim());
        const paymentData: any = {};
        
        headers.forEach((header, index) => {
          paymentData[header] = values[index];
        });
        
        // Convert string values to appropriate types
        if (paymentData.amount) {
          paymentData.amount = parseFloat(paymentData.amount);
        }
        if (paymentData.due_date) {
          paymentData.due_date = new Date(paymentData.due_date);
        }
        
        await createPayment(paymentData);
        success++;
      } catch (error) {
        errors.push(`Line ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { success, errors };
  } catch (error) {
    console.error('Error importing payments from CSV:', error);
    throw error;
  }
}
