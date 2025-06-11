interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'preparation' | 'ceremony' | 'reception' | 'photos' | 'travel' | 'buffer';
  location: string;
  participants: string[];
  equipment?: string[];
  notes?: string;
  weatherDependent: boolean;
  travelBuffer: number; // minutes
  priority: 'critical' | 'important' | 'optional';
  aiGenerated: boolean;
  culturalContext?: string;
}

interface TravelBuffer {
  baseTime: number; // minutes
  trafficMultiplier: number; // 1.0 = normal, 1.5 = heavy traffic
  weatherDelay: number; // additional minutes for weather
  totalBuffer: number; // final calculated buffer
  confidence: number; // 0-100% confidence in prediction
}

interface WeatherCondition {
  condition: 'clear' | 'rain' | 'snow' | 'storm' | 'fog';
  severity: 'light' | 'moderate' | 'heavy';
  visibility: number; // miles
  windSpeed: number; // mph
  precipitation: number; // inches/hour
}

interface TrafficData {
  currentDuration: number; // minutes
  typicalDuration: number; // minutes
  trafficLevel: 'light' | 'moderate' | 'heavy' | 'severe';
  incidents: TrafficIncident[];
  alternateRoutes: AlternateRoute[];
}

interface TrafficIncident {
  type: 'accident' | 'construction' | 'closure' | 'event';
  severity: 'minor' | 'major' | 'severe';
  delay: number; // minutes
  description: string;
  location: string;
}

interface AlternateRoute {
  duration: number; // minutes
  distance: number; // miles
  trafficLevel: 'light' | 'moderate' | 'heavy';
  description: string;
}

interface LocationData {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'venue' | 'hotel' | 'church' | 'reception' | 'photo_location';
}

class DynamicTravelService {
  private googleMapsApiKey: string;
  private weatherApiKey: string;
  
  constructor() {
    this.googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
    this.weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY || '';
  }

  /**
   * Calculate dynamic travel buffer between two locations
   */
  async calculateTravelBuffer(
    origin: LocationData,
    destination: LocationData,
    departureTime: Date,
    eventType: string = 'general'
  ): Promise<TravelBuffer> {
    try {
      // Get traffic data from Google Maps
      const trafficData = await this.getTrafficData(origin, destination, departureTime);
      
      // Get weather forecast for the travel time
      const weatherData = await this.getWeatherForecast(origin, destination, departureTime);
      
      // Calculate base travel time
      const baseTime = trafficData.typicalDuration;
      
      // Apply traffic multiplier
      const trafficMultiplier = this.calculateTrafficMultiplier(trafficData);
      
      // Calculate weather delay
      const weatherDelay = this.calculateWeatherDelay(weatherData, eventType);
      
      // Apply event-specific buffer rules
      const eventBuffer = this.getEventSpecificBuffer(eventType);
      
      // Calculate total buffer with confidence scoring
      const totalBuffer = Math.round(
        (baseTime * trafficMultiplier) + weatherDelay + eventBuffer
      );
      
      const confidence = this.calculateConfidence(trafficData, weatherData);
      
      return {
        baseTime,
        trafficMultiplier,
        weatherDelay,
        totalBuffer,
        confidence
      };
      
    } catch (error) {
      console.error('Error calculating travel buffer:', error);
      
      // Fallback to conservative estimate
      return {
        baseTime: 30,
        trafficMultiplier: 1.5,
        weatherDelay: 15,
        totalBuffer: 60,
        confidence: 50
      };
    }
  }

  /**
   * Get real-time traffic data from Google Maps
   */
  private async getTrafficData(
    origin: LocationData,
    destination: LocationData,
    departureTime: Date
  ): Promise<TrafficData> {
    const url = `https://maps.googleapis.com/maps/api/directions/json?` +
      `origin=${origin.coordinates.lat},${origin.coordinates.lng}&` +
      `destination=${destination.coordinates.lat},${destination.coordinates.lng}&` +
      `departure_time=${Math.floor(departureTime.getTime() / 1000)}&` +
      `traffic_model=best_guess&` +
      `alternatives=true&` +
      `key=${this.googleMapsApiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${data.status}`);
    }

    const route = data.routes[0];
    const leg = route.legs[0];
    
    // Extract traffic information
    const currentDuration = Math.round(leg.duration_in_traffic?.value / 60) || Math.round(leg.duration.value / 60);
    const typicalDuration = Math.round(leg.duration.value / 60);
    
    // Determine traffic level
    const trafficRatio = currentDuration / typicalDuration;
    let trafficLevel: TrafficData['trafficLevel'];
    
    if (trafficRatio < 1.1) trafficLevel = 'light';
    else if (trafficRatio < 1.3) trafficLevel = 'moderate';
    else if (trafficRatio < 1.6) trafficLevel = 'heavy';
    else trafficLevel = 'severe';
    
    // Process alternate routes
    const alternateRoutes: AlternateRoute[] = data.routes.slice(1, 3).map((route: any) => ({
      duration: Math.round(route.legs[0].duration_in_traffic?.value / 60) || Math.round(route.legs[0].duration.value / 60),
      distance: Math.round(route.legs[0].distance.value / 1609.34), // Convert to miles
      trafficLevel: this.determineTrafficLevel(route.legs[0]),
      description: route.summary
    }));

    return {
      currentDuration,
      typicalDuration,
      trafficLevel,
      incidents: [], // Would need additional API for incident data
      alternateRoutes
    };
  }

  /**
   * Get weather forecast for travel time
   */
  private async getWeatherForecast(
    origin: LocationData,
    destination: LocationData,
    departureTime: Date
  ): Promise<WeatherCondition> {
    // Use midpoint for weather check
    const midLat = (origin.coordinates.lat + destination.coordinates.lat) / 2;
    const midLng = (origin.coordinates.lng + destination.coordinates.lng) / 2;
    
    const url = `https://api.openweathermap.org/data/2.5/forecast?` +
      `lat=${midLat}&lon=${midLng}&` +
      `appid=${this.weatherApiKey}&units=imperial`;

    const response = await fetch(url);
    const data = await response.json();
    
    if (data.cod !== '200') {
      throw new Error(`Weather API error: ${data.message}`);
    }

    // Find forecast closest to departure time
    const targetTime = departureTime.getTime() / 1000;
    const forecast = data.list.find((item: any) => 
      Math.abs(item.dt - targetTime) < 3 * 60 * 60 // Within 3 hours
    ) || data.list[0];

    // Parse weather conditions
    const weather = forecast.weather[0];
    const main = forecast.main;
    const wind = forecast.wind;
    const rain = forecast.rain || {};
    const snow = forecast.snow || {};

    let condition: WeatherCondition['condition'];
    let severity: WeatherCondition['severity'];

    // Determine condition and severity
    if (weather.main === 'Clear') {
      condition = 'clear';
      severity = 'light';
    } else if (weather.main === 'Rain') {
      condition = 'rain';
      severity = rain['3h'] > 0.5 ? 'heavy' : rain['3h'] > 0.1 ? 'moderate' : 'light';
    } else if (weather.main === 'Snow') {
      condition = 'snow';
      severity = snow['3h'] > 2 ? 'heavy' : snow['3h'] > 0.5 ? 'moderate' : 'light';
    } else if (weather.main === 'Thunderstorm') {
      condition = 'storm';
      severity = 'heavy';
    } else if (weather.main === 'Fog' || weather.main === 'Mist') {
      condition = 'fog';
      severity = main.visibility < 1000 ? 'heavy' : main.visibility < 5000 ? 'moderate' : 'light';
    } else {
      condition = 'clear';
      severity = 'light';
    }

    return {
      condition,
      severity,
      visibility: main.visibility ? main.visibility / 1609.34 : 10, // Convert to miles
      windSpeed: wind.speed || 0,
      precipitation: (rain['3h'] || snow['3h'] || 0)
    };
  }

  /**
   * Calculate traffic multiplier based on traffic data
   */
  private calculateTrafficMultiplier(trafficData: TrafficData): number {
    const baseMultiplier = trafficData.currentDuration / trafficData.typicalDuration;
    
    // Add incident penalties
    const incidentPenalty = trafficData.incidents.reduce((total, incident) => {
      switch (incident.severity) {
        case 'minor': return total + 0.1;
        case 'major': return total + 0.3;
        case 'severe': return total + 0.5;
        default: return total;
      }
    }, 0);
    
    return Math.min(baseMultiplier + incidentPenalty, 3.0); // Cap at 3x normal time
  }

  /**
   * Calculate weather delay based on conditions
   */
  private calculateWeatherDelay(weather: WeatherCondition, eventType: string): number {
    let baseDelay = 0;
    
    // Base weather delays
    switch (weather.condition) {
      case 'clear':
        baseDelay = 0;
        break;
      case 'rain':
        baseDelay = weather.severity === 'light' ? 5 : weather.severity === 'moderate' ? 15 : 30;
        break;
      case 'snow':
        baseDelay = weather.severity === 'light' ? 15 : weather.severity === 'moderate' ? 30 : 60;
        break;
      case 'storm':
        baseDelay = 45;
        break;
      case 'fog':
        baseDelay = weather.severity === 'light' ? 10 : weather.severity === 'moderate' ? 20 : 40;
        break;
    }
    
    // Event-specific multipliers
    const eventMultipliers: Record<string, number> = {
      'wedding_ceremony': 1.5, // Can't be late to ceremony
      'first_look': 1.3,
      'family_photos': 1.2,
      'reception': 1.0,
      'engagement': 0.8 // More flexible timing
    };
    
    const multiplier = eventMultipliers[eventType] || 1.0;
    
    return Math.round(baseDelay * multiplier);
  }

  /**
   * Get event-specific buffer requirements
   */
  private getEventSpecificBuffer(eventType: string): number {
    const eventBuffers: Record<string, number> = {
      'wedding_ceremony': 20, // Critical timing
      'first_look': 15,
      'family_photos': 10,
      'reception': 10,
      'engagement': 5,
      'bridal_prep': 15,
      'groom_prep': 10,
      'venue_setup': 30 // Equipment setup time
    };
    
    return eventBuffers[eventType] || 10;
  }

  /**
   * Calculate confidence score for the prediction
   */
  private calculateConfidence(trafficData: TrafficData, weather: WeatherCondition): number {
    let confidence = 100;
    
    // Reduce confidence for severe traffic
    if (trafficData.trafficLevel === 'severe') confidence -= 30;
    else if (trafficData.trafficLevel === 'heavy') confidence -= 20;
    else if (trafficData.trafficLevel === 'moderate') confidence -= 10;
    
    // Reduce confidence for severe weather
    if (weather.condition === 'storm') confidence -= 40;
    else if (weather.severity === 'heavy') confidence -= 25;
    else if (weather.severity === 'moderate') confidence -= 15;
    
    // Reduce confidence for low visibility
    if (weather.visibility < 1) confidence -= 30;
    else if (weather.visibility < 3) confidence -= 20;
    
    return Math.max(confidence, 20); // Minimum 20% confidence
  }

  /**
   * Determine traffic level from route data
   */
  private determineTrafficLevel(leg: any): TrafficData['trafficLevel'] {
    const currentDuration = leg.duration_in_traffic?.value || leg.duration.value;
    const typicalDuration = leg.duration.value;
    const ratio = currentDuration / typicalDuration;
    
    if (ratio < 1.1) return 'light';
    if (ratio < 1.3) return 'moderate';
    if (ratio < 1.6) return 'heavy';
    return 'severe';
  }

  /**
   * Update timeline events with dynamic travel buffers
   */
  async updateTimelineWithTravelBuffers(
    events: TimelineEvent[],
    locations: Record<string, LocationData>
  ): Promise<TimelineEvent[]> {
    const updatedEvents = [...events];
    
    for (let i = 0; i < updatedEvents.length - 1; i++) {
      const currentEvent = updatedEvents[i];
      const nextEvent = updatedEvents[i + 1];
      
      // Skip if same location
      if (currentEvent.location === nextEvent.location) continue;
      
      const origin = locations[currentEvent.location];
      const destination = locations[nextEvent.location];
      
      if (!origin || !destination) continue;
      
      try {
        const travelBuffer = await this.calculateTravelBuffer(
          origin,
          destination,
          currentEvent.endTime,
          nextEvent.type
        );
        
        // Update the travel buffer for the next event
        nextEvent.travelBuffer = travelBuffer.totalBuffer;
        
        // Adjust start time if needed
        const requiredStartTime = new Date(
          currentEvent.endTime.getTime() + travelBuffer.totalBuffer * 60 * 1000
        );
        
        if (requiredStartTime > nextEvent.startTime) {
          const delay = requiredStartTime.getTime() - nextEvent.startTime.getTime();
          nextEvent.startTime = requiredStartTime;
          nextEvent.endTime = new Date(nextEvent.endTime.getTime() + delay);
          
          // Add travel warning note
          nextEvent.notes = (nextEvent.notes || '') + 
            ` [AUTO-ADJUSTED: +${Math.round(delay / 60000)}min for traffic/weather]`;
        }
        
      } catch (error) {
        console.error(`Error updating travel buffer for ${nextEvent.title}:`, error);
      }
    }
    
    return updatedEvents;
  }

  /**
   * Generate travel alerts for the timeline
   */
  generateTravelAlerts(
    events: TimelineEvent[],
    travelBuffers: TravelBuffer[]
  ): Array<{
    eventId: string;
    type: 'warning' | 'critical' | 'info';
    message: string;
    recommendation: string;
  }> {
    const alerts: Array<{
      eventId: string;
      type: 'warning' | 'critical' | 'info';
      message: string;
      recommendation: string;
    }> = [];
    
    for (let i = 0; i < travelBuffers.length; i++) {
      const buffer = travelBuffers[i];
      const event = events[i + 1]; // Next event after travel
      
      if (!event) continue;
      
      // Critical alert for very long delays
      if (buffer.totalBuffer > 60) {
        alerts.push({
          eventId: event.id,
          type: 'critical',
          message: `Severe travel delay expected: ${buffer.totalBuffer} minutes`,
          recommendation: 'Consider rescheduling or choosing alternate route'
        });
      }
      
      // Warning for moderate delays
      else if (buffer.totalBuffer > 30) {
        alerts.push({
          eventId: event.id,
          type: 'warning',
          message: `Extended travel time: ${buffer.totalBuffer} minutes`,
          recommendation: 'Monitor traffic and weather conditions'
        });
      }
      
      // Low confidence warning
      if (buffer.confidence < 60) {
        alerts.push({
          eventId: event.id,
          type: 'warning',
          message: `Travel prediction uncertain (${buffer.confidence}% confidence)`,
          recommendation: 'Add extra buffer time and monitor conditions'
        });
      }
    }
    
    return alerts;
  }
}

export default DynamicTravelService;
export type { TravelBuffer, WeatherCondition, TrafficData, LocationData };
