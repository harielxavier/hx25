import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Filter, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { HowItsGoingSubmission, MILESTONE_TYPES } from '../types/howItsGoing';
import { mockGalleryData } from '../data/mockHowItsGoingData';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import SEOHead from '../components/common/SEOHead';

export default function HowItsGoingPage() {
  const [submissions, setSubmissions] = useState<HowItsGoingSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<HowItsGoingSubmission[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredSubmissions(submissions);
    } else {
      setFilteredSubmissions(
        submissions.filter(sub => sub.milestoneType === selectedFilter)
      );
    }
  }, [selectedFilter, submissions]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('how_its_going')
        .select('*')
        .eq('status', 'approved')
        .order('sort_order', { ascending: false })
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      
      // Use real data if available, otherwise use mock data
      if (data && data.length > 0) {
        setSubmissions(data);
        setFilteredSubmissions(data);
      } else {
        setSubmissions(mockGalleryData);
        setFilteredSubmissions(mockGalleryData);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      // Fallback to mock data on error
      setSubmissions(mockGalleryData);
      setFilteredSubmissions(mockGalleryData);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { value: 'all', label: '💕 All Stories', count: submissions.length },
    ...Object.entries(MILESTONE_TYPES).map(([key, value]) => ({
      value: key,
      label: value.label,
      count: submissions.filter(s => s.milestoneType === key).length
    }))
  ];

  return (
    <>
      <SEOHead
        title="How It's Going - Love Stories Continue | Hariel Xavier Photography"
        description="See where our couples are now! From wedding day to honeymoons, anniversaries, and growing families - real love stories that keep growing."
        keywords={['wedding photography follow-up', 'couple testimonials', 'real weddings', 'life after wedding', 'honeymoon photos']}
      />

      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-rose-50 via-white to-amber-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-rose-300 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-amber-300 blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center mb-6">
            <Heart className="w-6 h-6 text-rose-500 mr-3" fill="currentColor" />
            <span className="text-sm uppercase tracking-[0.3em] text-gray-600">Love Stories Continue</span>
            <Heart className="w-6 h-6 text-rose-500 ml-3" fill="currentColor" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-serif mb-6">
            How It's Going 💕
          </h1>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            We don't just capture wedding days—we capture the beginning of forever. 
            See where our couples' love stories have taken them: from honeymoon adventures 
            to growing families and milestone celebrations.
          </p>

          <Link
            to="/how-its-going/submit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white hover:bg-gray-800 transition-all duration-300 text-lg font-medium group"
          >
            <Upload className="w-5 h-5" />
            Share Your Story
          </Link>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 bg-white sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500" />
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-6 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                  selectedFilter === filter.value
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} {filter.count > 0 && `(${filter.count})`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-600">Loading beautiful stories...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-4">No stories yet in this category</p>
              <Link
                to="/how-its-going/submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-800 transition-all"
              >
                Be the first to share!
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSubmissions.map((submission) => {
                const milestone = MILESTONE_TYPES[submission.milestoneType as keyof typeof MILESTONE_TYPES];
                return (
                  <div
                    key={submission.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    {/* Before/After Images */}
                    <div className="grid grid-cols-2 gap-0">
                      <div className="relative group">
                        <div className="absolute top-2 left-2 z-10 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                          STARTED
                        </div>
                        <img
                          src={submission.weddingPhoto}
                          alt={`${submission.coupleNames} wedding`}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="relative group">
                        <div className="absolute top-2 left-2 z-10 bg-rose-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                          <span>GOING</span>
                          <span>{milestone.emoji}</span>
                        </div>
                        <img
                          src={submission.currentPhoto}
                          alt={`${submission.coupleNames} now`}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${milestone.color}`}>
                        {milestone.label}
                      </span>
                      
                      <h3 className="text-xl font-serif mb-2">{submission.coupleNames}</h3>
                      
                      {submission.location && (
                        <p className="text-sm text-gray-500 mb-3">📍 {submission.location}</p>
                      )}
                      
                      <p className="text-gray-700 italic line-clamp-3">"{submission.caption}"</p>
                      
                      <p className="text-xs text-gray-400 mt-4">
                        Wedding: {new Date(submission.weddingDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-black to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-rose-400" fill="currentColor" />
          <h2 className="text-4xl font-serif mb-6">Want to Share Your Journey?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            We'd love to see how your love story has unfolded! Share your "How It's Going" moment with us.
          </p>
          <Link
            to="/how-its-going/submit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black hover:bg-gray-100 transition-all duration-300 text-lg font-medium"
          >
            <Upload className="w-5 h-5" />
            Submit Your Story
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
