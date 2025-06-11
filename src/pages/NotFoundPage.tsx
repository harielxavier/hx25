import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Navigation from '../components/landing/Navigation';

export default function NotFoundPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h1 className="font-serif text-9xl mb-4">404</h1>
          <h2 className="text-2xl mb-6">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 hover:bg-gray-900 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}