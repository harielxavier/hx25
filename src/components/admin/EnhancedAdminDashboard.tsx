import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminStatsCard } from './AdminStatsCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Mail,
  Camera,
  FileText,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stat {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'inquiry' | 'gallery' | 'payment';
  title: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed';
}

interface UpcomingJob {
  id: string;
  clientName: string;
  date: string;
  venue?: string;
  status: string;
}

interface EnhancedAdminDashboardProps {
  stats?: Stat[];
  recentActivities?: RecentActivity[];
  upcomingJobs?: UpcomingJob[];
  isLoading?: boolean;
}

export function EnhancedAdminDashboard({
  stats = [],
  recentActivities = [],
  upcomingJobs = [],
  isLoading = false,
}: EnhancedAdminDashboardProps) {
  // Default stats if none provided
  const defaultStats: Stat[] = [
    {
      title: 'Total Revenue',
      value: '$0',
      description: 'This month',
      trend: { value: 12.5, isPositive: true },
    },
    {
      title: 'Active Bookings',
      value: 0,
      description: 'Upcoming weddings',
      trend: { value: 8.2, isPositive: true },
    },
    {
      title: 'Inquiries',
      value: 0,
      description: 'This month',
      trend: { value: 15.3, isPositive: true },
    },
    {
      title: 'Galleries',
      value: 0,
      description: 'Active galleries',
    },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  const statIcons = [DollarSign, Calendar, Mail, Camera];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return Calendar;
      case 'inquiry':
        return Mail;
      case 'gallery':
        return Camera;
      case 'payment':
        return DollarSign;
      default:
        return FileText;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-40"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat, index) => (
          <AdminStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={statIcons[index % statIcons.length]}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Upcoming Jobs */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Weddings</CardTitle>
                <CardDescription>Your next photography jobs</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/jobs">
                  View All
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingJobs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.clientName}</TableCell>
                      <TableCell>{job.date}</TableCell>
                      <TableCell>{job.venue || 'TBD'}</TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming weddings scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                      {getStatusBadge(activity.status)}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common admin tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link to="/admin/galleries">
                <Camera className="h-6 w-6 mb-2" />
                <span>Manage Galleries</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link to="/admin/jobs">
                <Calendar className="h-6 w-6 mb-2" />
                <span>View Bookings</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link to="/admin/clients">
                <Users className="h-6 w-6 mb-2" />
                <span>Client List</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link to="/admin/analytics">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span>Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

