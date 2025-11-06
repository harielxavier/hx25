import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AvailabilityWidgetProps {
  year?: number;
  compact?: boolean;
}

export default function AvailabilityWidget({ year = 2025, compact = false }: AvailabilityWidgetProps) {
  // This would ideally come from a database/API
  const availability2025 = {
    total: 40,
    booked: 32,
    available: 8,
    popularMonths: ['May', 'June', 'September', 'October']
  };

  const availability2026 = {
    total: 40,
    booked: 8,
    available: 32,
    popularMonths: ['May', 'June', 'September', 'October']
  };

  const currentAvailability = year === 2025 ? availability2025 : availability2026;
  const percentageBooked = (currentAvailability.booked / currentAvailability.total) * 100;

  if (compact) {
    return (
      <div className="inline-block bg-gradient-to-r from-rose-600 to-rose-700 text-white px-6 py-3 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5" />
          <div>
            <p className="font-bold text-sm">
              {year}: {currentAvailability.booked}/{currentAvailability.total} Saturdays Booked
            </p>
            <p className="text-xs opacity-90">Only {currentAvailability.available} dates remaining</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-rose-600 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <AlertCircle className="w-4 h-4" />
              LIMITED AVAILABILITY
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-4">
              Your Date Might Not Last
            </h2>
            <p className="text-xl text-gray-300">
              We only shoot 40 weddings per year to ensure exceptional quality for each couple
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* 2025 Card */}
            <div className="bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-serif">2025 Availability</h3>
                <div className="bg-rose-600 px-4 py-2 rounded-full text-sm font-bold">
                  {currentAvailability.available} LEFT
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Saturdays Booked</span>
                  <span className="font-bold">{availability2025.booked}/{availability2025.total}</span>
                </div>
                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-rose-700 transition-all duration-1000"
                    style={{ width: `${(availability2025.booked / availability2025.total) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-rose-400" />
                  <span>Peak season dates filling fast</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span>Only {availability2025.available} Saturday dates remain</span>
                </div>
              </div>

              <p className="text-sm text-gray-400 italic">
                "We waited too long and Mauricio was already booked. Don't make our mistake!" - Past inquiry
              </p>
            </div>

            {/* 2026 Card */}
            <div className="bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-serif">2026 Availability</h3>
                <div className="bg-green-600 px-4 py-2 rounded-full text-sm font-bold">
                  NOW BOOKING
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Saturdays Booked</span>
                  <span className="font-bold">{availability2026.booked}/{availability2026.total}</span>
                </div>
                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-700 transition-all duration-1000"
                    style={{ width: `${(availability2026.booked / availability2026.total) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Most dates still available</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>$275 early bird credit when you book now</span>
                </div>
              </div>

              <p className="text-sm text-gray-400">
                <strong>Smart tip:</strong> Most couples book 12-18 months in advance. Prime dates (May-Oct) go first.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-serif mb-4">First-Come, First-Serve</h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
              Your date isn't reserved until you book. If your date is available today, we can't guarantee it will be tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-rose-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                <Calendar className="w-5 h-5" />
                Check If Your Date Is Available
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-rose-700 transition-all"
              >
                View Packages & Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

