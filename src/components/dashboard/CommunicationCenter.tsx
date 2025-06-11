import React from 'react';
import { MessageSquare, Mail, Phone, Send } from 'lucide-react';

export default function CommunicationCenter() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Recent Communications</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          New Message
        </button>
      </div>
      
      <div className="space-y-4">
        {[
          {
            client: 'Sarah Johnson',
            type: 'email',
            subject: 'Wedding Gallery Preview',
            time: '2 hours ago',
            status: 'sent'
          },
          {
            client: 'Emma Davis',
            type: 'message',
            subject: 'Engagement Session Details',
            time: '1 day ago',
            status: 'received'
          }
        ].map((comm, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {comm.type === 'email' && <Mail className="w-5 h-5" />}
                {comm.type === 'message' && <MessageSquare className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-medium">{comm.client}</p>
                <p className="text-sm text-gray-500">{comm.subject}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{comm.time}</p>
              <span className={`text-xs ${
                comm.status === 'sent' ? 'text-green-600' : 'text-blue-600'
              }`}>
                {comm.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}