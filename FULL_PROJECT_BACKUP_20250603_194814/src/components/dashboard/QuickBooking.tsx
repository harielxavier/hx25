import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, User } from 'lucide-react';

const quickBookingSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  service: z.string().min(1, 'Service is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
});

type QuickBookingForm = z.infer<typeof quickBookingSchema>;

export default function QuickBooking() {
  const { register, handleSubmit, formState: { errors } } = useForm<QuickBookingForm>({
    resolver: zodResolver(quickBookingSchema),
  });

  const onSubmit = async (data: QuickBookingForm) => {
    // This would submit to your API
    console.log(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Booking</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Client Name</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              {...register('clientName')}
              className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter client name"
            />
          </div>
          {errors.clientName && (
            <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Service</label>
          <select
            {...register('service')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select a service</option>
            <option value="wedding">Wedding Package</option>
            <option value="engagement">Engagement Session</option>
            <option value="portrait">Portrait Session</option>
          </select>
          {errors.service && (
            <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                {...register('date')}
                className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                {...register('time')}
                className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {errors.time && (
              <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Booking
        </button>
      </form>
    </div>
  );
}