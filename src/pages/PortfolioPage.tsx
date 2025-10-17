import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Calendar, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import { useInView } from 'react-intersection-observer';
import { getAllPosts } from '../services/blogService';

interface WeddingGalleryItem {
  id: string;
  title: string;
  coupleName: string;
  venue: string;
  location: string;
  imageUrl: string;
  linkUrl: string;
  featured?: boolean;
}

interface EngagementPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  location: string;
}

const PortfolioPage: React.FC = () => {
  const { ref: galleryRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [latestBlogPosts, setLatestBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const posts = await getAllPosts();
        // Get the 3 most recent published posts
        const recentPosts = posts
          .sort((a, b) => {
            const aTime = a.publishedAt ? a.publishedAt.seconds : 0;
            const bTime = b.publishedAt ? b.publishedAt.seconds : 0;
            return bTime - aTime;
          })
          .slice(0, 3);
        setLatestBlogPosts(recentPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchLatestBlogs();
  }, []);

  // Example wedding galleries
  const weddingGalleries: WeddingGalleryItem[] = [
    {
      id: 'wedding-gallery-1',
      title: 'Bianca & Jeffrey\'s Wedding',
      coupleName: 'Bianca & Jeffrey',
      venue: 'Park Chateau Estate & Gardens',
      location: 'East Brunswick, NJ',
      imageUrl: '/MoStuff/Featured Wedding/Bianca & Jeffrey\'s Wedding/The Ceremony/Bianca & Jeff_s Wedding-826.jpg',
      linkUrl: '/bianca-jeffrey',
      featured: true
    },
    {
      id: 'wedding-gallery-2',
      title: 'Jackie & Chris\'s Wedding',
      coupleName: 'Jackie & Chris',
      venue: 'The Inn at Millrace Pond',
      location: 'Hope, NJ',
      imageUrl: '/MoStuff/Featured Wedding/Jackie & Chriss Wedding /jmt (44 of 61).jpg',
      linkUrl: '/jackie-chris'
    },
    {
      id: 'wedding-gallery-3',
      title: 'Ansimon & Mina\'s Wedding',
      coupleName: 'Ansimon & Mina',
      venue: 'The Venetian',
      location: 'Garfield, NJ',
      imageUrl: '/MoStuff/Featured Wedding/Ansimon & Mina\'s Wedding/Annie & Steve Ansimon & Mina Wedding additional-1060_websize.jpg',
      linkUrl: '/ansimon-mina'
    },
    {
      id: 'wedding-gallery-4',
      title: 'Karni & Zilvinas\'s Wedding',
      coupleName: 'Karni & Zilvinas',
      venue: 'The Venetian',
      location: 'Garfield, NJ',
      imageUrl: '/MoStuff/Featured Wedding/Karni & Zilnivas/kz & Zilvinas Wedding (1).jpg',
      linkUrl: '/karni-zilvinas'
    },
    {
      id: 'wedding-gallery-5',
      title: 'Crysta & David\'s Wedding',
      coupleName: 'Crysta & David',
      venue: 'Skylands Manor',
      location: 'Ringwood, NJ',
      imageUrl: '/MoStuff/Portfolio/crystadavid/cd14.jpg',
      linkUrl: '/crysta-david'
    },
    {
      id: 'wedding-gallery-6',
      title: 'Anna & Jose\'s Wedding',
      coupleName: 'Anna & Jose',
      venue: 'The Meadow Wood',
      location: 'Randolph, NJ',
      imageUrl: '/view/josethumb.jpg',
      linkUrl: '/ana-jose'
    },
    {
      id: 'wedding-gallery-7',
      title: 'Carolina & Carlos\'s Wedding',
      coupleName: 'Carolina & Carlos',
      venue: 'The Club at Picatinny',
      location: 'Dover, NJ',
      imageUrl: '/MoStuff/club/pic5.jpg',
      linkUrl: '/picatinny-club',
      featured: true
    },
    {
      id: 'wedding-gallery-8',
      title: 'Judy & Mike\'s Wedding',
      coupleName: 'Judy & Mike',
      venue: 'Nanina\'s In the Park',
      location: 'Belleville, NJ',
      imageUrl: '/MoStuff/Featured Wedding/Judy & Mike\'s Wedding/jm1.jpg',
      linkUrl: '/judy-mike'
    },
    {
      id: 'wedding-gallery-9',
      title: 'Amanda & Alex\'s Wedding',
      coupleName: 'Amanda & Alex',
      venue: 'The Mansion on Main Street',
      location: 'Voorhees Township, NJ',
      imageUrl: '/MoStuff/amanda/thumb.jpg',
      linkUrl: '/amanda-alex'
    },
    {
      id: 'wedding-gallery-10',
      title: 'Emily & Ryan\'s Wedding',
      coupleName: 'Emily & Ryan',
      venue: 'Bonnet Island Estate',
      location: 'Manahawkin, NJ',
      imageUrl: '/MoStuff/Featured Wedding/Jackie & Chriss Wedding /jmt (44 of 61).jpg',
      linkUrl: '/emily-ryan'
    },
    {
      id: 'wedding-gallery-11',
      title: 'Lauren & David\'s Wedding',
      coupleName: 'Lauren & David',
      venue: 'Crystal Plaza',
      location: 'Livingston, NJ',
      imageUrl: '/MoStuff/Featured Wedding/Judy & Mike\'s Wedding/jm1.jpg',
      linkUrl: '/lauren-david'
    },
    {
      id: 'wedding-gallery-12',
      title: 'Emma & James\'s Wedding',
      coupleName: 'Emma & James',
      venue: 'The Ryland Inn',
      location: 'Whitehouse Station, NJ',
      imageUrl: '/MoStuff/Featured Wedding/Ansimon & Mina\'s Wedding/Annie & Steve Ansimon & Mina Wedding additional-1060_websize.jpg',
      linkUrl: '/emma-james'
    },
    {
      id: 'wedding-gallery-13',
      title: 'Sophie & Ethan\'s Wedding',
      coupleName: 'Sophie & Ethan',
      venue: 'The Palace at Somerset Park',
      location: 'Somerset, NJ',
      imageUrl: '/MoStuff/Portfolio/crystadavid/cd14.jpg',
      linkUrl: '/sophie-ethan'
    },
    {
      id: 'wedding-gallery-14',
      title: 'Olivia & Noah\'s Wedding',
      coupleName: 'Olivia & Noah',
      venue: 'The Brownstone',
      location: 'Paterson, NJ',
      imageUrl: '/MoStuff/club/pic5.jpg',
      linkUrl: '/olivia-noah'
    },
    {
      id: 'wedding-gallery-15',
      title: 'Rachel & Ben\'s Wedding',
      coupleName: 'Rachel & Ben',
      venue: 'The Ashford Estate',
      location: 'Allentown, NJ',
      imageUrl: '/MoStuff/Featured Wedding/Bianca & Jeffrey\'s Wedding/The Ceremony/Bianca & Jeff_s Wedding-826.jpg',
      linkUrl: '/rachel-ben'
    },
    {
      id: 'wedding-gallery-16',
      title: 'Megan & Tyler\'s Wedding',
      coupleName: 'Megan & Tyler',
      venue: 'Mallard Island Yacht Club',
      location: 'Manahawkin, NJ',
      imageUrl: '/MoStuff/Portfolio/crystadavid/cd14.jpg',
      linkUrl: '/megan-tyler'
    },
    {
      id: 'wedding-gallery-17',
      title: 'Jessica & Matthew\'s Wedding',
      coupleName: 'Jessica & Matthew',
      venue: 'The English Manor',
      location: 'Ocean Township, NJ',
      imageUrl: '/MoStuff/amanda/thumb.jpg',
      linkUrl: '/jessica-matthew'
    }
  ];

  // Engagement photos data
  const engagementPhotos: EngagementPhoto[] = [
    {
      id: 'engagement-1',
      imageUrl: '/images/engagements/engagement-1.jpg',
      caption: 'Alexa & Marc',
      location: 'Sussex County, NJ'
    },
    {
      id: 'engagement-2',
      imageUrl: '/images/engagements/engagement-2.jpg',
      caption: 'Amanda & Matthews',
      location: 'Sparta, NJ'
    },
    {
      id: 'engagement-3',
      imageUrl: '/images/engagements/engagement-3.jpg',
      caption: 'Ansimon & Mina',
      location: 'Newton, NJ'
    },
    {
      id: 'engagement-4',
      imageUrl: '/images/engagements/engagement-4.jpg',
      caption: 'Catherine & Tyler',
      location: 'Sussex County, NJ'
    },
    {
      id: 'engagement-5',
      imageUrl: '/images/engagements/engagement-5.jpg',
      caption: 'Christina & Tiju',
      location: 'Vernon, NJ'
    },
    {
      id: 'engagement-6',
      imageUrl: '/images/engagements/engagement-6.jpg',
      caption: 'Karni & Zilvinas',
      location: 'Sparta, NJ'
    },
    {
      id: 'engagement-7',
      imageUrl: '/images/engagements/engagement-7.jpg',
      caption: 'Liv & Zach',
      location: 'Newton, NJ'
    },
    {
      id: 'engagement-8',
      imageUrl: '/images/engagements/engagement-8.jpg',
      caption: 'Marisa & Kyle',
      location: 'Sussex County, NJ'
    },
    {
      id: 'engagement-9',
      imageUrl: '/images/engagements/engagement-9.jpg',
      caption: 'Noelia & Joe',
      location: 'Hopatcong, NJ'
    },
    {
      id: 'engagement-10',
      imageUrl: '/images/engagements/engagement-10.jpg',
      caption: 'Raquel & TJ',
      location: 'Sparta, NJ'
    },
    {
      id: 'engagement-11',
      imageUrl: '/images/engagements/engagement-11.jpg',
      caption: 'Amanda & Matthews',
      location: 'Sparta, NJ'
    },
    {
      id: 'engagement-12',
      imageUrl: '/images/engagements/engagement-12.jpg',
      caption: 'Ansimon & Mina',
      location: 'Sussex County, NJ'
    },
    {
      id: 'engagement-13',
      imageUrl: '/images/engagements/engagement-13.jpg',
      caption: 'Catherine & Tyler',
      location: 'Newton, NJ'
    },
    {
      id: 'engagement-14',
      imageUrl: '/images/engagements/engagement-14.jpg',
      caption: 'Christina & Tiju',
      location: 'Vernon, NJ'
    },
    {
      id: 'engagement-15',
      imageUrl: '/images/engagements/engagement-15.jpg',
      caption: 'Karni & Zilvinas',
      location: 'Sparta, NJ'
    },
    {
      id: 'engagement-16',
      imageUrl: '/images/engagements/engagement-16.jpg',
      caption: 'Liv & Zach',
      location: 'Sussex County, NJ'
    },
    {
      id: 'engagement-17',
      imageUrl: '/images/engagements/engagement-17.jpg',
      caption: 'Marisa & Kyle',
      location: 'Newton, NJ'
    },
    {
      id: 'engagement-18',
      imageUrl: '/images/engagements/engagement-18.jpg',
      caption: 'Noelia & Joe',
      location: 'Hopatcong, NJ'
    },
    {
      id: 'engagement-19',
      imageUrl: '/images/engagements/engagement-19.jpg',
      caption: 'Raquel & TJ',
      location: 'Sparta, NJ'
    },
    {
      id: 'engagement-20',
      imageUrl: '/images/engagements/engagement-20.jpg',
      caption: 'Amanda & Matthews',
      location: 'Sussex County, NJ'
    },
    {
      id: 'engagement-21',
      imageUrl: '/images/engagements/engagement-21.jpg',
      caption: 'Ansimon & Mina',
      location: 'Sussex County, NJ'
    },
    {
      id: 'engagement-22',
      imageUrl: '/images/engagements/engagement-22.jpg',
      caption: 'Catherine & Tyler',
      location: 'Newton, NJ'
    },
    {
      id: 'engagement-23',
      imageUrl: '/images/engagements/engagement-23.jpg',
      caption: 'Christina & Tiju',
      location: 'Sparta, NJ'
    },
    {
      id: 'engagement-24',
      imageUrl: '/images/engagements/engagement-24.jpg',
      caption: 'Karni & Zilvinas',
      location: 'Hopatcong, NJ'
    },
    {
      id: 'engagement-25',
      imageUrl: '/images/engagements/engagement-25.jpg',
      caption: 'Marisa & Kyle',
      location: 'Vernon, NJ'
    },
    {
      id: 'engagement-26',
      imageUrl: '/images/engagements/engagement-26.jpg',
      caption: 'Noelia & Joe',
      location: 'Sparta, NJ'
    },
    {
      id: 'engagement-27',
      imageUrl: '/images/engagements/engagement-27.jpg',
      caption: 'Raquel & TJ',
      location: 'Newton, NJ'
    },
    {
      id: 'engagement-28',
      imageUrl: '/images/engagements/engagement-28.jpg',
      caption: 'Ansimon & Mina',
      location: 'Sussex County, NJ'
    },
    {
      id: 'engagement-29',
      imageUrl: '/images/engagements/engagement-29.jpg',
      caption: 'Karni & Zilvinas',
      location: 'Sparta, NJ'
    },
    {
      id: 'engagement-30',
      imageUrl: '/images/engagements/engagement-30.jpg',
      caption: 'Marisa & Kyle',
      location: 'Sussex County, NJ'
    }
  ];

  // Get featured gallery
  const featuredGallery = weddingGalleries.find(gallery => gallery.featured) || weddingGalleries[0];
  
  // Get remaining galleries
  const remainingGalleries = weddingGalleries.filter(gallery => gallery.id !== featuredGallery.id);

  return (
    <>
      <SEO 
        title="Wedding Photography Portfolio Sparta NJ | Sussex County Wedding Photos"
        description="View our stunning wedding photography portfolio from Sparta, NJ and Sussex County venues. Real weddings at Picatinny Club and luxury venues. Book your consultation today."
        keywords="wedding photography portfolio Sparta NJ, Sussex County wedding photos, Picatinny Club wedding photographer, New Jersey wedding photography, luxury wedding photographer Sparta, Hariel Xavier Photography"
        ogImage="https://harielxavierphotography.com/MoStuff/LandingPage/HeroPage.jpg"
        type="website"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-black">
          <img 
            src="/MoStuff/LandingPage/HeroPage.jpg" 
            alt="Wedding Photography Showcase" 
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">Wedding Photography Portfolio Sparta NJ</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            A collection of beautiful wedding moments captured across New Jersey
          </p>
        </div>
      </section>
      
      {/* Featured Gallery Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Featured Wedding</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our featured wedding and discover the story behind these beautiful images.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div 
              className="group relative overflow-hidden transition-all duration-700 rounded-lg h-[70vh]"
            >
              <div className="relative h-full w-full overflow-hidden">
                <img 
                  src={featuredGallery.imageUrl} 
                  alt={featuredGallery.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    console.error(`Failed to load image: ${featuredGallery.imageUrl}`);
                    e.currentTarget.src = '/images/placeholders/default.jpg';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-500">
                <h3 className="text-3xl font-serif mb-3">{featuredGallery.coupleName}</h3>
                <div className="flex items-center text-white/80 mb-2">
                  <span className="mr-4">{featuredGallery.venue}</span>
                </div>
                <div className="flex items-center text-white/70 mb-6">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{featuredGallery.location}</span>
                </div>
                <Link 
                  to={featuredGallery.linkUrl}
                  className="inline-flex items-center bg-white text-black px-6 py-3 hover:bg-gray-100 transition-colors"
                >
                  View Wedding Gallery
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery Grid Section */}
      <section 
        ref={galleryRef}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">More Beautiful Weddings</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover more of our wedding photography across New Jersey venues.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingGalleries.slice(0, 9).map((gallery, index) => (
              <div 
                key={gallery.id}
                className={`group relative overflow-hidden transition-all duration-700 rounded-lg ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms` 
                }}
              >
                <div className="relative h-80 w-full overflow-hidden">
                  <img 
                    src={gallery.imageUrl} 
                    alt={gallery.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      console.error(`Failed to load image: ${gallery.imageUrl}`);
                      e.currentTarget.src = '/images/placeholders/default.jpg';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                  <h3 className="text-2xl font-serif mb-2">{gallery.coupleName}</h3>
                  <div className="flex items-center text-white/80 mb-2">
                    <span className="mr-4">{gallery.venue}</span>
                  </div>
                  <div className="flex items-center text-white/70 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{gallery.location}</span>
                  </div>
                  <Link 
                    to={gallery.linkUrl}
                    className="inline-flex items-center text-white border-b border-white pb-1 hover:text-rose-200 hover:border-rose-200 transition-colors"
                  >
                    View Wedding
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Removed link to /wedding as per user request */}
        </div>
      </section>
      
      {/* Engagement Photos Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Engagement Sessions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Intimate moments and authentic connections captured during engagement photography sessions across Sussex County, Sparta, Newton, Vernon, and Hopatcong, New Jersey. Professional engagement photography that tells your unique love story.
            </p>
          </div>
          
          {/* Masonry Grid for Engagement Photos */}
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {engagementPhotos.map((photo, index) => (
              <div 
                key={photo.id}
                className="break-inside-avoid group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.caption}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      console.error(`Failed to load engagement image: ${photo.imageUrl}`);
                      e.currentTarget.src = '/images/placeholders/portrait.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-medium">{photo.caption}</p>
                      <p className="text-xs text-white/80">{photo.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8">Contact Me</h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-12">
            Ready to capture your story? Fill out the form below to get in touch!
          </p>
          <div className="max-w-2xl mx-auto">
            <iframe height="699" style={{minWidth: '100%', maxWidth: '600px', border: 0, margin: '0 auto'}} id="sn-form-09sk9"
              src="https://app.studioninja.co/contactform/parser/0a800fc8-7fbb-1621-817f-cbe6e7e26016/0a800fc8-7fbb-1621-817f-d37610217750"
              allowFullScreen>
            </iframe>
            <script type="text/javascript" data-iframe-id="sn-form-09sk9"
              src="https://app.studioninja.co/client-assets/form-render/assets/scripts/iframeResizer.js"></script>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Latest from Our Blog</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover wedding photography tips, venue highlights, and behind-the-scenes stories from our recent work.
            </p>
          </div>
          
          {latestBlogPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {latestBlogPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholders/default.jpg';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{post.publishedAt ? new Date(post.publishedAt.seconds * 1000).toLocaleDateString() : 'Recently'}</span>
                      <Clock className="w-4 h-4 ml-4 mr-2" />
                      <span>{post.readTime || '5'} min read</span>
                    </div>
                    
                    <h3 className="text-xl font-serif mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-accent hover:text-rose-dark font-medium transition-colors"
                    >
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center bg-gradient-to-r from-accent to-rose-dark text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:from-rose-dark hover:to-accent transform hover:-translate-y-1"
            >
              View All Blog Posts
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default PortfolioPage;
