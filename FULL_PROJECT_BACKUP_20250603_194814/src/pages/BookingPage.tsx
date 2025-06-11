// src/pages/BookingPage.tsx
import React from 'react';
import BookingWidget from '../components/booking/BookingWidget';
import SiteFooter from '../components/SiteFooter'; // Assuming a common footer
import Sidebar from '../components/Sidebar'; // Assuming a common sidebar/navigation

const BookingPage: React.FC = () => {
  // Replace 'mockUserId' with actual logged-in user ID mechanism
  const mockUserId = 'user123'; 

  return (
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
  );
};

export default BookingPage;
