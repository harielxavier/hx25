import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, MapPin, DollarSign, User, Mail, Phone, ArrowRight } from 'lucide-react';
import { BookingSlot, createBooking } from '../../lib/booking';
import BookingCalendar from './BookingCalendar';

const bookingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().optional(),
  notes: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val, 'You must accept the terms and conditions')
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  deposit_amount: number;
}

interface BookingFormProps {
  services: Service[];
  onSuccess: (bookingId: string) => void;
}

export default function BookingForm({ services, onSuccess }: BookingFormProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  });

  const nextStep = () => {
    if ((step === 1 && selectedService) || (step === 2 && selectedSlot)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedService || !selectedSlot) return;

    try {
      setIsSubmitting(true);

      const bookingData = {
        client_name: `${data.firstName} ${data.lastName}`,
        client_email: data.email,
        client_phone: data.phone,
        booking_date: selectedSlot.date,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        service_type: selectedService.name,
        status: 'pending' as const,
        notes: data.notes || '',
        location: data.location || '',
        total_amount: selectedService.price,
        deposit_amount: selectedService.deposit_amount
      };

      const bookingId = await createBooking(bookingData);
      
      // Send confirmation email via EmailJS
      try {
        const { sendBookingEmail } = await import('../../services/emailjsService');
        await sendBookingEmail({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          serviceName: selectedService.name,
          date: selectedSlot.date.toLocaleDateString(),
          startTime: selectedSlot.start_time,
          location: data.location || 'To be determined',
          totalAmount: selectedService.price,
          depositAmount: selectedService.deposit_amount
        });
      } catch (emailError) {
        console.error('Error sending booking email:', emailError);
        // Don't fail the booking if email fails
      }
      
      onSuccess(bookingId);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('There was an error creating your booking. Please try again or call us at (862) 290-4349.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[
          { num: 1, title: 'Service' },
          { num: 2, title: 'Date & Time' },
          { num: 3, title: 'Details' }
        ].map(({ num, title }) => (
          <div key={num} className="flex flex-col items-center relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              step >= num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {num}
            </div>
            <span className="text-sm text-gray-600">{title}</span>
            {num < 3 && (
              <div className={`absolute top-4 left-full w-full h-[1px] -ml-4 ${
                step > num ? 'bg-primary' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light mb-6">Select Your Package</h2>
          <div className="grid gap-6">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`text-left p-6 border-2 rounded-lg transition-colors ${
                  selectedService?.id === service.id 
                    ? 'border-primary bg-primary text-white' 
                    : 'border-gray-200 hover:border-primary'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-medium">{service.name}</h3>
                    <p className="text-3xl mb-2">${service.price}</p>
                    <p className="opacity-80">{service.description}</p>
                  </div>
                  {selectedService?.id === service.id && (
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration / 60} hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Deposit: ${service.deposit_amount}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Date & Time Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light mb-6">Choose Your Date & Time</h2>
          <BookingCalendar
            serviceId={selectedService?.id}
            selectedSlot={selectedSlot}
            onSlotSelect={setSelectedSlot}
          />
        </div>
      )}

      {/* Step 3: Client Details */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-light mb-6">Complete Your Booking</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    {...register('firstName')}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    {...register('lastName')}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location (optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  {...register('location')}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter location details"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (optional)</label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Any special requests or additional information?"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('acceptTerms')}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">
                  I agree to the terms and conditions
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}
            </div>

            {selectedService && selectedSlot && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Booking Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{selectedService.name}</span>
                    <span>${selectedService.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Deposit Due Today</span>
                    <span>${selectedService.deposit_amount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Balance Due</span>
                    <span>${selectedService.price - selectedService.deposit_amount}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total Package Price</span>
                      <span>${selectedService.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        {step > 1 ? (
          <button
            onClick={prevStep}
            className="px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors rounded-lg"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            onClick={nextStep}
            disabled={(step === 1 && !selectedService) || (step === 2 && !selectedSlot)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : (
              <>
                Complete Booking
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}