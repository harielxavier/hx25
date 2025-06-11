import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar, 
  Camera,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  Heart,
  Brain,
  Eye,
  Thermometer
} from 'lucide-react';

interface HealthBarDashboardProps {
  jobs: Job[];
  leads: Lead[];
}

interface Job {
  id: string;
  name: string;
  status: 'pending' | 'confirmed' | 'active' | 'in_progress' | 'completed' | 'delivered';
  mainShootDate: Date;
  totalAmount: number;
  paidAmount: number;
  deliverables: Deliverable[];
  lastActivity: Date;
  clientResponseTime: number; // hours
  overdueTasks: number;
  healthScore: number; // 0-100
}

interface Lead {
  id: string;
  name: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'converted' | 'lost';
  source: string;
  value: number;
  lastContact: Date;
  responseTime: number; // hours
  qualityScore: number; // 0-100
}

interface Deliverable {
  id: string;
  name: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
}

interface HealthMetrics {
  overall: number;
  revenue: number;
  delivery: number;
  communication: number;
  pipeline: number;
}

interface CriticalItem {
  type: 'payment' | 'deliverable' | 'lead' | 'communication';
  priority: 'high' | 'medium' | 'low';
  message: string;
  jobId?: string;
  leadId?: string;
}

const HealthBarDashboard: React.FC<HealthBarDashboardProps> = ({ jobs, leads }) => {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    overall: 85,
    revenue: 92,
    delivery: 78,
    communication: 88,
    pipeline: 82
  });
  
  const [criticalItems, setCriticalItems] = useState<CriticalItem[]>([]);
  const [trends] = useState<any>({});

  // Mock data for demonstration
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        name: 'Amanda & Alex Wedding',
        status: 'active',
        mainShootDate: new Date('2024-04-15'),
        totalAmount: 4500,
        paidAmount: 3000,
        deliverables: [
          { id: '1', name: 'Engagement Photos', dueDate: new Date('2024-03-01'), status: 'completed' },
          { id: '2', name: 'Wedding Album', dueDate: new Date('2024-05-30'), status: 'in_progress' },
          { id: '3', name: 'Final Payment', dueDate: new Date('2024-04-01'), status: 'overdue' }
        ],
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        clientResponseTime: 4,
        overdueTasks: 1,
        healthScore: 75
      },
      {
        id: '2',
        name: 'Sarah & Michael Engagement',
        status: 'completed',
        mainShootDate: new Date('2024-03-20'),
        totalAmount: 1200,
        paidAmount: 1200,
        deliverables: [
          { id: '4', name: 'Engagement Photos', dueDate: new Date('2024-04-05'), status: 'completed' },
          { id: '5', name: 'Print Release', dueDate: new Date('2024-04-10'), status: 'completed' }
        ],
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        clientResponseTime: 2,
        overdueTasks: 0,
        healthScore: 95
      },
      {
        id: '3',
        name: 'Corporate Headshots - TechCorp',
        status: 'in_progress',
        mainShootDate: new Date('2024-04-25'),
        totalAmount: 2800,
        paidAmount: 1400,
        deliverables: [
          { id: '6', name: 'Headshot Gallery', dueDate: new Date('2024-05-10'), status: 'in_progress' },
          { id: '7', name: 'Team Photos', dueDate: new Date('2024-05-15'), status: 'pending' }
        ],
        lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        clientResponseTime: 24,
        overdueTasks: 0,
        healthScore: 60
      }
    ];

    const mockLeads: Lead[] = [
      {
        id: '1',
        name: 'Jennifer & David Wedding',
        status: 'proposal_sent',
        source: 'Instagram',
        value: 5200,
        lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        responseTime: 6,
        qualityScore: 85
      },
      {
        id: '2',
        name: 'Lisa Portrait Session',
        status: 'qualified',
        source: 'Referral',
        value: 800,
        lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        responseTime: 2,
        qualityScore: 70
      },
      {
        id: '3',
        name: 'Mark & Emma Engagement',
        status: 'new',
        source: 'Website',
        value: 1500,
        lastContact: new Date(Date.now() - 8 * 60 * 60 * 1000),
        responseTime: 0.5,
        qualityScore: 90
      }
    ];

    // Calculate health metrics
    const calculateHealthMetrics = (jobs: Job[], leads: Lead[]) => {
      // Revenue Health (payment completion rate)
      const totalRevenue = jobs.reduce((sum, job) => sum + job.totalAmount, 0);
      const paidRevenue = jobs.reduce((sum, job) => sum + job.paidAmount, 0);
      const revenueHealth = totalRevenue > 0 ? (paidRevenue / totalRevenue) * 100 : 100;

      // Delivery Health (on-time delivery rate)
      const allDeliverables = jobs.flatMap(job => job.deliverables);
      const completedOnTime = allDeliverables.filter(d => 
        d.status === 'completed' && d.dueDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      const deliveryHealth = allDeliverables.length > 0 ? (completedOnTime / allDeliverables.length) * 100 : 100;

      // Communication Health (response time)
      const avgResponseTime = jobs.reduce((sum, job) => sum + job.clientResponseTime, 0) / jobs.length;
      const communicationHealth = Math.max(0, 100 - (avgResponseTime * 2)); // Penalty for slow response

      // Pipeline Health (lead conversion rate)
      const qualifiedLeads = leads.filter(lead => ['qualified', 'proposal_sent'].includes(lead.status)).length;
      const pipelineHealth = leads.length > 0 ? (qualifiedLeads / leads.length) * 100 : 100;

      // Overall Health (weighted average)
      const overallHealth = (revenueHealth * 0.3 + deliveryHealth * 0.25 + communicationHealth * 0.25 + pipelineHealth * 0.2);

      return {
        overall: Math.round(overallHealth),
        revenue: Math.round(revenueHealth),
        delivery: Math.round(deliveryHealth),
        communication: Math.round(communicationHealth),
        pipeline: Math.round(pipelineHealth)
      };
    };

    // Find critical items needing attention
    const findCriticalItems = (jobs: Job[], leads: Lead[]): CriticalItem[] => {
      const critical: CriticalItem[] = [];

      // Overdue payments
      jobs.forEach(job => {
        if (job.paidAmount < job.totalAmount && job.status === 'active') {
          critical.push({
            type: 'payment',
            priority: 'high',
            message: `${job.name} - Payment overdue ($${job.totalAmount - job.paidAmount})`,
            jobId: job.id
          });
        }
      });

      // Overdue deliverables
      jobs.forEach(job => {
        job.deliverables.forEach(deliverable => {
          if (deliverable.status === 'overdue') {
            critical.push({
              type: 'deliverable',
              priority: 'high',
              message: `${job.name} - ${deliverable.name} overdue`,
              jobId: job.id
            });
          }
        });
      });

      // Stale leads
      leads.forEach(lead => {
        const daysSinceContact = (Date.now() - lead.lastContact.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceContact > 3 && lead.status !== 'converted' && lead.status !== 'lost') {
          critical.push({
            type: 'lead',
            priority: daysSinceContact > 7 ? 'high' : 'medium',
            message: `${lead.name} - No contact for ${Math.round(daysSinceContact)} days`,
            leadId: lead.id
          });
        }
      });

      // Poor communication
      jobs.forEach(job => {
        if (job.clientResponseTime > 24) {
          critical.push({
            type: 'communication',
            priority: 'medium',
            message: `${job.name} - Slow client response (${job.clientResponseTime}h)`,
            jobId: job.id
          });
        }
      });

      return critical.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    };

    const metrics = calculateHealthMetrics(mockJobs, mockLeads);
    const critical = findCriticalItems(mockJobs, mockLeads);

    setHealthMetrics(metrics);
    setCriticalItems(critical);
  }, []);

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-500';
    if (score >= 70) return 'text-yellow-600 bg-yellow-500';
    if (score >= 50) return 'text-orange-600 bg-orange-500';
    return 'text-red-600 bg-red-500';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-5 h-5" />;
    if (score >= 70) return <Clock className="w-5 h-5" />;
    if (score >= 50) return <AlertTriangle className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Health Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Business Health Dashboard</h2>
              <p className="text-gray-600">Real-time health monitoring for your photography business</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-800">{healthMetrics.overall}%</div>
            <div className="text-sm text-gray-600">Overall Health</div>
            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(healthMetrics.overall)}`}>
              {getHealthIcon(healthMetrics.overall)}
              <span className="text-white">
                {healthMetrics.overall >= 90 ? 'Excellent' : 
                 healthMetrics.overall >= 70 ? 'Good' : 
                 healthMetrics.overall >= 50 ? 'Fair' : 'Needs Attention'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{healthMetrics.revenue}%</div>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Revenue Health</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${healthMetrics.revenue}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">Payment completion rate</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{healthMetrics.delivery}%</div>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Delivery Health</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${healthMetrics.delivery}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">On-time delivery rate</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{healthMetrics.communication}%</div>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Communication</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${healthMetrics.communication}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">Response time quality</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-500"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{healthMetrics.pipeline}%</div>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Pipeline Health</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${healthMetrics.pipeline}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">Lead conversion rate</p>
        </motion.div>
      </div>

      {/* Critical Items Alert */}
      {criticalItems.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Needs Immediate Attention</h3>
              <p className="text-gray-600">{criticalItems.length} items require your focus today</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {criticalItems.slice(0, 5).map((item, index) => (
              <motion.div
                key={index}
                className={`border rounded-lg p-4 ${getPriorityColor(item.priority)}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.priority === 'high' ? 'bg-red-500' :
                      item.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <span className="font-medium">{item.message}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.priority.toUpperCase()}
                    </span>
                    
                    <button className="px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Take Action
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {criticalItems.length > 5 && (
            <div className="mt-4 text-center">
              <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                View {criticalItems.length - 5} more items →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Health Boosters</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <DollarSign className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm font-medium text-gray-800">Send Payment Reminders</span>
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-sm font-medium text-gray-800">Update Timelines</span>
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-sm font-medium text-gray-800">Follow Up Leads</span>
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Camera className="w-8 h-8 text-orange-500 mb-2" />
            <span className="text-sm font-medium text-gray-800">Check Deliverables</span>
          </button>
        </div>
      </div>

      {/* Health Trends */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Health Trends</h3>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+5% this week</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revenue Health</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
                <span className="text-sm font-medium">92%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Client Satisfaction</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }} />
                </div>
                <span className="text-sm font-medium">88%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Delivery Performance</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }} />
                </div>
                <span className="text-sm font-medium">78%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Recommendations</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Automate Payment Reminders</p>
                <p className="text-xs text-gray-600">Could improve revenue health by 8%</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Schedule Weekly Client Check-ins</p>
                <p className="text-xs text-gray-600">Could boost communication score by 12%</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Implement Lead Scoring</p>
                <p className="text-xs text-gray-600">Could increase pipeline health by 15%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthBarDashboard;
