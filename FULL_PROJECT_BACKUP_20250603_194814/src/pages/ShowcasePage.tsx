import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import { useInView } from 'react-intersection-observer';

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

const ShowcasePage: React.FC = () => {
  const { ref: galleryRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

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

  // Get featured gallery
  const featuredGallery = weddingGalleries.find(gallery => gallery.featured) || weddingGalleries[0];
  
  // Get remaining galleries
  const remainingGalleries = weddingGalleries.filter(gallery => gallery.id !== featuredGallery.id);

  return (
    <>
      <SEO 
        title="Wedding Photography Showcase in NJ | Hariel Xavier Photography"
        description="Explore our wedding photography showcase featuring stunning celebrations at top New Jersey venues. View our portfolio of real weddings and book your NJ wedding photographer today."
        keywords="NJ wedding photographer, New Jersey wedding photography, wedding photography showcase, luxury wedding photos NJ, Hariel Xavier Photography, wedding venues NJ"
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
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">Wedding Photography Showcase</h1>
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
      
      <Footer />
    </>
  );
};

export default ShowcasePage;
