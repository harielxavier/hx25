import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <p className="text-sm text-gray-600 mr-8">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAccept}
            className="bg-black text-white px-6 py-2 text-sm hover:bg-gray-900 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => setShowConsent(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}