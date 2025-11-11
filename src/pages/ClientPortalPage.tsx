import React from 'react';
import ClientPortal from '../components/client/ClientPortal';
import { Job } from '../services/jobsService';
// REMOVED FIREBASE: import { Timestamp // REMOVED FIREBASE

const ClientPortalPage: React.FC = () => {
  // Mock job data for demonstration
  const mockJob: Job = {
    id: 'demo-job-1',
    name: 'Amanda & Alex Wedding',
    type: 'Wedding Photography',
    leadSource: 'Website',
    mainShootDate: Timestamp.fromDate(new Date('2024-04-15')),
    mainShootEndDate: Timestamp.fromDate(new Date('2024-04-15')),
    location: 'Garden Venue, New York',
    clientName: 'Amanda Johnson',
    clientEmail: 'amanda@example.com',
    clientPhone: '(555) 123-4567',
    notes: 'Beautiful outdoor wedding with garden ceremony and reception',
    status: 'active',
    createdAt: Timestamp.fromDate(new Date('2024-01-10')),
    updatedAt: Timestamp.fromDate(new Date('2024-03-15')),
    documents: {
      contracts: [],
      invoices: [],
      questionnaires: [],
      quotes: [],
      otherDocs: []
    },
    totalAmount: 4500,
    paidAmount: 1500,
    paymentStatus: 'partial'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientPortal 
        clientId="demo-client-1" 
        job={mockJob} 
      />
    </div>
  );
};

export default ClientPortalPage;
