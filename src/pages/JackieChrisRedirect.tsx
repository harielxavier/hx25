import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const WeddingGallery1Redirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/gallery/wedding-gallery-1');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <p className="text-xl">Redirecting to Wedding Gallery 1...</p>
      <div className="mt-4">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  );
};

export default WeddingGallery1Redirect;
