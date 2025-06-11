
import React from 'react';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/layout/Footer';

export default function SimpleLandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-6">Hariel Xavier Photography</h1>
          <p className="text-lg mb-8">
            Welcome to our photography portfolio. This is a simplified landing page
            to test if the website can render properly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Sample Gallery {item}</h2>
                <p>This is a placeholder for gallery content.</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
