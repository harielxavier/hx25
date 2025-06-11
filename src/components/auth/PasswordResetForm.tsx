import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowRight } from 'lucide-react';
import { resetPassword } from '../../lib/auth';

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email')
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function PasswordResetForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema)
  });

  const onSubmit = async (data: ResetFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await resetPassword(data.email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-light mb-4">Check Your Email</h2>
        <p className="text-gray-600">
          We've sent password reset instructions to your email address.
          Please check your inbox and follow the link to reset your password.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-light mb-6">Reset Password</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              {...register('email')}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : (
            <>
              Reset Password
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}