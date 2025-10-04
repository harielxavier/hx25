import { useState } from 'react';
import { Star, X, Send } from 'lucide-react';

interface ReviewCollectionWidgetProps {
  clientName: string;
  weddingDate: string;
  onClose?: () => void;
}

/**
 * Automated Review Collection Widget
 * Shows after gallery delivery to request Google reviews
 */
export default function ReviewCollectionWidget({ 
  clientName, 
  weddingDate,
  onClose 
}: ReviewCollectionWidgetProps) {
  const [step, setStep] = useState<'rating' | 'redirect' | 'thanks'>('rating');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Google Review Link - Replace with your actual Google Business Profile review link
  const GOOGLE_REVIEW_URL = 'https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review';

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    
    if (selectedRating >= 4) {
      // Happy customer - send to Google Reviews
      setStep('redirect');
      setTimeout(() => {
        window.open(GOOGLE_REVIEW_URL, '_blank');
      }, 2000);
    } else {
      // Needs attention - collect feedback privately
      setStep('thanks');
      // TODO: Send notification to you about low rating
      // You can integrate with email service here
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2 justify-center mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-12 h-12 transition-colors ${
                (hoveredRating || rating) >= star
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (step === 'rating') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          )}

          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
              <h2 className="text-2xl font-serif mb-2">
                Hi {clientName}!
              </h2>
              <p className="text-gray-600">
                We hope you loved your wedding photos! Your feedback means the world to us.
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-4">
                How would you rate your experience?
              </p>
              {renderStars()}
              <p className="text-xs text-gray-500">
                Tap a star to rate your experience
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
              <p>
                ⭐ Your review helps other couples find us and supports our small business!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'redirect') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-serif mb-2">
              Thank you! ❤️
            </h2>
            <p className="text-gray-600 mb-4">
              We're redirecting you to Google to leave your review...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            If the page doesn't open, click{' '}
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              here
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">💙</span>
          </div>
          <h2 className="text-2xl font-serif mb-2">
            Thank you for your feedback
          </h2>
          <p className="text-gray-600 mb-4">
            We appreciate your honesty. We'll reach out to you personally to make sure everything is perfect!
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
