export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export interface Booking {
  id: string;
  clientId: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description: string;
  maxBookingsPerDay?: number;
}