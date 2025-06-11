import { v4 as uuidv4 } from 'uuid';
import { format, addDays } from 'date-fns';
import { Client } from '../types/client';
import { Job } from '../types/job';
import { Payment } from '../types/payment';

// Invoice status types
export type InvoiceStatus = 
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'partial'
  | 'paid'
  | 'overdue'
  | 'cancelled';

// Invoice item interface
export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  total: number;
}

// Invoice interface
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  jobId?: string;
  issueDate: string; // ISO string
  dueDate: string; // ISO string
  status: InvoiceStatus;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  notes: string;
  terms: string;
  items: InvoiceItem[];
  paymentId?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Invoice template interface
export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  headerText: string;
  footerText: string;
  terms: string;
  notes: string;
  isDefault: boolean;
}

// Mock invoice templates
const invoiceTemplates: InvoiceTemplate[] = [
  {
    id: '1',
    name: 'Standard Template',
    description: 'Default invoice template with clean, professional design',
    logoUrl: '/assets/logo.png',
    primaryColor: '#4f46e5',
    secondaryColor: '#f3f4f6',
    fontFamily: 'Inter, sans-serif',
    headerText: 'Thank you for choosing Hariel Xavier Photography',
    footerText: 'Payment terms: Due within {{dueDays}} days of issue date',
    terms: 'All payments are non-refundable. A late fee of 5% will be applied to payments made after the due date.',
    notes: 'Please include your invoice number in the payment reference.',
    isDefault: true
  },
  {
    id: '2',
    name: 'Wedding Template',
    description: 'Elegant template designed for wedding clients',
    logoUrl: '/assets/wedding-logo.png',
    primaryColor: '#9d8189',
    secondaryColor: '#f8f5f5',
    fontFamily: 'Cormorant Garamond, serif',
    headerText: 'Thank you for choosing Hariel Xavier Photography for your special day',
    footerText: 'Payment terms: Due within {{dueDays}} days of issue date',
    terms: 'All payments are non-refundable. Final payment is due 14 days before the wedding date.',
    notes: 'Please include your invoice number in the payment reference.',
    isDefault: false
  }
];

// Mock invoices
let invoices: Invoice[] = [];

// Mock invoice items
let invoiceItems: InvoiceItem[] = [];

/**
 * Get all invoice templates
 */
export const getInvoiceTemplates = async (): Promise<InvoiceTemplate[]> => {
  // In a real implementation, this would fetch from a database
  return invoiceTemplates;
};

/**
 * Get invoice template by ID
 */
export const getInvoiceTemplateById = async (id: string): Promise<InvoiceTemplate | null> => {
  const template = invoiceTemplates.find(t => t.id === id);
  return template || null;
};

/**
 * Get default invoice template
 */
export const getDefaultInvoiceTemplate = async (): Promise<InvoiceTemplate | null> => {
  const template = invoiceTemplates.find(t => t.isDefault);
  return template || null;
};

/**
 * Create a new invoice template
 */
export const createInvoiceTemplate = async (template: Omit<InvoiceTemplate, 'id'>): Promise<InvoiceTemplate> => {
  const newTemplate: InvoiceTemplate = {
    ...template,
    id: uuidv4()
  };
  
  invoiceTemplates.push(newTemplate);
  return newTemplate;
};

/**
 * Update an invoice template
 */
export const updateInvoiceTemplate = async (id: string, updates: Partial<InvoiceTemplate>): Promise<InvoiceTemplate | null> => {
  const index = invoiceTemplates.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  const updatedTemplate = {
    ...invoiceTemplates[index],
    ...updates
  };
  
  invoiceTemplates[index] = updatedTemplate;
  return updatedTemplate;
};

/**
 * Delete an invoice template
 */
export const deleteInvoiceTemplate = async (id: string): Promise<boolean> => {
  // Don't allow deleting the default template
  const template = await getInvoiceTemplateById(id);
  if (!template || template.isDefault) return false;
  
  const initialLength = invoiceTemplates.length;
  const filtered = invoiceTemplates.filter(t => t.id !== id);
  
  if (filtered.length < initialLength) {
    invoiceTemplates.length = 0;
    invoiceTemplates.push(...filtered);
    return true;
  }
  
  return false;
};

/**
 * Get all invoices
 */
export const getInvoices = async (): Promise<Invoice[]> => {
  return invoices;
};

/**
 * Get invoice by ID
 */
export const getInvoiceById = async (id: string): Promise<Invoice | null> => {
  const invoice = invoices.find(i => i.id === id);
  return invoice || null;
};

/**
 * Get invoices for client
 */
export const getInvoicesForClient = async (clientId: string): Promise<Invoice[]> => {
  return invoices.filter(i => i.clientId === clientId);
};

/**
 * Get invoices for job
 */
export const getInvoicesForJob = async (jobId: string): Promise<Invoice[]> => {
  return invoices.filter(i => i.jobId === jobId);
};

/**
 * Generate invoice number
 */
export const generateInvoiceNumber = async (): Promise<string> => {
  const prefix = 'INV';
  const year = new Date().getFullYear().toString().slice(-2);
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  
  // Get the highest invoice number with this prefix
  const regex = new RegExp(`^${prefix}${year}${month}-(\\d+)$`);
  let maxNumber = 0;
  
  for (const invoice of invoices) {
    const match = invoice.invoiceNumber.match(regex);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }
  }
  
  const nextNumber = (maxNumber + 1).toString().padStart(3, '0');
  return `${prefix}${year}${month}-${nextNumber}`;
};

/**
 * Calculate invoice totals
 */
export const calculateInvoiceTotals = (items: Omit<InvoiceItem, 'id' | 'invoiceId'>[]): {
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
} => {
  let subtotal = 0;
  let taxTotal = 0;
  let discountTotal = 0;
  
  for (const item of items) {
    const itemSubtotal = item.quantity * item.unitPrice;
    const itemDiscount = itemSubtotal * (item.discount / 100);
    const itemTax = (itemSubtotal - itemDiscount) * (item.taxRate / 100);
    
    subtotal += itemSubtotal;
    discountTotal += itemDiscount;
    taxTotal += itemTax;
  }
  
  const total = subtotal - discountTotal + taxTotal;
  
  return {
    subtotal,
    taxTotal,
    discountTotal,
    total
  };
};

/**
 * Create a new invoice
 */
export const createInvoice = async (
  clientId: string,
  jobId: string | undefined,
  items: Omit<InvoiceItem, 'id' | 'invoiceId'>[],
  options: {
    issueDate?: string;
    dueDate?: string;
    notes?: string;
    terms?: string;
    status?: InvoiceStatus;
  } = {}
): Promise<Invoice> => {
  const invoiceId = uuidv4();
  const invoiceNumber = await generateInvoiceNumber();
  const now = new Date().toISOString();
  
  const issueDate = options.issueDate || now;
  const dueDate = options.dueDate || addDays(new Date(issueDate), 14).toISOString();
  
  // Calculate totals
  const { subtotal, taxTotal, discountTotal, total } = calculateInvoiceTotals(items);
  
  // Create invoice
  const invoice: Invoice = {
    id: invoiceId,
    invoiceNumber,
    clientId,
    jobId,
    issueDate,
    dueDate,
    status: options.status || 'draft',
    subtotal,
    taxTotal,
    discountTotal,
    total,
    notes: options.notes || '',
    terms: options.terms || '',
    items: [],
    createdAt: now,
    updatedAt: now
  };
  
  // Create invoice items
  const newItems: InvoiceItem[] = items.map(item => ({
    ...item,
    id: uuidv4(),
    invoiceId,
    total: (item.quantity * item.unitPrice) * (1 - item.discount / 100) * (1 + item.taxRate / 100)
  }));
  
  invoice.items = newItems;
  invoiceItems.push(...newItems);
  invoices.push(invoice);
  
  return invoice;
};

/**
 * Update invoice status
 */
export const updateInvoiceStatus = async (id: string, status: InvoiceStatus): Promise<Invoice | null> => {
  const index = invoices.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  const updatedInvoice = {
    ...invoices[index],
    status,
    updatedAt: new Date().toISOString()
  };
  
  invoices[index] = updatedInvoice;
  return updatedInvoice;
};

/**
 * Update invoice
 */
export const updateInvoice = async (id: string, updates: Partial<Invoice>, updatedItems?: Omit<InvoiceItem, 'id' | 'invoiceId'>[]): Promise<Invoice | null> => {
  const index = invoices.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  let updatedInvoice = {
    ...invoices[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // If items are updated, recalculate totals
  if (updatedItems) {
    // Remove old items
    invoiceItems = invoiceItems.filter(item => item.invoiceId !== id);
    
    // Calculate new totals
    const { subtotal, taxTotal, discountTotal, total } = calculateInvoiceTotals(updatedItems);
    
    // Create new items
    const newItems: InvoiceItem[] = updatedItems.map(item => ({
      ...item,
      id: uuidv4(),
      invoiceId: id,
      total: (item.quantity * item.unitPrice) * (1 - item.discount / 100) * (1 + item.taxRate / 100)
    }));
    
    invoiceItems.push(...newItems);
    
    updatedInvoice = {
      ...updatedInvoice,
      subtotal,
      taxTotal,
      discountTotal,
      total,
      items: newItems
    };
  }
  
  invoices[index] = updatedInvoice;
  return updatedInvoice;
};

/**
 * Delete invoice
 */
export const deleteInvoice = async (id: string): Promise<boolean> => {
  // Only allow deleting draft invoices
  const invoice = await getInvoiceById(id);
  if (!invoice || invoice.status !== 'draft') return false;
  
  const initialLength = invoices.length;
  invoices = invoices.filter(i => i.id !== id);
  
  // Also delete invoice items
  invoiceItems = invoiceItems.filter(item => item.invoiceId !== id);
  
  return invoices.length < initialLength;
};

/**
 * Send invoice
 */
export const sendInvoice = async (id: string, emailRecipient?: string): Promise<Invoice | null> => {
  const invoice = await getInvoiceById(id);
  if (!invoice) return null;
  
  // In a real implementation, this would send an email with the invoice PDF
  console.log(`Sending invoice ${invoice.invoiceNumber} to ${emailRecipient || 'client'}`);
  
  return updateInvoiceStatus(id, 'sent');
};

/**
 * Mark invoice as paid
 */
export const markInvoiceAsPaid = async (id: string, paymentId?: string): Promise<Invoice | null> => {
  const index = invoices.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  const updatedInvoice = {
    ...invoices[index],
    status: 'paid' as InvoiceStatus,
    paymentId,
    updatedAt: new Date().toISOString()
  };
  
  invoices[index] = updatedInvoice;
  return updatedInvoice;
};

/**
 * Generate invoice PDF
 */
export const generateInvoicePdf = async (id: string, templateId?: string): Promise<string> => {
  const invoice = await getInvoiceById(id);
  if (!invoice) throw new Error('Invoice not found');
  
  const template = templateId 
    ? await getInvoiceTemplateById(templateId)
    : await getDefaultInvoiceTemplate();
  
  if (!template) throw new Error('Invoice template not found');
  
  // In a real implementation, this would generate a PDF
  // For now, we'll just return a mock URL
  return `/api/invoices/${id}/pdf?t=${Date.now()}`;
};

/**
 * Create invoice from job
 */
export const createInvoiceFromJob = async (jobId: string, options: {
  depositOnly?: boolean;
  finalOnly?: boolean;
  templateId?: string;
}): Promise<Invoice | null> => {
  // In a real implementation, this would fetch the job and client from the database
  // For now, we'll use mock data
  const job: Partial<Job> = {
    id: jobId,
    clientId: 'client-123',
    type: 'wedding',
    price: 2500,
    depositAmount: 500,
    depositDue: addDays(new Date(), 7).toISOString(),
    finalPaymentDue: addDays(new Date(), 30).toISOString()
  };
  
  const client: Partial<Client> = {
    id: 'client-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  };
  
  if (!job.id || !job.clientId || !job.price) {
    throw new Error('Invalid job data');
  }
  
  const template = options.templateId 
    ? await getInvoiceTemplateById(options.templateId)
    : await getDefaultInvoiceTemplate();
  
  if (!template) throw new Error('Invoice template not found');
  
  // Create invoice items based on options
  const items: Omit<InvoiceItem, 'id' | 'invoiceId'>[] = [];
  
  if (options.depositOnly) {
    // Create deposit invoice
    items.push({
      description: `Deposit for ${job.type} photography`,
      quantity: 1,
      unitPrice: job.depositAmount || job.price * 0.25, // Default to 25% if not specified
      taxRate: 0,
      discount: 0,
      total: job.depositAmount || job.price * 0.25
    });
    
    return createInvoice(job.clientId, job.id, items, {
      dueDate: job.depositDue,
      terms: template.terms,
      notes: `This is a deposit invoice for your upcoming ${job.type} photography session.`
    });
  } else if (options.finalOnly) {
    // Create final payment invoice
    items.push({
      description: `Final payment for ${job.type} photography`,
      quantity: 1,
      unitPrice: job.price - (job.depositAmount || job.price * 0.25),
      taxRate: 0,
      discount: 0,
      total: job.price - (job.depositAmount || job.price * 0.25)
    });
    
    return createInvoice(job.clientId, job.id, items, {
      dueDate: job.finalPaymentDue,
      terms: template.terms,
      notes: `This is the final payment invoice for your ${job.type} photography session.`
    });
  } else {
    // Create full invoice
    items.push({
      description: `${job.type} photography package`,
      quantity: 1,
      unitPrice: job.price,
      taxRate: 0,
      discount: 0,
      total: job.price
    });
    
    return createInvoice(job.clientId, job.id, items, {
      terms: template.terms,
      notes: template.notes
    });
  }
};

/**
 * Update overdue invoices
 * This would typically be called by a cron job or scheduled function
 */
export const updateOverdueInvoices = async (): Promise<number> => {
  const now = new Date();
  let updatedCount = 0;
  
  for (const invoice of invoices) {
    if (
      (invoice.status === 'sent' || invoice.status === 'viewed') &&
      new Date(invoice.dueDate) < now
    ) {
      await updateInvoiceStatus(invoice.id, 'overdue');
      updatedCount++;
    }
  }
  
  return updatedCount;
};

export default {
  getInvoiceTemplates,
  getInvoiceTemplateById,
  getDefaultInvoiceTemplate,
  createInvoiceTemplate,
  updateInvoiceTemplate,
  deleteInvoiceTemplate,
  getInvoices,
  getInvoiceById,
  getInvoicesForClient,
  getInvoicesForJob,
  generateInvoiceNumber,
  calculateInvoiceTotals,
  createInvoice,
  updateInvoiceStatus,
  updateInvoice,
  deleteInvoice,
  sendInvoice,
  markInvoiceAsPaid,
  generateInvoicePdf,
  createInvoiceFromJob,
  updateOverdueInvoices
};
