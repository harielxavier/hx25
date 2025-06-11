import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'; // Added specific event types
import { MapPin, Sun, Clock, Calendar, Camera } from 'lucide-react';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';

// --- Type Definitions ---
interface Coordinates {
  lat: number;
  lng: number;
}

interface Venue {
  id: string;
  name: string;
  address: string;
  county: string;
  coordinates: Coordinates;
  notes?: string; // Optional venue-specific notes
}

interface WeatherForecast {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    // Add other relevant main properties if needed
  };
  weather: {
    main: string;
    description: string;
    // Add other relevant weather properties if needed
  }[];
  wind: {
    speed: number;
    // Add other relevant wind properties if needed
  };
  clouds: {
    all: number; // Cloudiness percentage
  };
  // Add other relevant forecast properties if needed
}

interface WeatherData {
  list: WeatherForecast[];
  // Add other properties from the API response if needed (e.g., city info)
}

interface ResultsState {
  venue: string;
  date: string;
  time: string;
  isDST: string;
  sunPosition: string; // Placeholder type, replace with actual calculation result type
  lightCondition: string; // Placeholder type
  goldenHour: string; // Placeholder type
  recommendations: string[]; // Placeholder type
  season: string; // Placeholder type
  seasonalNotes: string; // Placeholder type
  venueNotes: string;
  error?: string; // Optional error message
}

// --- Component ---
const VenueLightingTool: React.FC = () => { // Explicitly type as React Functional Component
  const [venue, setVenue] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('17:00');
  const [results, setResults] = useState<ResultsState | null>(null); // Typed state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null); // Typed state
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null); // Typed state
  const [coordinates, setCoordinates] = useState<Coordinates | { lat: null; lng: null }>({ lat: null, lng: null }); // Typed state

  // Helper function to check if a date is within Daylight Saving Time
  const isDateInDST = (date: Date): boolean => { // Typed parameter and return
    const year = date.getFullYear();
    const dstStart = new Date(year, 2, 1); // March 1
    const dstEnd = new Date(year, 10, 1); // November 1
    dstStart.setDate(dstStart.getDate() + (14 - dstStart.getDay()) % 7);
    dstEnd.setDate(dstEnd.getDate() + (7 - dstEnd.getDay()) % 7);
    return date >= dstStart && date < dstEnd;
  };

  // Function to get weather forecast for specific time
  const getWeatherForTime = (
    weatherData: WeatherData | null, // Typed parameter
    targetDate: string, // Typed parameter
    targetTime: string // Typed parameter
  ): WeatherForecast | null => { // Typed return
    try {
      if (!weatherData || !weatherData.list || !weatherData.list.length) return null;

      const [hours, minutes] = targetTime.split(':').map(Number);
      const targetDateTime = new Date(targetDate);
      targetDateTime.setHours(hours, minutes, 0, 0);
      const targetTimestamp = targetDateTime.getTime();

      let closestForecast: WeatherForecast | null = null; // Typed variable
      let closestDiff = Infinity;

      weatherData.list.forEach((forecast: WeatherForecast) => { // Typed parameter
        const forecastTime = new Date(forecast.dt * 1000);
        const diff = Math.abs(forecastTime.getTime() - targetTimestamp);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestForecast = forecast;
        }
      });
      return closestForecast;
    } catch (error) {
      console.error('Error getting weather for time:', error);
      return null;
    }
  };

  // Comprehensive New Jersey venues list organized by county for SEO with coordinates
  const venues: Venue[] = [ // Typed array
    // (Venue data remains the same)
    // Bergen County
    { id: 'the-rockleigh', name: 'The Rockleigh', address: 'Rockleigh, NJ', county: 'Bergen', coordinates: { lat: 41.0048, lng: -73.9362 } },
    { id: 'the-mansion-at-mountain-lakes', name: 'The Mansion at Mountain Lakes', address: 'Mountain Lakes, NJ', county: 'Bergen', coordinates: { lat: 40.8773, lng: -74.4759 } },
    { id: 'seasons-catering', name: 'Seasons Catering', address: 'Township of Washington, NJ', county: 'Bergen', coordinates: { lat: 40.9965, lng: -74.0453 } },
    { id: 'indian-trail-club', name: 'Indian Trail Club', address: 'Franklin Lakes, NJ', county: 'Bergen', coordinates: { lat: 41.0307, lng: -74.2024 } },
    { id: 'florentine-gardens', name: 'The Florentine Gardens', address: 'River Vale, NJ', county: 'Bergen', coordinates: { lat: 40.9901, lng: -74.0009 } },
    { id: 'westmount-country-club', name: 'Westmount Country Club', address: 'Woodland Park, NJ', county: 'Bergen', coordinates: { lat: 40.8939, lng: -74.2070 } },

    // Morris County
    { id: 'the-madison-hotel', name: 'The Madison Hotel', address: 'Morristown, NJ', county: 'Morris', coordinates: { lat: 40.7964, lng: -74.4681 } },
    { id: 'naninas-in-the-park', name: 'Nanina\'s in the Park', address: 'Belleville, NJ', county: 'Essex', coordinates: { lat: 40.7898, lng: -74.1771 } },
    { id: 'park-savoy', name: 'The Park Savoy Estate', address: 'Florham Park, NJ', county: 'Morris', coordinates: { lat: 40.7911, lng: -74.4125 } },
    { id: 'olde-mill-inn', name: 'The Olde Mill Inn', address: 'Basking Ridge, NJ', county: 'Morris', coordinates: { lat: 40.7311, lng: -74.5394 } },
    { id: 'brooklake-country-club', name: 'Brooklake Country Club', address: 'Florham Park, NJ', county: 'Morris', coordinates: { lat: 40.7960, lng: -74.4179 } },

    // Sussex County
    { id: 'crystal-grand-cascades', name: 'Crystal Springs - Grand Cascades Lodge', address: 'Hamburg, NJ', county: 'Sussex', coordinates: { lat: 41.1853, lng: -74.5351 } },
    { id: 'bear-brook-valley', name: 'Bear Brook Valley', address: 'Fredon, NJ', county: 'Sussex', coordinates: { lat: 41.0515, lng: -74.7837 } },
    { id: 'perona-farms', name: 'Perona Farms', address: 'Andover, NJ', county: 'Sussex', coordinates: { lat: 40.9854, lng: -74.7438 } },
    { id: 'waterloo-village', name: 'Waterloo Village', address: 'Stanhope, NJ', county: 'Sussex', coordinates: { lat: 40.9131, lng: -74.7613 } },
    { id: 'rock-island-lake', name: 'Rock Island Lake Club', address: 'Sparta, NJ', county: 'Sussex', coordinates: { lat: 41.0339, lng: -74.6598 } },
    { id: 'lake-mohawk', name: 'Lake Mohawk Country Club', address: 'Sparta, NJ', county: 'Sussex', coordinates: { lat: 41.0342, lng: -74.6565 } },
    { id: 'ballyowen-golf-club', name: 'Ballyowen Golf Club', address: 'Hamburg, NJ', county: 'Sussex', coordinates: { lat: 41.1896, lng: -74.5693 } },
    { id: 'black-bear-golf-club', name: 'Black Bear Golf Club', address: 'Franklin, NJ', county: 'Sussex', coordinates: { lat: 41.1176, lng: -74.5997 } },

    // Monmouth County
    { id: 'shadowbrook', name: 'Shadowbrook at Shrewsbury', address: 'Shrewsbury, NJ', county: 'Monmouth', coordinates: { lat: 40.3119, lng: -74.0658 } },
    { id: 'clarks-landing', name: 'Clark\'s Landing Yacht Club', address: 'Point Pleasant, NJ', county: 'Monmouth', coordinates: { lat: 40.0967, lng: -74.0553 } },
    { id: 'the-oyster-point-hotel', name: 'The Oyster Point Hotel', address: 'Red Bank, NJ', county: 'Monmouth', coordinates: { lat: 40.3513, lng: -74.0635 } },
    { id: 'ocean-place-resort', name: 'Ocean Place Resort & Spa', address: 'Long Branch, NJ', county: 'Monmouth', coordinates: { lat: 40.3230, lng: -73.9867 } },
    { id: 'battleground-country-club', name: 'Battleground Country Club', address: 'Manalapan, NJ', county: 'Monmouth', coordinates: { lat: 40.2860, lng: -74.2988 } },

    // Ocean County
    { id: 'bonnet-island-estate', name: 'Bonnet Island Estate', address: 'Manahawkin, NJ', county: 'Ocean', coordinates: { lat: 39.6699, lng: -74.2148 } },
    { id: 'mallard-island-yacht-club', name: 'Mallard Island Yacht Club', address: 'Manahawkin, NJ', county: 'Ocean', coordinates: { lat: 39.6678, lng: -74.2147 } },
    { id: 'the-stateroom', name: 'The Stateroom', address: 'Ship Bottom, NJ', county: 'Ocean', coordinates: { lat: 39.6429, lng: -74.1804 } },
    { id: 'atlantis-ballroom', name: 'The Atlantis Ballroom', address: 'Toms River, NJ', county: 'Ocean', coordinates: { lat: 39.9841, lng: -74.1512 } },
    { id: 'jack-bakers-lobster-shanty', name: 'Jack Baker\'s Lobster Shanty', address: 'Point Pleasant, NJ', county: 'Ocean', coordinates: { lat: 40.0969, lng: -74.0450 } },

    // Mercer County
    { id: 'grounds-for-sculpture', name: 'Grounds For Sculpture', address: 'Hamilton, NJ', county: 'Mercer', coordinates: { lat: 40.2414, lng: -74.7183 } },
    { id: 'jasna-polana', name: 'TPC Jasna Polana', address: 'Princeton, NJ', county: 'Mercer', coordinates: { lat: 40.3580, lng: -74.7232 } },
    { id: 'princeton-university', name: 'Princeton University Chapel', address: 'Princeton, NJ', county: 'Mercer', coordinates: { lat: 40.3489, lng: -74.6517 } },
    { id: 'the-farmhouse-at-the-grand-colonial', name: 'The Farmhouse at The Grand Colonial', address: 'Hampton, NJ', county: 'Mercer', coordinates: { lat: 40.6876, lng: -74.9732 } },
    { id: 'ashford-estate', name: 'The Ashford Estate', address: 'Allentown, NJ', county: 'Mercer', coordinates: { lat: 40.1789, lng: -74.5801 } },

    // Middlesex County
    { id: 'park-chateau', name: 'Park Chateau Estate', address: 'East Brunswick, NJ', county: 'Middlesex', coordinates: { lat: 40.4085, lng: -74.4120 } },
    { id: 'the-heldrich-hotel', name: 'The Heldrich Hotel', address: 'New Brunswick, NJ', county: 'Middlesex', coordinates: { lat: 40.4930, lng: -74.4460 } },
    { id: 'the-imperia', name: 'The Imperia', address: 'Somerset, NJ', county: 'Middlesex', coordinates: { lat: 40.5123, lng: -74.5029 } },
    { id: 'the-palace-at-somerset-park', name: 'The Palace at Somerset Park', address: 'Somerset, NJ', county: 'Middlesex', coordinates: { lat: 40.5475, lng: -74.5648 } },
    { id: 'the-gran-centurions', name: 'The Gran Centurions', address: 'Clark, NJ', county: 'Middlesex', coordinates: { lat: 40.6198, lng: -74.3151 } },

    // Burlington County
    { id: 'the-merion', name: 'The Merion', address: 'Cinnaminson, NJ', county: 'Burlington', coordinates: { lat: 40.0023, lng: -74.9929 } },
    { id: 'valenzanos-winery', name: 'Valenzano Winery', address: 'Shamong, NJ', county: 'Burlington', coordinates: { lat: 39.7835, lng: -74.7278 } },
    { id: 'the-westin-mount-laurel', name: 'The Westin Mount Laurel', address: 'Mount Laurel, NJ', county: 'Burlington', coordinates: { lat: 39.9341, lng: -74.9180 } },
    { id: 'ramblewood-country-club', name: 'Ramblewood Country Club', address: 'Mount Laurel, NJ', county: 'Burlington', coordinates: { lat: 39.9599, lng: -74.8811 } },
    { id: 'camden-county-boathouse', name: 'Camden County Boathouse', address: 'Pennsauken, NJ', county: 'Burlington', coordinates: { lat: 39.9524, lng: -75.0692 } },

    // Union County
    { id: 'the-stone-house', name: 'The Stone House at Stirling Ridge', address: 'Warren, NJ', county: 'Union', coordinates: { lat: 40.6383, lng: -74.5041 } },
    { id: 'galloping-hill-golf-course', name: 'Galloping Hill Golf Course', address: 'Kenilworth, NJ', county: 'Union', coordinates: { lat: 40.6851, lng: -74.2870 } },
    { id: 'the-westwood', name: 'The Westwood', address: 'Garwood, NJ', county: 'Union', coordinates: { lat: 40.6518, lng: -74.3212 } },
    { id: 'canoe-brook-country-club', name: 'Canoe Brook Country Club', address: 'Summit, NJ', county: 'Union', coordinates: { lat: 40.7121, lng: -74.3566 } },
    { id: 'oak-ridge-golf-club', name: 'Oak Ridge Golf Club', address: 'Clark, NJ', county: 'Union', coordinates: { lat: 40.6195, lng: -74.3443 } },

    // Somerset County
    { id: 'natirar', name: 'Natirar', address: 'Peapack, NJ', county: 'Somerset', coordinates: { lat: 40.7239, lng: -74.6643 } },
    { id: 'pleasantdale-chateau', name: 'Pleasantdale Chateau', address: 'West Orange, NJ', county: 'Somerset', coordinates: { lat: 40.8128, lng: -74.2693 } },
    { id: 'fiddlers-elbow', name: 'Fiddler\'s Elbow Country Club', address: 'Bedminster Township, NJ', county: 'Somerset', coordinates: { lat: 40.6442, lng: -74.6871 } },
    { id: 'bridgewater-manor', name: 'Bridgewater Manor', address: 'Bridgewater, NJ', county: 'Somerset', coordinates: { lat: 40.6008, lng: -74.6482 } },
    { id: 'basking-ridge-country-club', name: 'Basking Ridge Country Club', address: 'Basking Ridge, NJ', county: 'Somerset', coordinates: { lat: 40.7064, lng: -74.5548 } },

    // Hunterdon County
    { id: 'the-ryland-inn', name: 'The Ryland Inn', address: 'Whitehouse Station, NJ', county: 'Hunterdon', coordinates: { lat: 40.6169, lng: -74.7687 } },
    { id: 'hunterdon-hills-playhouse', name: 'Hunterdon Hills Playhouse', address: 'Hampton, NJ', county: 'Hunterdon', coordinates: { lat: 40.7118, lng: -74.9535 } },
    { id: 'the-farmhouse', name: 'The Farmhouse', address: 'Ringoes, NJ', county: 'Hunterdon', coordinates: { lat: 40.4302, lng: -74.8679 } },
    { id: 'hunterdon-art-museum', name: 'Hunterdon Art Museum', address: 'Clinton, NJ', county: 'Hunterdon', coordinates: { lat: 40.6367, lng: -74.9132 } },
    { id: 'fox-hollow-golf-club', name: 'Fox Hollow Golf Club', address: 'Branchburg, NJ', county: 'Hunterdon', coordinates: { lat: 40.5603, lng: -74.7017 } },

    // Cape May County
    { id: 'cape-may-convention-hall', name: 'Cape May Convention Hall', address: 'Cape May, NJ', county: 'Cape May', coordinates: { lat: 38.9321, lng: -74.9060 } },
    { id: 'southern-mansion', name: 'Southern Mansion', address: 'Cape May, NJ', county: 'Cape May', coordinates: { lat: 38.9351, lng: -74.9126 } },
    { id: 'hotel-alcott', name: 'Hotel Alcott', address: 'Cape May, NJ', county: 'Cape May', coordinates: { lat: 38.9334, lng: -74.9081 } },
    { id: 'willow-creek-winery', name: 'Willow Creek Winery', address: 'West Cape May, NJ', county: 'Cape May', coordinates: { lat: 38.9406, lng: -74.9356 } },
    { id: 'cape-may-beach', name: 'Cape May Beach', address: 'Cape May, NJ', county: 'Cape May', coordinates: { lat: 38.9325, lng: -74.9060 } },
    { id: 'icona-golden-inn', name: 'ICONA Avalon', address: 'Avalon, NJ', county: 'Cape May', coordinates: { lat: 39.0936, lng: -74.7150 } },
    { id: 'icona-diamond-beach', name: 'ICONA Diamond Beach', address: 'Wildwood Crest, NJ', county: 'Cape May', coordinates: { lat: 38.9552, lng: -74.8571 } },
    { id: 'congress-hall', name: 'Congress Hall', address: 'Cape May, NJ', county: 'Cape May', coordinates: { lat: 38.9290, lng: -74.9188 } },
    { id: 'windrift-hotel', name: 'Windrift Hotel', address: 'Avalon, NJ', county: 'Cape May', coordinates: { lat: 39.0866, lng: -74.7254 } },
    { id: 'the-reeds-at-shelter-haven', name: 'The Reeds at Shelter Haven', address: 'Stone Harbor, NJ', county: 'Cape May', coordinates: { lat: 39.0520, lng: -74.7600 } },
];

// Format time for display
const formatTime = (timeString: string): string => { // Typed parameter and return
  const [hours, minutes] = timeString.split(':').map(Number);
  return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
};

// Function to fetch weather data based on venue coordinates - using REAL data
const fetchWeatherData = async (lat: number | null, lng: number | null): Promise<void> => { // Typed parameters
  if (!lat || !lng) {
    setWeatherError("Venue coordinates are missing.");
    return;
  }

  const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    console.error("OpenWeatherMap API key is missing. Make sure VITE_OPENWEATHERMAP_API_KEY is set in your .env file.");
    setWeatherError("Weather service configuration error.");
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`;
  setIsLoadingWeather(true);
  setWeatherError(null);
  setWeatherData(null);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown API error" }));
      console.error('OpenWeatherMap API Error:', response.status, errorData);
      throw new Error(`Weather API error (${response.status}): ${errorData.message || 'Failed to fetch'}`);
    }
    const data: WeatherData = await response.json(); // Type assertion for API response

    if (!data || !data.list) {
       console.error('Invalid API response structure:', data);
       throw new Error("Received invalid data structure from weather API.");
    }
    setWeatherData(data);
  } catch (error: any) { // Catch block error type
    console.error('Error fetching weather data:', error);
    setWeatherError(`Failed to fetch weather: ${error.message}`);
  } finally {
    setIsLoadingWeather(false);
  }
};

// Calculate accurate sun position and lighting conditions with DST consideration
const calculateLighting = async (venueId: string, dateString: string, timeString: string): Promise<void> => { // Typed parameters
  setResults(null);
  const selectedVenue = venues.find(v => v.id === venueId);

  if (!selectedVenue) {
    console.error("Venue not found for ID:", venueId);
    return;
  }

  // Ensure coordinates are numbers before setting state
  const lat = selectedVenue.coordinates?.lat;
  const lng = selectedVenue.coordinates?.lng;
  if (typeof lat === 'number' && typeof lng === 'number') {
      setCoordinates({ lat, lng });
  } else {
      setCoordinates({ lat: null, lng: null }); // Reset if invalid
  }


  // Fetch Weather Data
  if (typeof lat === 'number' && typeof lng === 'number') {
     await fetchWeatherData(lat, lng);
  } else {
     console.warn(`Coordinates missing for venue: ${selectedVenue.name}. Cannot fetch weather.`);
     setWeatherError("Cannot fetch weather: Venue coordinates missing.");
     setWeatherData(null);
  }

  // Lighting Calculation
  try {
    const selectedDate = new Date(dateString || new Date().toISOString().split('T')[0]);
    const [hours, minutes] = (timeString || '17:00').split(':').map(Number);

    if (isNaN(selectedDate.getTime())) {
       throw new Error("Invalid date provided.");
    }
    selectedDate.setHours(hours, minutes, 0, 0);
    const isDST = isDateInDST(selectedDate);

    // Placeholder calculations - replace with actual logic
    const sunPosition = 'Calculated Sun Position';
    const lightCondition = 'Calculated Light Condition';
    const goldenHour = 'Calculated Golden Hour Status';
    const recommendations = ['Shoot facing X', 'Use reflector'];
    const season = 'spring';
    const seasonalNotes = 'Spring light is soft.';
    const venueNotes = selectedVenue.notes || 'Standard venue notes.';

    setResults({
      venue: selectedVenue.name,
      date: selectedDate.toLocaleDateString(),
      time: formatTime(timeString || '17:00'),
      isDST: isDST ? 'Yes' : 'No',
      sunPosition,
      lightCondition,
      goldenHour,
      recommendations,
      season,
      seasonalNotes,
      venueNotes,
    });

  } catch (error: any) { // Catch block error type
    console.error('Error calculating lighting:', error);
    setResults({ // Set an error state for results
        venue: selectedVenue.name, // Include venue name even in error state if possible
        date: dateString,
        time: timeString,
        isDST: 'N/A',
        sunPosition: 'Error',
        lightCondition: 'Error',
        goldenHour: 'Error',
        recommendations: [],
        season: 'N/A',
        seasonalNotes: '',
        venueNotes: '',
        error: `Error calculating lighting: ${error.message}`
    });
    setWeatherData(null);
    setWeatherError(null);
  }
};

// Handle form submission
const handleSubmit = (e: FormEvent<HTMLFormElement>) => { // Typed event
  e.preventDefault();
  if (venue) {
    calculateLighting(venue, date, time);
  } else {
    console.log("Please select a venue.");
  }
};

// --- JSX Rendering ---
return (
  <div className="min-h-screen bg-gray-100">
    <Navigation />

    {/* Hero Header Section */}
    <div className="relative bg-gradient-to-r from-gray-900 to-black text-white overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-40" 
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(0.2)'
        }}
      ></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm">
              <Sun className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Venue Lighting Simulator</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 mb-6">
            Plan your perfect wedding photos with our lighting prediction tool
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Sun className="h-4 w-4 mr-2 text-amber-400" />
              <span>Golden Hour Predictions</span>
            </div>
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <MapPin className="h-4 w-4 mr-2 text-white" />
              <span>NJ Venue Database</span>
            </div>
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Camera className="h-4 w-4 mr-2 text-white" />
              <span>Photography Insights</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-100 to-transparent"></div>
    </div>

    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Cross-promotion for Wedding Timeline Tool */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-lg shadow-sm mb-8 border border-amber-200 relative overflow-hidden">
          <div className="md:flex items-center justify-between">
            <div className="md:w-2/3 relative z-10">
              <h3 className="text-xl font-serif font-medium mb-2 text-amber-900">Photographers & Videographers</h3>
              <p className="text-amber-800 mb-4">
                Need a comprehensive wedding day timeline tool? Check out our free downloadable Wedding Timeline Designer to help plan the perfect schedule for your clients.
              </p>
              <a 
                href="/timeline-tool" 
                className="inline-flex items-center bg-amber-600 text-white px-5 py-2 rounded-md hover:bg-amber-700 transition-colors"
              >
                <Clock className="w-4 h-4 mr-2" />
                Try Our Wedding Timeline Tool
              </a>
            </div>
            <div className="hidden md:block md:w-1/3 relative">
              <div className="absolute top-0 right-0 -mt-12 -mr-8 text-amber-200 opacity-30">
                <Clock className="w-32 h-32" />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Venue Selection */}
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline-block w-4 h-4 mr-1" /> Venue
              </label>
              <select
                id="venue"
                value={venue}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setVenue(e.target.value)} // Typed event
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="" disabled>Select a Venue</option>
                {/* Group venues by county */}
                {Object.entries(
                  venues.reduce((acc: { [key: string]: Venue[] }, v: Venue) => { // Typed accumulator and value
                    acc[v.county] = [...(acc[v.county] || []), v];
                    return acc;
                  }, {})
                ).sort(([countyA], [countyB]) => countyA.localeCompare(countyB))
                 .map(([county, countyVenues]) => (
                  <optgroup label={`${county} County`} key={county}>
                    {countyVenues // countyVenues is already Venue[] due to reduce typing
                      .sort((a: Venue, b: Venue) => a.name.localeCompare(b.name)) // Typed params
                      .map((v: Venue) => ( // Typed param
                        <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline-block w-4 h-4 mr-1" /> Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} // Typed event
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Time Selection */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="inline-block w-4 h-4 mr-1" /> Time
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTime(e.target.value)} // Typed event
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors disabled:opacity-50"
              disabled={!venue || isLoadingWeather}
            >
              {isLoadingWeather ? 'Loading Weather...' : 'Simulate Lighting'}
            </button>
          </div>
        </form>

        {/* Weather Display Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
           <h3 className="text-lg font-medium mb-4">Weather Forecast</h3>
           {isLoadingWeather && <p className="text-gray-500">Loading weather data...</p>}
           {weatherError && <p className="text-red-600">Error: {weatherError}</p>}
           {!isLoadingWeather && !weatherError && weatherData && (() => {
               const forecastForTime = getWeatherForTime(weatherData, date, time);
               if (forecastForTime) {
                   const weatherTime = new Date(forecastForTime.dt * 1000);
                   return (
                       <div className="text-gray-700">
                           <p><strong>Conditions at approx. {weatherTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}:</strong></p>
                           <p> - Temp: {Math.round(forecastForTime.main.temp)}°F (Feels like: {Math.round(forecastForTime.main.feels_like)}°F)</p>
                           <p> - Weather: {forecastForTime.weather[0].main} ({forecastForTime.weather[0].description})</p>
                           <p> - Wind: {Math.round(forecastForTime.wind.speed)} mph</p>
                           <p> - Cloud Cover: {forecastForTime.clouds.all}%</p>
                       </div>
                   );
               } else if (weatherData) {
                   return <p className="text-gray-500">Weather data loaded, but no specific forecast available for the selected time.</p>;
               } else {
                   return <p className="text-gray-500">Select venue, date, and time, then click simulate to view weather.</p>;
               }
           })()}
           {!isLoadingWeather && !weatherError && !weatherData && !venue &&
               <p className="text-gray-500">Select a venue to fetch weather forecast.</p>
           }
        </div>

        {/* Lighting Results Display */}
        {results && !results.error && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Lighting Simulation Results</h2>
            <div className="mb-6 space-y-2">
              <p><strong>Venue:</strong> {results.venue}</p>
              <p><strong>Date:</strong> {results.date}</p>
              <p><strong>Time:</strong> {results.time}</p>
              <p><strong>Daylight Saving Time:</strong> {results.isDST}</p>
            </div>

            <div className="mb-6 border-t pt-6">
               <h3 className="text-lg font-medium mb-2">Lighting Conditions:</h3>
               <p className="text-gray-700"><strong>Sun Position:</strong> {results.sunPosition}</p>
               <p className="text-gray-700"><strong>Condition:</strong> {results.lightCondition}</p>
               <p className="text-gray-700"><strong>Golden Hour:</strong> {results.goldenHour}</p>
            </div>

            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-medium mb-2">Photographer Recommendations:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {results.recommendations.map((rec: string, index: number) => ( // Typed params
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2 capitalize">{results.season} Season Notes:</h4>
                  <p className="text-gray-700">{results.seasonalNotes}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Venue-Specific Notes:</h4>
                  <p className="text-gray-700">{results.venueNotes}</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8 border-t pt-6">
               <p className="text-gray-600 mb-4">
                 Would you like personalized guidance for your wedding photography at {results.venue}?
               </p>
               <div className="flex flex-col md:flex-row justify-center gap-4">
                 <a
                   href="/contact"
                   className="inline-flex items-center bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                 >
                   Schedule a Consultation
                 </a>
                 <a
                   href="/timeline-tool"
                   className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors"
                 >
                   <Clock className="w-5 h-5 mr-2" />
                   Create Wedding Timeline
                 </a>
               </div>
            </div>
          </div>
        )}

        {/* Handle Lighting Calculation Error State */}
        {results && results.error && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-md mb-8" role="alert">
             <strong className="font-bold">Error!</strong>
             <span className="block sm:inline"> {results.error}</span>
           </div>
        )}

        {/* SEO and Marketing Section */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
           <h2 className="text-2xl font-serif mb-4">Why Lighting Matters for Wedding Photography</h2>
           <p className="text-gray-600 mb-6">
            As a New Jersey wedding photographer, I've photographed at venues across the state and understand
            the unique lighting challenges and opportunities each presents. From the beaches of Cape May to the
            mountains of Sussex County, the right lighting can transform your wedding photos from good to extraordinary.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-medium mb-2">Golden Hour Magic</h3>
              <p className="text-gray-600 text-sm">
                The hour before sunset provides the most flattering light for portraits, with warm golden tones
                and soft shadows that create a romantic atmosphere.
              </p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-medium mb-2">Venue Knowledge</h3>
              <p className="text-gray-600 text-sm">
                Each venue has unique lighting characteristics. Knowing exactly where and when to capture
                key moments results in better photos with less stress.
              </p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="font-medium mb-2">Timeline Planning</h3>
              <p className="text-gray-600 text-sm">
                Building your wedding timeline around optimal lighting conditions ensures you'll get the
                most flattering photos while still enjoying your day.
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Looking for a photographer who understands the unique lighting at your New Jersey venue?
            </p>
            <a
              href="/contact"
              className="inline-block bg-amber-500 text-white px-6 py-3 rounded-md hover:bg-amber-600 transition-colors"
            >
              Let's Talk About Your Wedding
            </a>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
  );
};

export default VenueLightingTool;
