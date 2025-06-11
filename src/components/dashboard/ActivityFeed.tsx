import React from 'react';
import { User, Download, Heart, MessageSquare } from 'lucide-react';

export default function ActivityFeed() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-6">Recent Activity</h3>
      
      <div className="space-y-6">
        {[
          {
            type: 'download',
            client: 'Sarah Johnson',
            action: 'downloaded wedding gallery',
            time: '2 hours ago'
          },
          {
            type: 'favorite',
            client: 'Emma Davis',
            action: 'marked 15 photos as favorites',
            time: '4 hours ago'
          }
        ].map((activity, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              {activity.type === 'download' && <Download className="w-4 h-4" />}
              {activity.type === 'favorite' && <Heart className="w-4 h-4" />}
            </div>
            <div>
              <p>
                <span className="font-medium">{activity.client}</span>
                {' '}{activity.action}
              </p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}