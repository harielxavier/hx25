import { MapPin, Check, Camera, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Venue {
  name: string;
  location: string;
  weddingsShot: number;
  imageUrl: string;
  slug?: string;
}

export default function VenueAuthority() {
  const venues: Venue[] = [
    {
      name: "Perona Farms",
      location: "Andover, NJ",
      weddingsShot: 25,
      imageUrl: "https://res.cloudinary.com/dos0qac90/image/upload/v1761593258/hariel-xavier-photography/MoStuff/LandingPage/HeroPage.jpg"
    },
    {
      name: "The Farmhouse at The Grand Colonial",
      location: "Hampton, NJ",
      weddingsShot: 18,
      imageUrl: "https://res.cloudinary.com/dos0qac90/image/upload/v1761593377/hariel-xavier-photography/MoStuff/WeddingGuide.png"
    },
    {
      name: "The Club at Picatinny",
      location: "Picatinny Arsenal, NJ",
      weddingsShot: 15,
      imageUrl: "https://res.cloudinary.com/dos0qac90/image/upload/v1761593382/hariel-xavier-photography/MoStuff/club/pic8.jpg",
      slug: "/picatinny-club"
    },
    {
      name: "Crystal Plaza",
      location: "Livingston, NJ",
      weddingsShot: 22,
      imageUrl: "https://res.cloudinary.com/dos0qac90/image/upload/v1761593385/hariel-xavier-photography/MoStuff/portrait.jpg"
    },
    {
      name: "Farmstead Golf & Country Club",
      location: "Lafayette, NJ",
      weddingsShot: 12,
      imageUrl: "https://res.cloudinary.com/dos0qac90/image/upload/v1761593388/hariel-xavier-photography/MoStuff/images/morganvideocover.jpg"
    },
    {
      name: "The Manor",
      location: "West Orange, NJ",
      weddingsShot: 20,
      imageUrl: "https://res.cloudinary.com/dos0qac90/image/upload/v1761593384/hariel-xavier-photography/MoStuff/whattowear.png"
    }
  ];

  const totalVenues = 50;
  const totalWeddings = venues.reduce((sum, venue) => sum + venue.weddingsShot, 0);

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-6 py-2 rounded-full font-semibold mb-6">
            <MapPin className="w-5 h-5" />
            VENUE EXPERTISE
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
            We Know Your Venue
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            After shooting 300+ weddings at 50+ venues across NJ, NY, and PA, we know the best photo spots, perfect lighting times, and hidden gems at each location.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white rounded-xl shadow-lg px-6 py-4 border-2 border-gray-100">
              <p className="text-3xl font-bold text-gray-900">{totalVenues}+</p>
              <p className="text-sm text-gray-600">Venues Photographed</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg px-6 py-4 border-2 border-gray-100">
              <p className="text-3xl font-bold text-gray-900">300+</p>
              <p className="text-sm text-gray-600">Weddings Shot</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg px-6 py-4 border-2 border-gray-100">
              <p className="text-3xl font-bold text-gray-900">3 States</p>
              <p className="text-sm text-gray-600">NJ, NY, PA</p>
            </div>
          </div>
        </div>

        {/* Featured Venues */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-2xl font-serif mb-8 text-center">Venues Where We've Shot Multiple Weddings</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {venues.map((venue, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={venue.imageUrl} 
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <Camera className="w-4 h-4" />
                      <span className="text-sm font-semibold">{venue.weddingsShot} weddings photographed</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-serif text-xl mb-2 text-gray-900 group-hover:text-rose-dark transition-colors">
                    {venue.name}
                  </h4>
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    {venue.location}
                  </div>
                  {venue.slug && (
                    <Link 
                      to={venue.slug}
                      className="inline-flex items-center text-rose-dark hover:text-rose-darker font-medium text-sm group-hover:translate-x-2 transition-transform"
                    >
                      View Gallery
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Venue Knowledge Matters */}
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-rose-50 to-white rounded-3xl p-12 shadow-xl border border-rose-100">
          <h3 className="text-3xl font-serif mb-8 text-center text-gray-900">Why Venue Experience Matters</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 text-gray-900">Best Photo Locations</h4>
                <p className="text-gray-600">
                  We know exactly where the best natural light is, which spots photograph beautifully, and where to go for stunning sunset shots.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 text-gray-900">Perfect Timing</h4>
                <p className="text-gray-600">
                  Understanding how light changes throughout the day at each venue means we can recommend the ideal schedule for your photos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 text-gray-900">Relationships with Venue Staff</h4>
                <p className="text-gray-600">
                  Our established relationships mean seamless coordination and sometimes access to special areas that other photographers might not get.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 text-gray-900">Backup Plans</h4>
                <p className="text-gray-600">
                  If weather doesn't cooperate, we already know the best indoor alternatives and covered spots at your venue.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-serif mb-6 text-gray-900">Getting Married at One of These Venues?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's talk about the best photo opportunities at your venue. We'll share insider tips and create a timeline that captures every beautiful moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all"
            >
              Tell Us About Your Venue
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/showcase"
              className="inline-flex items-center gap-2 border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-all"
            >
              View Our Portfolio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

