export interface Payment {
  id: string;
  status: 'paid' | 'late' | 'pending' | 'overdue';
  invoiceId: string;
  issueDate: string;
  sentDate: string;
  dueDate: string;
  lastActionDate: string;
  client: {
    name: string;
    email: string;
  };
  job: {
    name: string;
    status: string;
    leadSource: string;
    mainShoot: string;
  };
  amount: {
    total: number;
    tax: number;
    currency: string;
  };
}

export interface PaymentFormData {
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  notes?: string;
}