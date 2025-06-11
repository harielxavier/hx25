import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, X } from 'lucide-react';
import QRCode from 'qrcode';

const verifySchema = z.object({
  code: z.string().length(6, 'Please enter a valid 6-digit code')
});

type VerifyFormData = z.infer<typeof verifySchema>;

interface TwoFactorSetupProps {
  onClose: () => void;
  onComplete: () => void;
}

export default function TwoFactorSetup({ onClose, onComplete }: TwoFactorSetupProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema)
  });

  React.useEffect(() => {
    generateSecret();
  }, []);

  async function generateSecret() {
    try {
      // In a real app, this would come from your backend
      const mockSecret = 'JBSWY3DPEHPK3PXP';
      const otpAuthUrl = `otpauth://totp/PhotoCRM:${encodeURIComponent('user@example.com')}?secret=${mockSecret}&issuer=PhotoCRM`;
      
      const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);
      setQrCode(qrCodeDataUrl);
      setSecret(mockSecret);
    } catch (error) {
      console.error('Error generating QR code:', error);
      setError('Failed to generate QR code');
    }
  }

  const onSubmit = async (data: VerifyFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // In a real app, verify the code with your backend
      if (data.code === '123456') {
        onComplete();
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg max-w-md w-full relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-light">Set Up Two-Factor Authentication</h2>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <p className="text-gray-600 mb-4">
            Scan this QR code with your authenticator app (like Google Authenticator
            or Authy) to set up two-factor authentication.
          </p>
          
          {qrCode && (
            <div className="flex justify-center mb-4">
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="font-mono text-lg mb-2">{secret}</p>
            <p className="text-sm text-gray-500">
              If you can't scan the QR code, enter this code manually in your authenticator app
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Verification Code
            </label>
            <input
              type="text"
              {...register('code')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter 6-digit code"
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Verify & Enable'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}