import React, { useEffect, useState } from 'react';
// REMOVED FIREBASE: import { doc, setDoc, collection, getDoc, getDocs, query, orderBy, limit, Timestamp // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../../firebase/config';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useLocation, Link } from 'react-router-dom';
import { Job, getAllJobs } from '../../services/jobsService';
import { format, subMonths } from 'date-fns';
import { Helmet } from 'react-helmet-async';

// Mock data for charts where real data isn't easily available
const MOCK_DATA = {
  deviceData: [
    { name: 'Desktop', value: 0 },
    { name: 'Mobile', value: 0 },
    { name: 'Tablet', value: 0 }
  ],
  audienceData: [
    { name: 'New Users', value: 0 },
    { name: 'Returning Users', value: 0 }
  ],
  audienceAge: [
    { name: '18-24', users: 0 },
    { name: '25-34', users: 0 },
    { name: '35-44', users: 0 },
    { name: '45-54', users: 0 },
    { name: '55+', users: 0 }
  ],
  conversionData: [
    { name: 'Jan', bookings: 0, inquiries: 0 },
    { name: 'Feb', bookings: 0, inquiries: 0 },
    { name: 'Mar', bookings: 0, inquiries: 0 },
    { name: 'Apr', bookings: 0, inquiries: 0 },
    { name: 'May', bookings: 0, inquiries: 0 },
    { name: 'Jun', bookings: 0, inquiries: 0 }
  ],
  conversionSources: [
    { name: 'Direct', value: 0 },
    { name: 'Social Media', value: 0 },
    { name: 'Search', value: 0 },
    { name: 'Referral', value: 0 },
    { name: 'Other', value: 0 }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalUsers: 0,
    conversionRate: 0,
    avgSessionTime: '0:00',
    bookings: 0,
    inquiries: 0
  });
  
  const [upcomingJobs, setUpcomingJobs] = useState<Job[]>([]);
  const [outstandingPayments, setOutstandingPayments] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  
  const [pageViews, setPageViews] = useState<{ name: string; views: number }[]>([]);
  const [popularPages, setPopularPages] = useState<{ name: string; views: number }[]>([]);
  const [deviceData] = useState(MOCK_DATA.deviceData);
  const [audienceData] = useState(MOCK_DATA.audienceData);
  const [audienceAge] = useState(MOCK_DATA.audienceAge);
  const [conversionData] = useState(MOCK_DATA.conversionData);
  const [conversionSources] = useState(MOCK_DATA.conversionSources);

  // Determine which dashboard to show
  const currentPath = location.pathname;
  const isAudience = currentPath === '/admin/audience';
  const isConversions = currentPath === '/admin/conversions';

  // Fetch jobs data
  const fetchJobsData = async () => {
    try {
      setJobsLoading(true);
      const allJobs = await getAllJobs();
      
      // Filter for upcoming jobs
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcoming = allJobs
        .filter(job => {
          if (!job.mainShootDate) return false;
          const shootDate = job.mainShootDate.toDate();
          return shootDate >= today && job.status !== 'cancelled';
        })
        .sort((a, b) => {
          const dateA = a.mainShootDate?.toDate() || new Date();
          const dateB = b.mainShootDate?.toDate() || new Date();
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, 5);
      
      // Filter for outstanding payments
      const outstanding = allJobs.filter(job => {
        return (
          job.status === 'completed' && 
          (!job.paymentStatus || job.paymentStatus !== 'paid')
        );
      });
      
      setUpcomingJobs(upcoming);
      setOutstandingPayments(outstanding);
      setJobsLoading(false);
    } catch (error) {
      console.error('Error fetching jobs data:', error);
      setJobsLoading(false);
    }
  };

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Track page view
        const analyticsRef = doc(collection(db, 'analytics'), 'dashboard');
        await setDoc(analyticsRef, {
          lastViewed: new Date().toISOString(),
          viewCount: stats.totalViews + 1
        }, { merge: true });
        
        // Fetch stats
        const leadMetricsRef = doc(db, 'analytics', 'leadMetrics');
        const pageViewsRef = doc(db, 'analytics', 'pageViews');
        
        const [leadMetricsSnap, pageViewsSnap] = await Promise.all([
          getDoc(leadMetricsRef),
          getDoc(pageViewsRef)
        ]);
        
        const leadMetricsData = leadMetricsSnap.exists() ? leadMetricsSnap.data() : { totalLeads: 0, conversionRate: 0 };
        const pageViewsData = pageViewsSnap.exists() ? pageViewsSnap.data() : { total: 0 };
        
        setStats(prev => ({
          ...prev,
          totalViews: pageViewsData.total || 0,
          inquiries: leadMetricsData.totalLeads || 0,
          conversionRate: leadMetricsData.conversionRate || 0,
        }));

        // Fetch popular pages
        if (pageViewsSnap.exists()) {
          const pvData = pageViewsSnap.data();
          const pages = Object.entries(pvData)
            .filter(([key]) => key !== 'initialized' && key !== 'lastUpdated' && key !== 'total')
            .map(([key, value]) => ({
              name: key.replace(/_/g, '/').replace('pageViews/', ''),
              views: value as number
            }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 10);
          setPopularPages(pages);
        }

        // Create page views time series data
        const monthlyViews: { [key: string]: number } = {};
        const monthsToFetch = 6;
        
        for (let i = 0; i < monthsToFetch; i++) {
          const targetMonth = subMonths(new Date(), i);
          const monthKey = format(targetMonth, 'MMM');
          monthlyViews[monthKey] = 0;
        }
        
        const pageViewsChartData = Object.entries(monthlyViews)
          .map(([name, views]) => ({ name, views }))
          .reverse();
        setPageViews(pageViewsChartData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
    fetchJobsData();
  }, []);

  // Render dashboard based on current path
  const renderDashboard = () => {
    if (isAudience) {
      return (
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-6">Audience Insights</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Total Users</h3>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">New Users</h3>
              <p className="text-3xl font-bold">{Math.round(stats.totalUsers * 0.65)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Returning Users</h3>
              <p className="text-3xl font-bold">{Math.round(stats.totalUsers * 0.35)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Avg. Session Duration</h3>
              <p className="text-3xl font-bold">{stats.avgSessionTime}</p>
            </div>
          </div>
        </div>
      );
    } else if (isConversions) {
      return (
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-6">Conversion Analytics</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Conversion Rate</h3>
              <p className="text-3xl font-bold">{stats.conversionRate}%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Total Bookings</h3>
              <p className="text-3xl font-bold">{stats.bookings}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Total Inquiries</h3>
              <p className="text-3xl font-bold">{stats.inquiries}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Avg. Booking Value</h3>
              <p className="text-3xl font-bold">$2,450</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </div>
          
          {/* Upcoming Jobs and Outstanding Payments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Upcoming Jobs Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">Upcoming Jobs</h3>
                <Link to="/admin/jobs" className="text-sm text-blue-600 hover:underline">View All</Link>
              </div>
              
              {jobsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : upcomingJobs.length > 0 ? (
                <div className="space-y-3">
                  {upcomingJobs.map(job => (
                    <Link 
                      to={`/admin/jobs/${job.id}`} 
                      key={job.id}
                      className="block p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between">
                        <p className="font-medium">{job.name}</p>
                        <p className="text-sm text-gray-500">
                          {job.mainShootDate && format(job.mainShootDate.toDate(), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-sm text-gray-500">{job.clientName}</p>
                        <p className="text-sm text-gray-500">{job.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No upcoming jobs</p>
              )}
            </div>

            {/* Outstanding Payments Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">Outstanding Payments</h3>
                <Link to="/admin/jobs" className="text-sm text-blue-600 hover:underline">View All</Link>
              </div>
              
              {jobsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : outstandingPayments.length > 0 ? (
                <div className="space-y-3">
                  {outstandingPayments.map(job => (
                    <Link 
                      to={`/admin/jobs/${job.id}`} 
                      key={job.id}
                      className="block p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between">
                        <p className="font-medium">{job.name}</p>
                        <p className="text-sm font-medium text-red-600">
                          ${job.totalAmount ? job.totalAmount.toLocaleString() : '0'}
                        </p>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-sm text-gray-500">{job.clientName}</p>
                        <p className="text-sm text-gray-500">
                          {job.updatedAt && format(job.updatedAt.toDate(), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No outstanding payments</p>
              )}
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Total Page Views</h3>
              <p className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</p>
              <p className="text-green-500 text-sm">↑ 12% from last month</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Unique Visitors</h3>
              <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-green-500 text-sm">↑ 8% from last month</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Conversion Rate</h3>
              <p className="text-3xl font-bold">{stats.conversionRate}%</p>
              <p className="text-red-500 text-sm">↓ 1.5% from last month</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-gray-500 text-sm">Avg. Session Duration</h3>
              <p className="text-3xl font-bold">{stats.avgSessionTime}</p>
              <p className="text-green-500 text-sm">↑ 5% from last month</p>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-4">Page Views Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pageViews}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-4">Popular Pages</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularPages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-4">Device Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}: {name: string; percent: number}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="col-span-2 bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-4">Recent Activity</h3>
              <p className="text-gray-500 text-center py-8">No recent activity to display</p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Hariel Xavier Photography</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            {renderDashboard()}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
