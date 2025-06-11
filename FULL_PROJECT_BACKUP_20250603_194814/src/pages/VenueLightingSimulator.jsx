import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sun, Clock, Camera, MapPin, Calendar, ChevronRight, Filter } from 'lucide-react';
import Navigation from '../components/landing/Navigation';
import Footer from '../components/landing/Footer';
import { sussexVenues, venueCategories, getVenueById, getVenuesByCategory, getBestTimes } from '../data/sussexVenues';

const VenueLightingSimulator = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTime, setSelectedTime] = useState('17:00');
  const [selectedSeason, setSelectedSeason] = useState('summer');
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [activeImageType, setActiveImageType] = useState('goldenhour');
  
  // If venueId is provided, find and set the selected venue
  useEffect(() => {
    if (venueId) {
      const venue = getVenueById(venueId);
      if (venue) {
        setSelectedVenue(venue);
      } else {
        // Venue not found, redirect to main simulator page
        navigate('/venues');
      }
    } else {
      setSelectedVenue(null);
    }
  }, [venueId, navigate]);
  
  // Filter venues based on selected category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredVenues(sussexVenues);
    } else {
      setFilteredVenues(getVenuesByCategory(selectedCategory));
    }
  }, [selectedCategory]);
  
  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
  };
  
  // Handle venue selection
  const handleVenueSelect = (venue) => {
    navigate(`/venues/${venue.id}`);
  };
  
  // Handle category filter change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  // Handle time slider change
  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    
    // Set active image type based on time
    const hour = parseInt(e.target.value.split(':')[0]);
    if (hour >= 6 && hour < 10) {
      setActiveImageType('exterior');
    } else if (hour >= 10 && hour < 15) {
      setActiveImageType('ceremony');
    } else if (hour >= 15 && hour < 19) {
      setActiveImageType('goldenhour');
    } else {
      setActiveImageType('reception');
    }
  };
  
  // Get recommended times based on season
  const getRecommendedTimes = () => {
    if (!selectedVenue) return [];
    return getBestTimes(selectedVenue, selectedSeason);
  };
  
  // Render venue detail view
  const renderVenueDetail = () => {
    if (!selectedVenue) return null;
    
    const recommendedTimes = getRecommendedTimes();
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif mb-2">{selectedVenue.name}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{selectedVenue.address}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
              {venueCategories.find(c => c.id === selectedVenue.category)?.name || selectedVenue.category}
            </span>
            {selectedVenue.features.map((feature, index) => (
              <span key={index} className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
        
        {/* Light Simulator Controls */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Lighting Simulator</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">Time of Day</label>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-amber-500 mr-2" />
                <input
                  type="range"
                  min="6"
                  max="20"
                  step="0.5"
                  value={selectedTime.split(':')[0] + '.' + (selectedTime.split(':')[1] === '30' ? '5' : '0')}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    const hours = Math.floor(val);
                    const minutes = val % 1 === 0.5 ? '30' : '00';
                    setSelectedTime(`${hours}:${minutes}`);
                  }}
                  className="w-full"
                />
                <span className="ml-3 font-medium">{formatTime(selectedTime)}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Season</label>
              <div className="grid grid-cols-4 gap-2">
                {['spring', 'summer', 'fall', 'winter'].map((season) => (
                  <button
                    key={season}
                    onClick={() => setSelectedSeason(season)}
                    className={`py-2 px-3 rounded-md capitalize ${
                      selectedSeason === season
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {season}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-md">
            <h3 className="font-medium flex items-center">
              <Sun className="w-5 h-5 text-amber-500 mr-2" />
              Photographer's Notes
            </h3>
            <p className="text-gray-700 mt-2">{selectedVenue.lightingNotes}</p>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Recommended Times:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {recommendedTimes.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTime(time)}
                    className="bg-white border border-amber-300 text-amber-700 px-3 py-1 rounded-full text-sm hover:bg-amber-100"
                  >
                    {formatTime(time)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Venue Images with Lighting Preview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Preview Lighting Conditions</h2>
          
          <div className="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden mb-4">
            {/* This would show different images based on selected time */}
            <img
              src={selectedVenue.imageUrls[activeImageType] || selectedVenue.imageUrls.exterior}
              alt={`${selectedVenue.name} at ${formatTime(selectedTime)}`}
              className="w-full h-full object-cover"
            />
            
            <div className="bg-gradient-to-t from-black/60 to-transparent absolute bottom-0 left-0 right-0 p-4">
              <div className="text-white">
                <p className="font-medium">{formatTime(selectedTime)} - {selectedSeason}</p>
                <p className="text-sm opacity-80">
                  {activeImageType === 'goldenhour' ? 'Golden Hour' : 
                   activeImageType === 'exterior' ? 'Morning Light' :
                   activeImageType === 'ceremony' ? 'Midday' : 'Evening'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {['exterior', 'ceremony', 'goldenhour', 'reception'].map((imageType) => (
              <button
                key={imageType}
                onClick={() => setActiveImageType(imageType)}
                className={`aspect-square overflow-hidden rounded-md ${
                  activeImageType === imageType ? 'ring-2 ring-amber-500' : ''
                }`}
              >
                <img
                  src={selectedVenue.imageUrls[imageType]}
                  alt={imageType}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Download Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Plan Your Wedding Photography</h2>
          <p className="text-gray-600 mb-4">
            Download a custom lighting schedule for your wedding date at {selectedVenue.name}.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="date"
              className="px-4 py-2 border rounded-md"
              placeholder="Select your wedding date"
            />
            <button className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors flex items-center justify-center">
              <Calendar className="w-4 h-4 mr-2" />
              Generate Custom Schedule
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render venue listing/browsing view
  const renderVenueListing = () => {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Sussex County Wedding Venue Lighting Guide</h1>
          <p className="text-lg text-gray-600 max-w-4xl">
            Explore lighting conditions at popular Sussex County wedding venues. Use our interactive 
            simulator to find the perfect time for your ceremony and portraits based on lighting.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 mr-2 text-gray-700" />
            <h2 className="text-xl font-medium">Filter by Venue Type</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Venues
            </button>
            
            {venueCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-md ${
                  selectedCategory === category.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Venue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleVenueSelect(venue)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={venue.imageUrls.exterior}
                  alt={venue.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-medium mb-2">{venue.name}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{venue.address}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                    {venueCategories.find(c => c.id === venue.category)?.name || venue.category}
                  </span>
                </div>
                
                <div className="flex items-center text-amber-600 font-medium">
                  <Sun className="w-4 h-4 mr-2" />
                  <span>View Lighting Guide</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-serif mb-4">Planning Your Sussex County Wedding?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            As a local photographer who knows these venues intimately, I can help you plan the perfect 
            timeline to capture beautiful images throughout your special day.
          </p>
          <button className="bg-amber-500 text-white px-6 py-3 rounded-md hover:bg-amber-600 transition-colors flex items-center mx-auto">
            <Camera className="w-5 h-5 mr-2" />
            Schedule a Consultation
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-12">
        {selectedVenue ? renderVenueDetail() : renderVenueListing()}
      </div>
      
      <Footer />
    </div>
  );
};

export default VenueLightingSimulator;
