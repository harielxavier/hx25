import React from 'react';
import { Star, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';

interface Feedback {
  client: string;
  date: string;
  rating: number;
  comment: string;
  event: string;
  approved: boolean;
}

export default function ClientFeedback() {
  const [feedback] = React.useState<Feedback[]>([
    {
      client: 'Sarah Johnson',
      date: '2024-03-15',
      rating: 5,
      comment: 'Absolutely amazing! Captured our special day perfectly.',
      event: 'Wedding Photography',
      approved: true
    },
    {
      client: 'Emma Davis',
      date: '2024-03-10',
      rating: 5,
      comment: 'Professional, creative, and made us feel so comfortable.',
      event: 'Engagement Session',
      approved: false
    }
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Recent Feedback</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Overall Rating:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {feedback.map((item, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">{item.client}</p>
                <p className="text-sm text-gray-500">{item.event}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{item.comment}</p>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{item.date}</span>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <ThumbsUp className="w-4 h-4" />
                  Approve
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <MessageSquare className="w-4 h-4" />
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}