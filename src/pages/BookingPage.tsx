// src/pages/BookingPage.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BookingWidget from '../components/booking/BookingWidget';
import SiteFooter from '../components/SiteFooter'; // Assuming a common footer
import Sidebar from '../components/Sidebar'; // Assuming a common sidebar/navigation

const BookingPage: React.FC = () => {
  // Replace 'mockUserId' with actual logged-in user ID mechanism
  const mockUserId = 'user123'; 

  return (
    <>
      <Helmet>
        <title>Book Your Wedding Photography Session | Hariel Xavier Photography</title>
        <meta name="description" content="Schedule your wedding photography consultation or engagement session with Hariel Xavier Photography. Easy online booking system for New Jersey wedding photographer. Book your session today!" />
        <meta name="keywords" content="book wedding photographer, schedule photography session, wedding photography booking, engagement session booking, Hariel Xavier Photography, New Jersey photographer booking" />
        <link rel="canonical" href="https://harielxavier.com/booking" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Book Your Wedding Photography Session | Hariel Xavier Photography" />
        <meta property="og:description" content="Schedule your wedding photography consultation or engagement session with Hariel Xavier Photography. Easy online booking system for New Jersey wedding photographer." />
        <meta property="og:url" content="https://harielxavier.com/booking" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Book Your Wedding Photography Session | Hariel Xavier Photography" />
        <meta name="twitter:description" content="Schedule your wedding photography consultation or engagement session with Hariel Xavier Photography. Easy online booking system for New Jersey wedding photographer." />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Book Your Wedding Photography Session",
            "description": "Online booking system for wedding photography sessions with Hariel Xavier Photography",
            "url": "https://harielxavier.com/booking",
            "mainEntity": {
              "@type": "Service",
              "name": "Wedding Photography Booking",
              "description": "Professional wedding photography session booking and consultation scheduling",
              "provider": {
                "@type": "LocalBusiness",
                "name": "Hariel Xavier Photography",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Sussex County",
                  "addressRegion": "NJ",
                  "addressCountry": "US"
                }
              }
            }
          })}
        </script>
      </Helmet>
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Sidebar /> {/* Or your main navigation component */}
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Schedule Your Session</h1>
        <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.1em' }}>
          Use our new Smart Scheduler to find the perfect time for your consultation or photography session.
          Select your preferred dates and session type below to see available slots.
        </p>
        <BookingWidget userId={mockUserId} />
      </main>
      <SiteFooter />
      </div>
    </>
  );
};

export default BookingPage;
