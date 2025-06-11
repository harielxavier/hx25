import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchVenues, Venue } from '../../data/njVenues';

// Global variable to track if Google Maps API is loading or loaded
declare global {
  interface Window {
    googleMapsInitialized: boolean;
    googleMapsLoading: boolean;
    googleMapsCallbacks: Array<() => void>;
    initGoogleMapsCallback: () => void;
    google: typeof google;
  }
}

// Initialize global variables if they don't exist
if (typeof window !== 'undefined') {
  window.googleMapsInitialized = window.googleMapsInitialized || false;
  window.googleMapsLoading = window.googleMapsLoading || false;
  window.googleMapsCallbacks = window.googleMapsCallbacks || [];
  
  // Global callback function that will be called when Google Maps API is loaded
  window.initGoogleMapsCallback = () => {
    console.log('Google Maps API loaded successfully');
    window.googleMapsInitialized = true;
    window.googleMapsLoading = false;
    
    // Call all registered callbacks
    window.googleMapsCallbacks.forEach(callback => callback());
    window.googleMapsCallbacks = [];
  };
}

interface VenueAutocompleteProps {
  value: string;
  onChange: (value: string, placeDetails?: google.maps.places.PlaceResult | Venue) => void;
  placeholder?: string;
  className?: string;
  restrictToNJ?: boolean;
  useLocalDatabaseOnly?: boolean;
}

const VenueAutocomplete: React.FC<VenueAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Search for a venue...',
  className = '',
  restrictToNJ = true,
  useLocalDatabaseOnly = true
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<(google.maps.places.AutocompletePrediction | Venue)[]>([]);
  const [localSuggestions, setLocalSuggestions] = useState<Venue[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usingLocalResults, setUsingLocalResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Load Google Maps API once and initialize services
  useEffect(() => {
    // Always set local results as available
    setUsingLocalResults(true);
    
    // If using local database only, don't try to load Google Maps
    if (useLocalDatabaseOnly) {
      return;
    }
    
    // Function to initialize Places API services
    const initPlacesAPI = () => {
      try {
        if (window.google && window.google.maps && window.google.maps.places) {
          console.log('Initializing Google Places API services');
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          
          // Create a dummy div for PlacesService (required but not visible)
          const dummyElement = document.createElement('div');
          placesService.current = new window.google.maps.places.PlacesService(dummyElement);
          
          // Create a new session token
          sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
        } else {
          console.error('Google Maps API loaded but places library not available');
          setUsingLocalResults(true);
        }
      } catch (error) {
        console.error('Error initializing Places API:', error);
        setUsingLocalResults(true);
      }
    };

    // Check if Google Maps is already fully loaded and available
    if (window.googleMapsInitialized && window.google && window.google.maps && window.google.maps.places) {
      console.log('Google Maps already initialized, using existing instance');
      initPlacesAPI();
      return;
    }
    
    // If Google Maps is currently loading, register our callback
    if (window.googleMapsLoading) {
      console.log('Google Maps is currently loading, registering callback');
      window.googleMapsCallbacks.push(initPlacesAPI);
      return;
    }
    
    // Check if the script already exists to prevent duplicate loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      console.log('Google Maps script tag already exists in document');
      
      // If script exists but Google isn't defined yet, it's still loading
      if (!window.google || !window.google.maps) {
        console.log('Script exists but not loaded yet, registering callback');
        window.googleMapsLoading = true;
        window.googleMapsCallbacks.push(initPlacesAPI);
        return;
      }
      
      // If script exists and Google is defined, it's already loaded
      console.log('Script exists and appears to be loaded, initializing directly');
      window.googleMapsInitialized = true;
      initPlacesAPI();
      return;
    }
    
    // Otherwise, we need to load the Google Maps API
    console.log('Loading Google Maps API script');
    window.googleMapsLoading = true;
    
    // Add script to load Google Maps API
    const script = document.createElement('script');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsCallback`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script'; // Add ID for easier identification
    
    // Add error handling
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
      window.googleMapsLoading = false;
      setLoading(false);
      setUsingLocalResults(true); // Fallback to local results only
    };
    
    // Register our callback
    window.googleMapsCallbacks.push(initPlacesAPI);
    
    // Append the script to the document
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      // Only remove our callback from the queue
      if (window.googleMapsCallbacks) {
        window.googleMapsCallbacks = window.googleMapsCallbacks.filter(
          callback => callback !== initPlacesAPI
        );
      }
    };
  }, [useLocalDatabaseOnly]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length > 1) {
      // Always search local database first for instant results
      const localResults = searchVenues(value);
      setLocalSuggestions(localResults);
      
      if (localResults.length > 0) {
        setSuggestions(localResults);
        setUsingLocalResults(true);
        setShowSuggestions(true);
        setLoading(false);
      } else {
        setUsingLocalResults(false);
      }
      
      // If not restricted to local database and local results are limited, also search Google Places
      if (!useLocalDatabaseOnly && value.length > 2 && localResults.length < 5) {
        fetchSuggestions(value);
      }
    } else {
      setSuggestions([]);
      setLocalSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Fetch suggestions from Google Places API
  const fetchSuggestions = (input: string) => {
    if (!autocompleteService.current || !sessionToken.current) return;
    
    setLoading(true);
    
    const request: google.maps.places.AutocompletionRequest = {
      input,
      sessionToken: sessionToken.current,
      types: ['establishment'],
      componentRestrictions: restrictToNJ ? { country: 'us' } : undefined
    };
    
    autocompleteService.current.getPlacePredictions(
      request,
      (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
        setLoading(false);
        
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          // Filter to NJ venues if restrictToNJ is true
          const filteredPredictions = restrictToNJ 
            ? predictions.filter(prediction => 
                prediction.description.toLowerCase().includes('nj') || 
                prediction.description.toLowerCase().includes('new jersey'))
            : predictions;
            
          // Combine with local results if there are any
          if (localSuggestions.length > 0) {
            // Only add Google results that don't overlap with local results
            const googleResultsToAdd = filteredPredictions.filter(prediction => 
              !localSuggestions.some(venue => 
                prediction.description.toLowerCase().includes(venue.name.toLowerCase())
              )
            );
            
            // Limit to top 5 Google results to avoid overwhelming the user
            const limitedGoogleResults = googleResultsToAdd.slice(0, 5);
            
            setSuggestions([...localSuggestions, ...limitedGoogleResults]);
          } else {
            setSuggestions(filteredPredictions);
          }
          
          setUsingLocalResults(false);
          setShowSuggestions(true);
        }
      }
    );
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: google.maps.places.AutocompletePrediction | Venue) => {
    // Check if it's a local venue suggestion
    if ('id' in suggestion) {
      setInputValue(suggestion.name);
      onChange(suggestion.name, suggestion);
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // Otherwise it's a Google Places suggestion
    if (!placesService.current || !sessionToken.current) return;
    
    // Get place details
    placesService.current.getDetails(
      {
        placeId: suggestion.place_id,
        fields: ['name', 'formatted_address', 'geometry'],
        sessionToken: sessionToken.current
      },
      (placeResult: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && placeResult) {
          // Use the venue name as the value
          setInputValue(placeResult.name || suggestion.description);
          onChange(placeResult.name || suggestion.description, placeResult);
          
          // Create a new session token for the next search
          sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
        } else {
          setInputValue(suggestion.description);
          onChange(suggestion.description);
        }
        
        setSuggestions([]);
        setShowSuggestions(false);
      }
    );
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={inputRef}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length > 1 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded ${className}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {loading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          ) : (
            <Search size={16} className="text-gray-400" />
          )}
        </div>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <li
              key={'id' in suggestion ? suggestion.id : suggestion.place_id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                'id' in suggestion ? 'font-medium text-blue-600' : ''
              }`}
            >
              {'id' in suggestion ? (
                <div>
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-gray-500">{suggestion.city}, NJ</div>
                </div>
              ) : (
                suggestion.description
              )}
            </li>
          ))}
          {usingLocalResults && (
            <li className="px-4 py-2 text-xs text-gray-500 italic">
              Results from NJ venues database
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default VenueAutocomplete;
