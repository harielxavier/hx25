// Type definitions for Google Maps JavaScript API
// This file provides TypeScript definitions for the Google Maps API used in the VenueAutocomplete component

declare namespace google {
  namespace maps {
    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (predictions: AutocompletePrediction[] | null, status: PlacesServiceStatus) => void
        ): void;
      }

      class PlacesService {
        constructor(attrContainer: HTMLElement);
        getDetails(
          request: PlaceDetailsRequest,
          callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
        ): void;
      }

      class AutocompleteSessionToken {}

      interface AutocompletePrediction {
        description: string;
        place_id: string;
        structured_formatting: {
          main_text: string;
          secondary_text: string;
        };
        terms: {
          offset: number;
          value: string;
        }[];
        types: string[];
      }

      interface AutocompletionRequest {
        input: string;
        sessionToken?: AutocompleteSessionToken;
        types?: string[];
        componentRestrictions?: {
          country: string | string[];
        };
        bounds?: google.maps.LatLngBounds;
        location?: google.maps.LatLng;
        radius?: number;
        offset?: number;
        origin?: google.maps.LatLng;
      }

      interface PlaceDetailsRequest {
        placeId: string;
        fields: string[];
        sessionToken?: AutocompleteSessionToken;
      }

      interface PlaceResult {
        name?: string;
        place_id: string;
        formatted_address?: string;
        geometry?: {
          location: google.maps.LatLng;
          viewport: google.maps.LatLngBounds;
        };
        address_components?: {
          long_name: string;
          short_name: string;
          types: string[];
        }[];
        photos?: {
          height: number;
          width: number;
          html_attributions: string[];
          getUrl: (opts: { maxHeight?: number; maxWidth?: number }) => string;
        }[];
        types?: string[];
        website?: string;
        formatted_phone_number?: string;
        international_phone_number?: string;
        opening_hours?: {
          open_now: boolean;
          periods: {
            open: { day: number; time: string };
            close: { day: number; time: string };
          }[];
          weekday_text: string[];
        };
        rating?: number;
        reviews?: {
          author_name: string;
          rating: number;
          text: string;
          time: number;
        }[];
      }

      enum PlacesServiceStatus {
        OK = 'OK',
        ZERO_RESULTS = 'ZERO_RESULTS',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        REQUEST_DENIED = 'REQUEST_DENIED',
        INVALID_REQUEST = 'INVALID_REQUEST',
        UNKNOWN_ERROR = 'UNKNOWN_ERROR',
        NOT_FOUND = 'NOT_FOUND'
      }
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(point: LatLng): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      isEmpty(): boolean;
    }
  }
}

// Extend the Window interface to include the google property
interface Window {
  google: typeof google;
}
