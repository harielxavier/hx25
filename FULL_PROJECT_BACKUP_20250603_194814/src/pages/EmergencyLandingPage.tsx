import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Hariel Xavier Photography</h1>
      
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Our Photography Portfolio</h2>
        <p className="text-lg mb-6">
          We specialize in capturing life's most precious moments with artistic vision and technical excellence.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-200 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold mb-2">14+</div>
            <div className="text-sm uppercase">Years Experience</div>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold mb-2">300+</div>
            <div className="text-sm uppercase">Weddings Captured</div>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold mb-2">5.0</div>
            <div className="text-sm uppercase">Star Rating</div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button 
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
            onClick={() => alert('Booking feature will be available soon!')}
          >
            Book a Session
          </button>
          <button 
            className="border border-black px-6 py-3 rounded hover:bg-gray-100 transition-colors"
            onClick={() => navigate('/showcase')}
          >
            View Portfolio
          </button>
        </div>
      </div>
      
      <div className="text-center text-gray-600">
        <p>© 2025 Hariel Xavier Photography. All rights reserved.</p>
        <p className="mt-2">
          <button 
            className="text-blue-600 hover:underline"
            onClick={() => alert('Contact form will be available soon!')}
          >
            Contact Us
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmergencyLandingPage;
