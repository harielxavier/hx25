import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { updatePassword } from '../../lib/auth';

const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function UpdatePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await updatePassword(data.password);
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
        <h2 className="text-2xl font-light mb-4">Password Updated</h2>
        <p className="text-gray-600">
          Your password has been successfully updated.
          You can now use your new password to sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-light mb-6">Update Password</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : (
            <>
              Update Password
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}