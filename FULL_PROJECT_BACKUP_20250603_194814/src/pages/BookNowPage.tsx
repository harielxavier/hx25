import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Navigation from '../components/landing/Navigation';
import BookingForm from '../components/booking/BookingForm';
import SEO from '../components/SEO';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  deposit_amount: number;
  is_active?: boolean;
}

export default function BookNowPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const q = query(
        collection(db, 'services'),
        orderBy('price')
      );
      const querySnapshot = await getDocs(q);
      const servicesData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((service: any) => service.is_active) as Service[];
      
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleBookingSuccess = (bookingId: string) => {
    // Redirect to confirmation page
    navigate(`/booking-confirmation/${bookingId}`);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 pt-24">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse bg-white h-96 rounded-lg" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Book Your Session | Hariel Xavier Photography"
        description="Book your photography session online. Choose your package, select your date, and secure your spot."
      />
      <Navigation />
      
      <main className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl mb-4">Book Your Session</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select your preferred package and date to begin your photography journey.
                A deposit is required to secure your booking.
              </p>
            </div>

            <BookingForm 
              services={services}
              onSuccess={handleBookingSuccess}
            />
          </div>
        </div>
      </main>
    </>
  );
}
