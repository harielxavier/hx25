import React from 'react';
import { Users, Calendar, DollarSign, Camera, ArrowUp, ArrowDown } from 'lucide-react';

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Total Revenue */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500">Total Revenue</h3>
          <DollarSign className="w-6 h-6 text-green-500" />
        </div>
        <p className="text-3xl font-light">$24,500</p>
        <div className="flex items-center gap-2 mt-2 text-green-500">
          <ArrowUp className="w-4 h-4" />
          <span className="text-sm">15% from last month</span>
        </div>
      </div>
      
      {/* Active Clients */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500">Active Clients</h3>
          <Users className="w-6 h-6 text-blue-500" />
        </div>
        <p className="text-3xl font-light">48</p>
        <div className="flex items-center gap-2 mt-2 text-blue-500">
          <ArrowUp className="w-4 h-4" />
          <span className="text-sm">5 new this month</span>
        </div>
      </div>
      
      {/* Upcoming Sessions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500">Upcoming Sessions</h3>
          <Calendar className="w-6 h-6 text-purple-500" />
        </div>
        <p className="text-3xl font-light">12</p>
        <p className="text-sm text-purple-500 mt-2">Next 7 days</p>
      </div>
      
      {/* Delivered Galleries */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500">Delivered Galleries</h3>
          <Camera className="w-6 h-6 text-orange-500" />
        </div>
        <p className="text-3xl font-light">156</p>
        <p className="text-sm text-orange-500 mt-2">15,600 photos</p>
      </div>
    </div>
  );
}