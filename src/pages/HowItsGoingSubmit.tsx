import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MILESTONE_TYPES } from '../types/howItsGoing';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import SEOHead from '../components/common/SEOHead';

export default function HowItsGoingSubmit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    coupleNames: '',
    weddingDate: '',
    milestoneType: 'honeymoon',
    location: '',
    caption: '',
    agreeToTerms: false
  });

  const [weddingPhoto, setWeddingPhoto] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<File | null>(null);
  const [weddingPhotoPreview, setWeddingPhotoPreview] = useState<string>('');
  const [currentPhotoPreview, setCurrentPhotoPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'wedding' | 'current') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'wedding') {
        setWeddingPhoto(file);
        setWeddingPhotoPreview(URL.createObjectURL(file));
      } else {
        setCurrentPhoto(file);
        setCurrentPhotoPreview(URL.createObjectURL(file));
      }
    }
  };

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('how-its-going')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('how-its-going')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!weddingPhoto || !currentPhoto) {
      setError('Please upload both photos');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms');
      return;
    }

    setLoading(true);

    try {
      // Upload images
      const weddingPhotoUrl = await uploadImage(weddingPhoto, 'wedding-photos');
      const currentPhotoUrl = await uploadImage(currentPhoto, 'current-photos');

      // Insert submission
      const { error: insertError } = await supabase
        .from('how_its_going')
        .insert([{
          couple_names: formData.coupleNames,
          wedding_date: formData.weddingDate,
          milestone_type: formData.milestoneType,
          location: formData.location || null,
          caption: formData.caption,
          wedding_photo: weddingPhotoUrl,
          current_photo: currentPhotoUrl,
          status: 'pending',
          featured: false,
          sort_order: 0
        }]);

      if (insertError) throw insertError;

      setSubmitted(true);
      setTimeout(() => {
        navigate('/how-its-going');
      }, 3000);
    } catch (err) {
      console.error('Error submitting:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50 py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-4xl font-serif mb-4">Thank You! 💕</h2>
            <p className="text-lg text-gray-700 mb-4">
              Your story has been submitted and is awaiting approval. We'll review it shortly!
            </p>
            <p className="text-gray-600">
              Redirecting you back...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Share Your Story - How It's Going | Hariel Xavier Photography"
        description="Share your love story! Submit your wedding and current photos to show how your journey continues."
      />

      <Navigation />

      <section className="pt-32 pb-20 bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" fill="currentColor" />
            <h1 className="text-5xl font-serif mb-4">Share Your Story 💕</h1>
            <p className="text-lg text-gray-700">
              We'd love to see how your love story has unfolded! Fill out the form below to share your journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Couple Names */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Names *
              </label>
              <input
                type="text"
                required
                value={formData.coupleNames}
                onChange={(e) => setFormData({ ...formData, coupleNames: e.target.value })}
                placeholder="e.g., Sarah & Mike"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Wedding Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wedding Date *
              </label>
              <input
                type="date"
                required
                value={formData.weddingDate}
                onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Milestone Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's New? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(MILESTONE_TYPES).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData({ ...formData, milestoneType: key })}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.milestoneType === key
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{value.emoji}</span>
                    <span className="text-sm font-medium">{value.label.replace(/[\u{1F334}\u{1F382}\u{1F476}\u{1F3E1}\u{1F495}\u{2728}]\s/u, '')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Bali, Indonesia"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Caption */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tell Us About It! *
              </label>
              <textarea
                required
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Share what's been happening in your journey together..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">{formData.caption.length}/500 characters</p>
            </div>

            {/* Photo Uploads */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Wedding Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wedding Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  {weddingPhotoPreview ? (
                    <div className="relative">
                      <img src={weddingPhotoPreview} alt="Wedding preview" className="w-full h-48 object-cover rounded-lg mb-2" />
                      <button
                        type="button"
                        onClick={() => {
                          setWeddingPhoto(null);
                          setWeddingPhotoPreview('');
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload "How It Started"</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'wedding')}
                        className="hidden"
                        id="wedding-photo"
                      />
                      <label
                        htmlFor="wedding-photo"
                        className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm"
                      >
                        Choose File
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Current Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  {currentPhotoPreview ? (
                    <div className="relative">
                      <img src={currentPhotoPreview} alt="Current preview" className="w-full h-48 object-cover rounded-lg mb-2" />
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPhoto(null);
                          setCurrentPhotoPreview('');
                        }}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload "How It's Going"</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'current')}
                        className="hidden"
                        id="current-photo"
                      />
                      <label
                        htmlFor="current-photo"
                        className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm"
                      >
                        Choose File
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="mb-8">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-sm text-gray-600">
                  I give permission for Hariel Xavier Photography to share my photos on their website and social media. 
                  I understand my submission will be reviewed before being published.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit My Story 💕'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
