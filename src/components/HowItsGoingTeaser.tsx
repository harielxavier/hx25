import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { HowItsGoingSubmission, MILESTONE_TYPES } from '../types/howItsGoing';
import { mockHowItsGoingData } from '../data/mockHowItsGoingData';

export default function HowItsGoingTeaser() {
  const [featured, setFeatured] = useState<HowItsGoingSubmission[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedSubmissions();
  }, []);

  useEffect(() => {
    if (featured.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featured.length);
      }, 8000); // Change every 8 seconds

      return () => clearInterval(timer);
    }
  }, [featured.length]);

  const fetchFeaturedSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('how_its_going')
        .select('*')
        .eq('status', 'approved')
        .eq('featured', true)
        .order('sort_order', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      // Use real data if available, otherwise use mock data
      if (data && data.length > 0) {
        setFeatured(data);
      } else {
        setFeatured(mockHowItsGoingData);
      }
    } catch (error) {
      console.error('Error fetching featured submissions:', error);
      // Fallback to mock data on error
      setFeatured(mockHowItsGoingData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (featured.length === 0) return null;

  const current = featured[currentIndex];
  const milestone = MILESTONE_TYPES[current.milestoneType as keyof typeof MILESTONE_TYPES];

  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 via-white to-amber-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-rose-200 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-amber-200 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <Heart className="w-5 h-5 text-rose-500 mr-2" fill="currentColor" />
            <span className="text-sm uppercase tracking-[0.3em] text-gray-600">Love Stories Continue</span>
            <Heart className="w-5 h-5 text-rose-500 ml-2" fill="currentColor" />
          </div>
          <h2 className="text-5xl font-serif mb-4">
            How It's Going 💕
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            See where our couples are now - from wedding day to their beautiful journeys together
          </p>
        </div>

        {/* Featured Story - Single Highlight with Animation */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-0">
              {/* How It Started */}
              <div className="relative group">
                <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  HOW IT STARTED
                </div>
                <img
                  src={current.weddingPhoto}
                  alt={`${current.coupleNames} wedding photo`}
                  className="w-full h-full object-cover min-h-[400px] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <p className="text-white text-sm mb-1">Wedding Day</p>
                  <p className="text-white/80 text-xs">
                    {new Date(current.weddingDate).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* How It's Going */}
              <div className="relative group">
                <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <span>HOW IT'S GOING</span>
                  <span className="text-lg">{milestone.emoji}</span>
                </div>
                <img
                  src={current.currentPhoto}
                  alt={`${current.coupleNames} now`}
                  className="w-full h-full object-cover min-h-[400px] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${milestone.color}`}>
                    {milestone.label}
                  </span>
                  {current.location && (
                    <p className="text-white/80 text-xs mb-2">📍 {current.location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Caption & CTA */}
            <div className="p-8 bg-white">
              <h3 className="text-2xl font-serif mb-3">{current.coupleNames}</h3>
              <p className="text-gray-700 text-lg mb-6 italic">"{current.caption}"</p>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {featured.length} {featured.length === 1 ? 'story' : 'stories'} shared
                </p>
                <div className="flex gap-3">
                  <Link
                    to="/how-its-going/submit"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-all duration-300 text-sm font-medium"
                  >
                    Share Yours
                  </Link>
                  <Link
                    to="/how-its-going"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 text-sm font-medium group"
                  >
                    See All Stories
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          {featured.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {featured.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-black w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`View story ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
