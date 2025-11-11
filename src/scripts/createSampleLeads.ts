// REMOVED FIREBASE: import { collection, addDoc, serverTimestamp, Timestamp // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../lib/firebase';

interface SampleLead {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  guestCount: string;
  preferredStyle: string[];
  mustHaveShots: string;
  inspirationLinks: string;
  budget: string;
  hearAboutUs: string;
  additionalInfo: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const sampleLeads: Omit<SampleLead, 'createdAt' | 'updatedAt'>[] = [
  {
    firstName: 'Test',
    lastName: 'A',
    email: 'testa@example.com',
    phone: '555-123-4567',
    eventType: 'wedding',
    eventDate: '2025-06-15',
    eventLocation: 'Sparta, NJ',
    guestCount: '150',
    preferredStyle: ['Traditional', 'Candid'],
    mustHaveShots: 'First look, family portraits, dance floor moments',
    inspirationLinks: 'https://pinterest.com/myboard',
    budget: '3500-5000',
    hearAboutUs: 'instagram',
    additionalInfo: 'Looking forward to our big day!',
    status: 'new',
    source: 'sample_data'
  },
  {
    firstName: 'Test',
    lastName: 'B',
    email: 'testb@example.com',
    phone: '555-987-6543',
    eventType: 'engagement',
    eventDate: '2025-04-30',
    eventLocation: 'Central Park, NY',
    guestCount: '2',
    preferredStyle: ['Artistic', 'Natural/Lifestyle'],
    mustHaveShots: 'Sunset photos, candid moments',
    inspirationLinks: '',
    budget: '2000-3500',
    hearAboutUs: 'google',
    additionalInfo: 'We want a mix of urban and nature settings',
    status: 'new',
    source: 'sample_data'
  },
  {
    firstName: 'Test',
    lastName: 'C',
    email: 'testc@example.com',
    phone: '555-456-7890',
    eventType: 'family',
    eventDate: '2025-05-10',
    eventLocation: 'Client Home',
    guestCount: '5',
    preferredStyle: ['Candid', 'Natural/Lifestyle'],
    mustHaveShots: 'Family group shots, individual portraits of children',
    inspirationLinks: 'https://instagram.com/familyphotos',
    budget: 'under-2000',
    hearAboutUs: 'referral',
    additionalInfo: 'We have a newborn and 2 toddlers',
    status: 'new',
    source: 'sample_data'
  }
];

/**
 * Create sample leads in Firestore
 */
export const createSampleLeads = async (): Promise<boolean> => {
  try {
    const leadsRef = collection(db, 'leads');
    
    // Check if leads already exist
    console.log('Checking if leads already exist...');
    
    // Add sample leads
    console.log('Adding sample leads...');
    
    for (const lead of sampleLeads) {
      const leadWithTimestamps = {
        ...lead,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp
      };
      
      await addDoc(leadsRef, leadWithTimestamps);
      console.log(`Added sample lead for ${lead.firstName} ${lead.lastName}`);
    }
    
    console.log('Sample leads created successfully');
    return true;
  } catch (error) {
    console.error('Error creating sample leads:', error);
    return false;
  }
};

// Run the function if this script is executed directly
if (require.main === module) {
  createSampleLeads()
    .then(() => {
      console.log('Script completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export default createSampleLeads;
