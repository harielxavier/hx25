import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader, Send, Check, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { sendGalleryNotification } from '../../services/emailService';
import { getGalleryById, Gallery } from '../../services/galleryService';

interface GalleryNotificationSenderProps {
  galleryId: string;
  onClose?: () => void;
}

interface FormValues {
  clientEmail: string;
  customMessage: string;
  sendPassword: boolean;
}

export default function GalleryNotificationSender({ galleryId, onClose }: GalleryNotificationSenderProps) {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [gallery, setGallery] = useState<Gallery | null>(null);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    defaultValues: {
      clientEmail: '',
      customMessage: '',
      sendPassword: true
    }
  });
  
  // Load gallery data
  useEffect(() => {
    const loadGallery = async () => {
      setLoading(true);
      try {
        const galleryData = await getGalleryById(galleryId);
        setGallery(galleryData);
        
        // Pre-fill client email if available
        if (galleryData?.clientEmail) {
          setValue('clientEmail', galleryData.clientEmail);
        }
        
        // Pre-fill custom message with template
        setValue('customMessage', 
          `I'm excited to share your photos with you! Please take your time browsing through them and let me know if you have any questions.\n\nBest regards,\nHariel Xavier`
        );
        
      } catch (error) {
        console.error('Error loading gallery:', error);
        toast.error('Failed to load gallery information');
      } finally {
        setLoading(false);
      }
    };
    
    loadGallery();
  }, [galleryId, setValue]);
  
  const onSubmit = async (data: FormValues) => {
    if (!gallery) return;
    
    setSending(true);
    setSuccess(false);
    
    try {
      // Call the modified sendGalleryNotification function
      // Note: This function now logs a message but doesn't actually send an email
      // In a production environment, you would want to implement a server-side solution
      await sendGalleryNotification(
        data.clientEmail,
        galleryId,
        gallery.title,
        data.sendPassword ? gallery.password : undefined,
        gallery.expiryDate?.toDate(),
        data.customMessage
      );
      
      // Record the notification attempt in the database
      // This would typically be done by the Cloud Function
      
      setSuccess(true);
      toast.success('Gallery notification request processed!');
      
      // Close modal after a short delay
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error processing notification request:', error);
      toast.error('Failed to process gallery notification');
    } finally {
      setSending(false);
    }
  };
  
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }
  
  if (!gallery) {
    return (
      <div className="p-6">
        <div className="flex items-center text-red-500 mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Gallery not found</span>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Send Gallery Notification
      </h2>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <p className="font-medium">Gallery: {gallery.title}</p>
        {gallery.imageCount > 0 ? (
          <p className="text-sm text-gray-600">{gallery.imageCount} images</p>
        ) : (
          <p className="text-sm text-red-500">No images in this gallery</p>
        )}
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Client Email
          </label>
          <input
            id="clientEmail"
            type="email"
            className={`w-full px-3 py-2 border rounded-md ${errors.clientEmail ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="client@example.com"
            {...register('clientEmail', { 
              required: 'Client email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.clientEmail && (
            <p className="mt-1 text-sm text-red-500">{errors.clientEmail.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Message (optional)
          </label>
          <textarea
            id="customMessage"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Add a personal message to your client..."
            {...register('customMessage')}
          />
        </div>
        
        {gallery.isPasswordProtected && (
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded"
                {...register('sendPassword')}
              />
              <span className="ml-2 text-sm text-gray-700">
                Include gallery password in the email
              </span>
            </label>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={sending}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className={`px-4 py-2 rounded-md flex items-center ${
              success 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            disabled={sending || success || gallery.imageCount === 0}
          >
            {sending ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                <span>Sending...</span>
              </>
            ) : success ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                <span>Sent!</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                <span>Send Notification</span>
              </>
            )}
          </button>
        </div>
        
        {gallery.imageCount === 0 && (
          <p className="text-sm text-red-500 mt-2">
            Cannot send notification for an empty gallery. Please upload images first.
          </p>
        )}
      </form>
    </div>
  );
}
