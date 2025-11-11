// REMOVED FIREBASE: import { db } from '../firebase/config';
// REMOVED FIREBASE: imports

// Types
export interface AvailabilitySetting {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BookingSlot {
  id: string;
  date: Date;
  start_time: string;
  end_time: string;
  is_available: boolean;
  service_type: string;
  duration_minutes: number;
  created_at: Date;
  updated_at: Date;
}

export interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  booking_date: Date;
  start_time: string;
  end_time: string;
  service_type: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface BookingReminder {
  id: string;
  booking_id: string;
  reminder_type: 'email' | 'sms';
  scheduled_for: Date;
  sent_at?: Date;
  status: 'pending' | 'sent' | 'failed';
  created_at: Date;
}

export async function getAvailabilitySettings(): Promise<AvailabilitySetting[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'availability_settings'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate(),
      updated_at: doc.data().updated_at?.toDate()
    })) as AvailabilitySetting[];
  } catch (error) {
    console.error('Error fetching availability settings:', error);
    throw error;
  }
}

export async function updateAvailabilitySettings(
  settings: Partial<AvailabilitySetting>[]
): Promise<void> {
  try {
    const batch = [];
    for (const setting of settings) {
      if (setting.id) {
        const docRef = doc(db, 'availability_settings', setting.id);
        batch.push(updateDoc(docRef, {
          ...setting,
          updated_at: Timestamp.now()
        }));
      }
    }
    await Promise.all(batch);
  } catch (error) {
    console.error('Error updating availability settings:', error);
    throw error;
  }
}

export async function getBookingSlots(
  startDate?: Date,
  endDate?: Date,
  serviceType?: string
): Promise<BookingSlot[]> {
  try {
    let q = query(collection(db, 'booking_slots'));
    
    if (startDate) {
      q = query(q, where('date', '>=', Timestamp.fromDate(startDate)));
    }
    if (endDate) {
      q = query(q, where('date', '<=', Timestamp.fromDate(endDate)));
    }
    if (serviceType) {
      q = query(q, where('service_type', '==', serviceType));
    }
    
    q = query(q, orderBy('date'), orderBy('start_time'));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(),
      created_at: doc.data().created_at?.toDate(),
      updated_at: doc.data().updated_at?.toDate()
    })) as BookingSlot[];
  } catch (error) {
    console.error('Error fetching booking slots:', error);
    throw error;
  }
}

// Alias for getBookingSlots to maintain compatibility
export const getAvailableSlots = getBookingSlots;

export async function createBookingSlot(slot: Partial<BookingSlot>): Promise<BookingSlot> {
  try {
    const docRef = await addDoc(collection(db, 'booking_slots'), {
      ...slot,
      date: slot.date ? Timestamp.fromDate(slot.date) : null,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    
    const newSlot = {
      id: docRef.id,
      ...slot,
      created_at: new Date(),
      updated_at: new Date()
    } as BookingSlot;
    
    return newSlot;
  } catch (error) {
    console.error('Error creating booking slot:', error);
    throw error;
  }
}

export async function createBooking(booking: Partial<Booking>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...booking,
      booking_date: booking.booking_date ? Timestamp.fromDate(booking.booking_date) : null,
      status: booking.status || 'pending',
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function createBookingWithReminders(
  booking: Partial<Booking>,
  reminderSettings: { days_before: number; reminder_type: 'email' | 'sms' }[]
): Promise<string> {
  try {
    // Create the booking
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      ...booking,
      booking_date: booking.booking_date ? Timestamp.fromDate(booking.booking_date) : null,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    });
    
    // Create reminders
    const reminders = reminderSettings.map(setting => {
      const reminderDate = new Date(booking.booking_date!);
      reminderDate.setDate(reminderDate.getDate() - setting.days_before);
      
      return addDoc(collection(db, 'booking_reminders'), {
        booking_id: bookingRef.id,
        reminder_type: setting.reminder_type,
        scheduled_for: Timestamp.fromDate(reminderDate),
        status: 'pending',
        created_at: Timestamp.now()
      });
    });
    
    await Promise.all(reminders);
    return bookingRef.id;
  } catch (error) {
    console.error('Error creating booking with reminders:', error);
    throw error;
  }
}

export async function getBookings(
  status?: string,
  startDate?: Date,
  endDate?: Date
): Promise<Booking[]> {
  try {
    let q = query(collection(db, 'bookings'));
    
    if (status) {
      q = query(q, where('status', '==', status));
    }
    if (startDate) {
      q = query(q, where('booking_date', '>=', Timestamp.fromDate(startDate)));
    }
    if (endDate) {
      q = query(q, where('booking_date', '<=', Timestamp.fromDate(endDate)));
    }
    
    q = query(q, orderBy('booking_date', 'desc'));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      booking_date: doc.data().booking_date?.toDate(),
      created_at: doc.data().created_at?.toDate(),
      updated_at: doc.data().updated_at?.toDate()
    })) as Booking[];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<void> {
  try {
    const docRef = doc(db, 'bookings', bookingId);
    await updateDoc(docRef, {
      status,
      updated_at: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

export async function checkSlotAvailability(
  date: Date,
  startTime: string,
  endTime: string
): Promise<boolean> {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('booking_date', '==', Timestamp.fromDate(date)),
      where('status', 'in', ['pending', 'confirmed'])
    );
    
    const querySnapshot = await getDocs(q);
    const existingBookings = querySnapshot.docs.map(doc => doc.data());
    
    // Check for time conflicts
    for (const booking of existingBookings) {
      if (
        (startTime >= booking.start_time && startTime < booking.end_time) ||
        (endTime > booking.start_time && endTime <= booking.end_time) ||
        (startTime <= booking.start_time && endTime >= booking.end_time)
      ) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error checking slot availability:', error);
    throw error;
  }
}

export async function getBookingReminders(
  bookingId: string
): Promise<BookingReminder[]> {
  try {
    const q = query(
      collection(db, 'booking_reminders'),
      where('booking_id', '==', bookingId),
      orderBy('scheduled_for')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      scheduled_for: doc.data().scheduled_for?.toDate(),
      sent_at: doc.data().sent_at?.toDate(),
      created_at: doc.data().created_at?.toDate()
    })) as BookingReminder[];
  } catch (error) {
    console.error('Error fetching booking reminders:', error);
    throw error;
  }
}

export async function markReminderAsSent(reminderId: string): Promise<void> {
  try {
    const docRef = doc(db, 'booking_reminders', reminderId);
    await updateDoc(docRef, {
      status: 'sent',
      sent_at: Timestamp.now()
    });
  } catch (error) {
    console.error('Error marking reminder as sent:', error);
    throw error;
  }
}
