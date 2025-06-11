import React from 'react';
import { Helmet } from 'react-helmet-async';
import PhotoGallery from '../components/client/PhotoGallery';

const ClientGalleryViewPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Client Gallery | Hariel Xavier Photography</title>
        <meta name="description" content="View and download your professional photos from Hariel Xavier Photography." />
      </Helmet>
      
      <main className="min-h-screen bg-gray-50">
        <PhotoGallery />
      </main>
      
      {/* Footer is handled by the main layout */}
    </>
  );
};

export default ClientGalleryViewPage;
