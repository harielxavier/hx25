import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Calendar, Camera, ArrowUp, ArrowDown } from 'lucide-react';
// REMOVED FIREBASE: import { db } from '../../firebase/config';
// REMOVED FIREBASE: import { collection, getDocs, query, where, orderBy, Timestamp // REMOVED FIREBASE

interface Project {
  id: string;
  client_name: string;
  project_type: string;
  status: 'planning' | 'in_progress' | 'editing' | 'delivered' | 'completed';
  total_amount: number;
  paid_amount: number;
  event_date: Date;
  created_at: Date;
}

export default function ProjectProgress() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_revenue: 0,
    active_projects: 0,
    completed_this_month: 0,
    upcoming_events: 0
  });

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      // For now, use mock data since we're migrating from Supabase
      const mockProjects: Project[] = [
        {
          id: '1',
          client_name: 'Sarah & Michael',
          project_type: 'Wedding',
          status: 'editing',
          total_amount: 3500,
          paid_amount: 1750,
          event_date: new Date('2024-06-15'),
          created_at: new Date('2024-03-01')
        },
        {
          id: '2',
          client_name: 'Amanda & Alex',
          project_type: 'Engagement',
          status: 'completed',
          total_amount: 800,
          paid_amount: 800,
          event_date: new Date('2024-04-20'),
          created_at: new Date('2024-03-15')
        },
        {
          id: '3',
          client_name: 'Crysta & David',
          project_type: 'Wedding',
          status: 'in_progress',
          total_amount: 4200,
          paid_amount: 2100,
          event_date: new Date('2024-07-12'),
          created_at: new Date('2024-04-01')
        }
      ];

      setProjects(mockProjects);

      // Calculate stats
      const totalRevenue = mockProjects.reduce((sum, p) => sum + p.paid_amount, 0);
      const activeProjects = mockProjects.filter(p => ['planning', 'in_progress', 'editing'].includes(p.status)).length;
      const completedThisMonth = mockProjects.filter(p => 
        p.status === 'completed' && 
        p.created_at.getMonth() === new Date().getMonth()
      ).length;
      const upcomingEvents = mockProjects.filter(p => 
        p.event_date > new Date() && 
        p.event_date < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ).length;

      setStats({
        total_revenue: totalRevenue,
        active_projects: activeProjects,
        completed_this_month: completedThisMonth,
        upcoming_events: upcomingEvents
      });
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'editing': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-100 h-96 rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-light">{formatCurrency(stats.total_revenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Projects</p>
              <p className="text-2xl font-light">{stats.active_projects}</p>
            </div>
            <Camera className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed This Month</p>
              <p className="text-2xl font-light">{stats.completed_this_month}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming Events</p>
              <p className="text-2xl font-light">{stats.upcoming_events}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium">Recent Projects</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {projects.map((project) => (
            <div key={project.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{project.client_name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{project.project_type}</p>
                  <p className="text-sm text-gray-500">
                    Event: {project.event_date.toLocaleDateString()}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(project.paid_amount)} / {formatCurrency(project.total_amount)}</p>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(project.paid_amount / project.total_amount) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((project.paid_amount / project.total_amount) * 100)}% paid
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
