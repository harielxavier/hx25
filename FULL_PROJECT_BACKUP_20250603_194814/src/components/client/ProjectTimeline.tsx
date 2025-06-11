import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  Circle, 
  Calendar, 
  Camera, 
  Edit, 
  Send,
  Download,
  Star,
  AlertCircle
} from 'lucide-react';
import { Job } from '../../services/jobsService';

interface ProjectTimelineProps {
  clientId: string;
  job: Job;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  status: 'completed' | 'in_progress' | 'upcoming' | 'overdue';
  type: 'milestone' | 'task' | 'delivery' | 'meeting';
  estimatedDuration?: string;
  dependencies?: string[];
  assignee?: string;
  deliverables?: string[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ clientId, job }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'upcoming' | 'overdue'>('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockEvents: TimelineEvent[] = [
      {
        id: '1',
        title: 'Initial Consultation',
        description: 'Meet to discuss your vision, preferences, and wedding details',
        date: new Date('2024-01-10'),
        status: 'completed',
        type: 'meeting',
        estimatedDuration: '1 hour',
        assignee: 'Hariel Xavier'
      },
      {
        id: '2',
        title: 'Contract Signing',
        description: 'Review and sign photography agreement and model release forms',
        date: new Date('2024-01-15'),
        status: 'completed',
        type: 'milestone',
        deliverables: ['Photography Agreement', 'Model Release Form']
      },
      {
        id: '3',
        title: 'Engagement Session',
        description: 'Capture beautiful engagement photos at your chosen location',
        date: new Date('2024-02-14'),
        status: 'completed',
        type: 'task',
        estimatedDuration: '2 hours',
        assignee: 'Hariel Xavier',
        deliverables: ['50+ edited photos', 'Online gallery access']
      },
      {
        id: '4',
        title: 'Engagement Photos Delivered',
        description: 'Receive your beautifully edited engagement photos',
        date: new Date('2024-02-28'),
        status: 'completed',
        type: 'delivery',
        deliverables: ['High-resolution images', 'Print release']
      },
      {
        id: '5',
        title: 'Wedding Day Timeline Planning',
        description: 'Finalize the photography timeline for your wedding day',
        date: new Date('2024-03-15'),
        status: 'in_progress',
        type: 'meeting',
        estimatedDuration: '30 minutes',
        assignee: 'Hariel Xavier'
      },
      {
        id: '6',
        title: 'Final Payment Due',
        description: 'Complete final payment before wedding day',
        date: new Date('2024-04-01'),
        status: 'upcoming',
        type: 'milestone'
      },
      {
        id: '7',
        title: 'Wedding Day Photography',
        description: 'Capture your special day from getting ready to reception',
        date: job.mainShootDate?.toDate() || new Date('2024-04-15'),
        status: 'upcoming',
        type: 'task',
        estimatedDuration: '8-10 hours',
        assignee: 'Hariel Xavier',
        deliverables: ['500+ photos', 'Same-day sneak peeks']
      },
        {
          id: '8',
          title: 'Sneak Peek Delivery',
          description: 'Receive 10-15 preview photos within 48 hours',
          date: new Date((job.mainShootDate?.toDate().getTime() || Date.now()) + 2 * 24 * 60 * 60 * 1000),
          status: 'upcoming',
          type: 'delivery',
          estimatedDuration: '48 hours',
          deliverables: ['Sneak peek gallery']
        },
        {
          id: '9',
          title: 'Photo Editing & Processing',
          description: 'Professional editing and color correction of all wedding photos',
          date: new Date((job.mainShootDate?.toDate().getTime() || Date.now()) + 7 * 24 * 60 * 60 * 1000),
          status: 'upcoming',
          type: 'task',
          estimatedDuration: '4-6 weeks',
          assignee: 'Hariel Xavier'
        },
        {
          id: '10',
          title: 'Final Gallery Delivery',
          description: 'Complete wedding gallery with all edited photos',
          date: new Date((job.mainShootDate?.toDate().getTime() || Date.now()) + 42 * 24 * 60 * 60 * 1000),
          status: 'upcoming',
          type: 'delivery',
          deliverables: ['Full wedding gallery', 'High-resolution downloads', 'Print release']
        }
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, [clientId, job]);

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const getStatusIcon = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'upcoming':
        return <Circle className="w-5 h-5 text-gray-400" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'upcoming':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'overdue':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'milestone':
        return <Star className="w-4 h-4" />;
      case 'task':
        return <Camera className="w-4 h-4" />;
      case 'delivery':
        return <Download className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getProgressPercentage = () => {
    const completedEvents = events.filter(event => event.status === 'completed').length;
    return Math.round((completedEvents / events.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Project Timeline</h2>
            <p className="text-gray-600">Track your photography project progress</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{getProgressPercentage()}% Complete</span>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="relative flex items-start space-x-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* Timeline Dot */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-full">
                  {getStatusIcon(event.status)}
                </div>
                
                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className={`border rounded-xl p-6 ${getStatusColor(event.status)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(event.type)}
                            <span className="text-sm font-medium capitalize">{event.type}</span>
                          </div>
                          
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {event.status.replace('_', ' ')}
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <p className="font-medium">{event.date.toLocaleDateString()}</p>
                          </div>
                          
                          {event.estimatedDuration && (
                            <div>
                              <span className="text-gray-500">Duration:</span>
                              <p className="font-medium">{event.estimatedDuration}</p>
                            </div>
                          )}
                          
                          {event.assignee && (
                            <div>
                              <span className="text-gray-500">Assignee:</span>
                              <p className="font-medium">{event.assignee}</p>
                            </div>
                          )}
                        </div>
                        
                        {event.deliverables && event.deliverables.length > 0 && (
                          <div className="mt-4">
                            <span className="text-gray-500 text-sm">Deliverables:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {event.deliverables.map((deliverable, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium"
                                >
                                  {deliverable}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <div className="text-right text-sm text-gray-500">
                          {event.date.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {events.filter(e => e.status === 'completed').length}
          </p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {events.filter(e => e.status === 'in_progress').length}
          </p>
          <p className="text-sm text-gray-600">In Progress</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Circle className="w-4 h-4 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-600">
            {events.filter(e => e.status === 'upcoming').length}
          </p>
          <p className="text-sm text-gray-600">Upcoming</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">
            {events.filter(e => e.status === 'overdue').length}
          </p>
          <p className="text-sm text-gray-600">Overdue</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
