/**
 * Calendar Dashboard Component
 * 
 * Integrates Google Calendar with Mission Control Analytics
 * to display upcoming sessions, booking metrics, and calendar insights.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Plus,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { googleCalendarService, CalendarEvent, CalendarMetrics } from '../../services/GoogleCalendarService';

// Calendar Authentication Component
const CalendarAuth = ({ onAuthenticated }: { onAuthenticated: () => void }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if credentials are configured
  const hasCredentials = import.meta.env.VITE_GOOGLE_API_KEY && import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleAuthenticate = async () => {
    if (!hasCredentials) {
      setError('Google Calendar credentials not configured. Please add VITE_GOOGLE_API_KEY and VITE_GOOGLE_CLIENT_ID to your environment variables.');
      return;
    }

    setIsAuthenticating(true);
    setError(null);
    try {
      const success = await googleCalendarService.authenticate();
      if (success) {
        onAuthenticated();
      } else {
        setError('Failed to authenticate with Google Calendar. Please try again.');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('Authentication failed. Please check your internet connection and try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Connect Google Calendar</h3>
      <p className="text-gray-600 mb-6">
        Connect your Google Calendar to track upcoming sessions, analyze booking patterns, and get insights into your schedule.
      </p>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handleAuthenticate}
        disabled={isAuthenticating}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 mx-auto"
      >
        {isAuthenticating ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : (
          <Calendar className="w-5 h-5" />
        )}
        <span>{isAuthenticating ? 'Connecting...' : 'Connect Calendar'}</span>
      </button>
    </div>
  );
};

// Upcoming Sessions Component
const UpcomingSessions = ({ sessions }: { sessions: CalendarEvent[] }) => {
  const formatEventTime = (event: CalendarEvent) => {
    const startTime = event.start.dateTime || event.start.date;
    if (!startTime) return 'No time specified';
    
    const date = new Date(startTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Upcoming Sessions</span>
        </h3>
        <span className="text-sm text-gray-500">{sessions.length} sessions</span>
      </div>
      
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming sessions</p>
          </div>
        ) : (
          sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{session.summary}</h4>
                  <p className="text-sm text-gray-600 mt-1">{formatEventTime(session)}</p>
                  {session.location && (
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {session.location}
                    </p>
                  )}
                  {session.attendees && session.attendees.length > 0 && (
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Users className="w-4 h-4 mr-1" />
                      {session.attendees.length} attendee{session.attendees.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <a
                  href={session.htmlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

// Calendar Metrics Cards
const CalendarMetricsCards = ({ metrics }: { metrics: CalendarMetrics }) => {
  const cards = [
    {
      title: 'Weekly Bookings',
      value: metrics.weeklyBookings,
      icon: Calendar,
      color: 'blue',
      trend: 'up'
    },
    {
      title: 'Monthly Bookings',
      value: metrics.monthlyBookings,
      icon: TrendingUp,
      color: 'green',
      trend: 'up'
    },
    {
      title: 'Avg Session Duration',
      value: `${metrics.averageSessionDuration}m`,
      icon: Clock,
      color: 'purple',
      trend: 'neutral'
    },
    {
      title: 'Client Response Rate',
      value: `${metrics.clientResponseRate}%`,
      icon: CheckCircle,
      color: metrics.clientResponseRate >= 80 ? 'green' : metrics.clientResponseRate >= 60 ? 'yellow' : 'red',
      trend: metrics.clientResponseRate >= 80 ? 'up' : 'down'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      red: 'bg-red-50 text-red-600 border-red-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-6 rounded-lg border-2 ${getColorClasses(card.color)}`}
        >
          <div className="flex items-center justify-between mb-4">
            <card.icon className="w-8 h-8" />
            {card.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
            {card.trend === 'down' && <AlertCircle className="w-4 h-4 text-red-500" />}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium opacity-80">{card.title}</p>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Busy Hours Chart
const BusyHoursChart = ({ busyHours }: { busyHours: Array<{ hour: number; count: number }> }) => {
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${period}`;
  };

  const maxCount = Math.max(...busyHours.map(h => h.count), 1);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold mb-4 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5" />
        <span>Busiest Hours</span>
      </h3>
      
      <div className="space-y-3">
        {busyHours.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No booking data available</p>
          </div>
        ) : (
          busyHours.map((hour, index) => (
            <div key={hour.hour} className="flex items-center space-x-3">
              <span className="text-sm font-medium w-12">{formatHour(hour.hour)}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(hour.count / maxCount) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="bg-blue-500 h-2 rounded-full"
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{hour.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Popular Days Chart
const PopularDaysChart = ({ popularDays }: { popularDays: Array<{ day: string; count: number }> }) => {
  const maxCount = Math.max(...popularDays.map(d => d.count), 1);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold mb-4 flex items-center space-x-2">
        <PieChart className="w-5 h-5" />
        <span>Popular Days</span>
      </h3>
      
      <div className="space-y-3">
        {popularDays.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No booking data available</p>
          </div>
        ) : (
          popularDays.map((day, index) => (
            <div key={day.day} className="flex items-center space-x-3">
              <span className="text-sm font-medium w-16">{day.day.slice(0, 3)}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(day.count / maxCount) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="bg-green-500 h-2 rounded-full"
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{day.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Main Calendar Dashboard Component
export default function CalendarDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [metrics, setMetrics] = useState<CalendarMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    if (googleCalendarService.isAuthenticated()) {
      setIsAuthenticated(true);
      loadCalendarData();
    }
  }, []);

  const loadCalendarData = async () => {
    setIsLoading(true);
    try {
      const calendarMetrics = await googleCalendarService.getCalendarMetrics();
      setMetrics(calendarMetrics);
    } catch (error) {
      console.error('Failed to load calendar data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    loadCalendarData();
  };

  const handleRefresh = () => {
    loadCalendarData();
  };

  if (!isAuthenticated) {
    return <CalendarAuth onAuthenticated={handleAuthenticated} />;
  }

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading calendar data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendar Analytics</h2>
          <p className="text-gray-600">Track your sessions, bookings, and schedule insights</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <CalendarMetricsCards metrics={metrics} />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Upcoming Sessions */}
        <div className="lg:col-span-1">
          <UpcomingSessions sessions={metrics.upcomingSessions} />
        </div>

        {/* Right Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <BusyHoursChart busyHours={metrics.busyHours} />
          <PopularDaysChart popularDays={metrics.popularDays} />
        </div>
      </div>

      {/* Today's Sessions */}
      {metrics.todaysSessions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Today's Sessions ({metrics.todaysSessions.length})</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {metrics.todaysSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg p-4 border border-blue-100">
                <h4 className="font-medium text-gray-900">{session.summary}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {session.start.dateTime && new Date(session.start.dateTime).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                {session.location && (
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {session.location}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
