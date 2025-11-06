import { Download, Gift, FileText, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LeadMagnetProps {
  title: string;
  description: string;
  ctaText: string;
  pdfUrl: string;
  imageUrl?: string;
  type?: 'timeline' | 'venue' | 'guide';
}

export function LeadMagnetCard({ title, description, ctaText, pdfUrl, imageUrl, type = 'guide' }: LeadMagnetProps) {
  const icons = {
    timeline: FileText,
    venue: MapPin,
    guide: Gift
  };
  
  const Icon = icons[type];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100 hover:border-rose-dark/30 transition-all duration-300 hover:shadow-2xl group">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            FREE
          </div>
        </div>
      )}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-light to-rose-dark rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-serif text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
        <a
          href={pdfUrl}
          download
          className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 group-hover:scale-105 w-full justify-center"
        >
          <Download className="w-5 h-5" />
          {ctaText}
        </a>
      </div>
    </div>
  );
}

export default function LeadMagnetBanner() {
  const leadMagnets = [
    {
      title: "Wedding Photography Timeline",
      description: "The complete guide to planning your wedding day photography timeline. Learn when to schedule each moment for perfect lighting and stress-free photos.",
      ctaText: "Download Free Guide",
      pdfUrl: "/MoStuff/WeddingGuide.pdf",
      imageUrl: "https://res.cloudinary.com/dos0qac90/image/upload/v1761593377/hariel-xavier-photography/MoStuff/WeddingGuide.png",
      type: 'timeline' as const
    },
    {
      title: "What to Wear Guide",
      description: "Expert styling tips for your engagement session. Color coordination, seasonal suggestions, and outfit ideas that photograph beautifully.",
      ctaText: "Get Style Guide",
      pdfUrl: "/MoStuff/whattowear.pdf",
      imageUrl: "https://res.cloudinary.com/dos0qac90/image/upload/v1761593384/hariel-xavier-photography/MoStuff/whattowear.png",
      type: 'guide' as const
    },
    {
      title: "NJ Venue Photography Guide",
      description: "Best photo locations at popular New Jersey wedding venues. Insider tips on lighting, timing, and hidden gems from 300+ weddings.",
      ctaText: "Download Venue Guide",
      pdfUrl: "#", // This would be a new PDF to create
      type: 'venue' as const
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-rose-light/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-6 py-2 rounded-full font-semibold mb-6">
            <Gift className="w-5 h-5" />
            FREE RESOURCES
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
            Free Wedding Planning Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Download our free guides to help you plan the perfect wedding day photography
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {leadMagnets.map((magnet, index) => (
            <LeadMagnetCard key={index} {...magnet} />
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto border-2 border-rose-light">
            <h3 className="text-2xl font-serif mb-4">Want More?</h3>
            <p className="text-gray-600 mb-6">
              Get personalized advice for your wedding day. Book a free 30-minute consultation—no pressure, just helpful planning tips from someone who's photographed 300+ weddings.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-dark to-rose-light text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300"
            >
              Book Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

