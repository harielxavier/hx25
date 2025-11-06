import { useState } from 'react';
import { Play, Quote, Star } from 'lucide-react';

interface VideoTestimonialProps {
  name: string;
  location: string;
  quote: string;
  videoUrl?: string;
  thumbnailUrl: string;
  venue: string;
}

function VideoTestimonialCard({ name, location, quote, videoUrl, thumbnailUrl, venue }: VideoTestimonialProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Video/Thumbnail */}
      <div className="relative aspect-video bg-gray-900 group cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
        {!isPlaying ? (
          <>
            <img 
              src={thumbnailUrl} 
              alt={`${name}'s testimonial`}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Play className="w-8 h-8 text-rose-600 ml-1" fill="currentColor" />
              </div>
            </div>
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full"
              />
            ) : (
              <p className="text-white">Video coming soon!</p>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-start gap-4 mb-4">
          <Quote className="w-8 h-8 text-rose-400 flex-shrink-0" />
          <p className="text-gray-700 italic leading-relaxed">
            "{quote}"
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div>
            <p className="font-semibold text-gray-900 text-lg">{name}</p>
            <p className="text-gray-500 text-sm">{location}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Married at</p>
            <p className="text-sm font-medium text-gray-700">{venue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoTestimonials() {
  const testimonials: VideoTestimonialProps[] = [
    {
      name: "Sarah & Michael",
      location: "Morris County, NJ",
      quote: "Mauricio didn't just photograph our wedding—he became part of it. Every time we look at our photos, we're transported back to that perfect day.",
      thumbnailUrl: "https://res.cloudinary.com/dos0qac90/image/upload/v1761593258/hariel-xavier-photography/MoStuff/LandingPage/HeroPage.jpg",
      venue: "Perona Farms",
      videoUrl: undefined // Placeholder for future video
    },
    {
      name: "Amanda & Alex",
      location: "Sussex County, NJ",
      quote: "We were nervous about being in front of the camera, but Mauricio made us feel so comfortable. The photos are absolutely stunning—better than we ever imagined!",
      thumbnailUrl: "https://res.cloudinary.com/dos0qac90/image/upload/v1761593377/hariel-xavier-photography/MoStuff/WeddingGuide.png",
      venue: "The Farmhouse",
      videoUrl: undefined
    },
    {
      name: "Roberto & Maria",
      location: "Bergen County, NJ",
      quote: "From the moment Mauricio showed up, his fun personality and energy made our day even more special. He kept us relaxed and the photos turned out amazing!",
      thumbnailUrl: "https://res.cloudinary.com/dos0qac90/image/upload/v1761593385/hariel-xavier-photography/MoStuff/portrait.jpg",
      venue: "Crystal Plaza",
      videoUrl: undefined
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-rose-light/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full font-semibold mb-6">
            <Star className="w-5 h-5 fill-current" />
            5-STAR REVIEWS
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
            What Couples Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it—hear from real couples who trusted us with their big day
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {testimonials.map((testimonial, index) => (
            <VideoTestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6">
            <div className="bg-white rounded-xl shadow-lg px-8 py-4 border-2 border-yellow-400">
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-yellow-500 fill-current" />
                  ))}
                </div>
                <div className="text-left">
                  <p className="font-bold text-2xl text-gray-900">5.0</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg px-8 py-4">
              <p className="text-3xl font-bold text-gray-900">300+</p>
              <p className="text-sm text-gray-600">Happy Couples</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg px-8 py-4">
              <p className="text-3xl font-bold text-gray-900">100%</p>
              <p className="text-sm text-gray-600">Would Recommend</p>
            </div>
          </div>

          <div className="mt-12">
            <a 
              href="https://www.theknot.com/marketplace/hariel-xavier-photography"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300"
            >
              Read More Reviews on The Knot & WeddingWire
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

