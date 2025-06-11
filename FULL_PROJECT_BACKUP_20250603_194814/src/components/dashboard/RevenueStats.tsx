import React from 'react';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  upcomingRevenue: number;
  compareLastMonth: number;
}

export default function RevenueStats() {
  const stats: RevenueStats = {
    totalRevenue: 125000,
    monthlyRevenue: 12500,
    upcomingRevenue: 15000,
    compareLastMonth: 15
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="stat-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-600">Total Revenue</p>
            <p className="mt-1 text-3xl font-light text-neutral-900">
              {formatPrice(stats.totalRevenue)}
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <TrendingUp className={`h-4 w-4 ${stats.compareLastMonth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <p className={`ml-2 text-sm ${stats.compareLastMonth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(stats.compareLastMonth)}% from last month
            </p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-600">Monthly Revenue</p>
            <p className="mt-1 text-3xl font-light text-neutral-900">
              {formatPrice(stats.monthlyRevenue)}
            </p>
          </div>
          <div className="p-3 bg-secondary-light/20 rounded-full">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-neutral-100 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: '70%' }}
            />
          </div>
          <p className="mt-2 text-sm text-neutral-600">70% of monthly goal</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-600">Upcoming Revenue</p>
            <p className="mt-1 text-3xl font-light text-neutral-900">
              {formatPrice(stats.upcomingRevenue)}
            </p>
          </div>
          <div className="p-3 bg-secondary-light/20 rounded-full">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-neutral-600">From 8 upcoming bookings</p>
        </div>
      </div>
    </div>
  );
}