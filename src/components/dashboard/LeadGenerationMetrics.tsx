import React, { useState, useEffect } from 'react';
// REMOVED FIREBASE: import { collection, doc, getDoc // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../../firebase/config';
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  Star,
  ArrowRight, 
  Clock, 
  MousePointer, 
  TrendingUp, 
  Percent,
  Award,
  Briefcase
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  tooltip: string;
  isPercentage?: boolean;
  isCurrency?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  tooltip,
  isPercentage = false,
  isCurrency = false
}) => {
  const formattedValue = isCurrency 
    ? `$${Number(value).toLocaleString()}`
    : isPercentage
      ? `${value}%`
      : value;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1 group relative">
            <span>{title}</span>
            <div className="absolute invisible group-hover:visible bg-black text-white text-xs rounded p-2 -mt-16 z-10 w-56">
              {tooltip}
            </div>
          </div>
          <p className="text-2xl font-light">{formattedValue}</p>
          <div className={`flex items-center gap-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'} text-sm mt-1`}>
            <span className={`transform ${change >= 0 ? 'rotate-0' : 'rotate-180'}`}>
              <TrendingUp className="w-4 h-4" />
            </span>
            <span>{Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'}</span>
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function LeadGenerationMetrics() {
  const [timeframe, setTimeframe] = useState('30');
  const [metrics, setMetrics] = useState({
    conversionRate: 0,
    costPerLead: 0,
    leadQualityScore: 0,
    bounceRate: 0,
    sessionDuration: '0:00',
    ctr: 0,
    mqlToSqlRate: 0,
    leadVelocityRate: 0,
    landingPageConversion: 0,
    customerLifetimeValue: 0,
    customerAcquisitionCost: 0,
    romi: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch metrics data
  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        // Here you would fetch real data from your Firestore
        // This is a placeholder for demonstration
        
        // Example of how you might fetch data:
        // const metricsRef = collection(db, 'analytics');
        // const q = query(metricsRef, where('date', '>=', startDate), orderBy('date', 'desc'));
        // const querySnapshot = await getDocs(q);
        // Process the data...
        
        // Fetch metrics from Firestore
        const leadMetricsRef = doc(collection(db, 'analytics'), 'leadMetrics');
        const leadMetricsDoc = await getDoc(leadMetricsRef);
        
        if (leadMetricsDoc.exists()) {
          const data = leadMetricsDoc.data() as any;
          setMetrics({
            conversionRate: data.conversionRate || 0,
            costPerLead: data.costPerLead || 0,
            leadQualityScore: data.averageQualityScore || 0,
            bounceRate: data.bounceRate || 0,
            sessionDuration: data.sessionDuration || '0:00',
            ctr: data.ctr || 0,
            mqlToSqlRate: data.mqlToSqlRate || 0,
            leadVelocityRate: data.leadVelocityRate || 0,
            landingPageConversion: data.landingPageConversion || 0,
            customerLifetimeValue: data.customerLifetimeValue || 0,
            customerAcquisitionCost: data.customerAcquisitionCost || 0,
            romi: data.returnOnMarketingInvestment || 0
          });
        } else {
          console.warn('No leadMetrics document found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMetrics();
  }, [timeframe]);
  
  // Chart data for conversion funnel
  const funnelData = {
    labels: ['Website Visitors', 'Leads', 'MQLs', 'SQLs', 'Customers'],
    datasets: [
      {
        label: 'Conversion Funnel',
        data: [1000, 1000 * (metrics.conversionRate / 100), 1000 * (metrics.conversionRate / 100) * 0.6, 1000 * (metrics.conversionRate / 100) * 0.6 * (metrics.mqlToSqlRate / 100), 1000 * (metrics.conversionRate / 100) * 0.6 * (metrics.mqlToSqlRate / 100) * 0.4],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };
  
  // Chart data for lead sources
  const leadSourceData = {
    labels: ['Organic Search', 'Social Media', 'Direct', 'Referral', 'Email'],
    datasets: [
      {
        label: 'Lead Sources',
        data: [42, 28, 15, 10, 5],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };
  
  const funnelOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const percentage = context.dataIndex === 0 
              ? '100%' 
              : `${(value / funnelData.datasets[0].data[0] * 100).toFixed(1)}%`;
            return `${context.label}: ${Math.round(value)} (${percentage})`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };
  
  const leadSourceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Lead Generation Metrics</h3>
        <select 
          className="text-sm border rounded-lg px-3 py-2"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <h4 className="text-md font-medium mb-4 text-gray-700">1. Lead Generation Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <MetricCard 
              title="Traffic-to-Lead Conversion Rate" 
              value={metrics.conversionRate} 
              change={0} 
              icon={<Percent className="w-5 h-5 text-blue-500" />}
              tooltip="Percentage of website visitors who become leads"
              isPercentage
            />
            <MetricCard 
              title="Cost Per Lead (CPL)" 
              value={metrics.costPerLead} 
              change={0} 
              icon={<DollarSign className="w-5 h-5 text-green-500" />}
              tooltip="Average cost to acquire one lead"
              isCurrency
            />
            <MetricCard 
              title="Lead Quality Score" 
              value={metrics.leadQualityScore} 
              change={0} 
              icon={<Star className="w-5 h-5 text-yellow-500" />}
              tooltip="Average quality score of leads (1-10 scale)"
            />
          </div>
          
          <h4 className="text-md font-medium mb-4 text-gray-700">2. Website Engagement Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <MetricCard 
              title="Bounce Rate" 
              value={metrics.bounceRate} 
              change={0} 
              icon={<ArrowRight className="w-5 h-5 text-red-500" />}
              tooltip="Percentage of visitors who leave after viewing only one page"
              isPercentage
            />
            <MetricCard 
              title="Avg. Session Duration" 
              value={metrics.sessionDuration} 
              change={0} 
              icon={<Clock className="w-5 h-5 text-purple-500" />}
              tooltip="Average time visitors spend on your website"
            />
            <MetricCard 
              title="Click-Through Rate (CTR)" 
              value={metrics.ctr} 
              change={0} 
              icon={<MousePointer className="w-5 h-5 text-blue-500" />}
              tooltip="Percentage of viewers who click on links or CTAs"
              isPercentage
            />
          </div>
          
          <h4 className="text-md font-medium mb-4 text-gray-700">3. Conversion Funnel Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <MetricCard 
              title="MQL to SQL Rate" 
              value={metrics.mqlToSqlRate} 
              change={0} 
              icon={<Users className="w-5 h-5 text-indigo-500" />}
              tooltip="Percentage of Marketing Qualified Leads that become Sales Qualified Leads"
              isPercentage
            />
            <MetricCard 
              title="Lead Velocity Rate" 
              value={metrics.leadVelocityRate} 
              change={0} 
              icon={<TrendingUp className="w-5 h-5 text-green-500" />}
              tooltip="Month-over-month growth rate of qualified leads"
              isPercentage
            />
            <MetricCard 
              title="Landing Page Conversion" 
              value={metrics.landingPageConversion} 
              change={0} 
              icon={<BarChart3 className="w-5 h-5 text-orange-500" />}
              tooltip="Percentage of landing page visitors who convert to leads"
              isPercentage
            />
          </div>
          
          <h4 className="text-md font-medium mb-4 text-gray-700">4. Customer Value Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <MetricCard 
              title="Customer Lifetime Value" 
              value={metrics.customerLifetimeValue} 
              change={0} 
              icon={<Award className="w-5 h-5 text-yellow-500" />}
              tooltip="Predicted revenue a customer will generate throughout their relationship with you"
              isCurrency
            />
            <MetricCard 
              title="Customer Acquisition Cost" 
              value={metrics.customerAcquisitionCost} 
              change={0} 
              icon={<Briefcase className="w-5 h-5 text-blue-500" />}
              tooltip="Total cost of acquiring a new customer"
              isCurrency
            />
          </div>
          
          <h4 className="text-md font-medium mb-4 text-gray-700">5. ROI Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
            <MetricCard 
              title="Return on Marketing Investment" 
              value={metrics.romi} 
              change={0} 
              icon={<DollarSign className="w-5 h-5 text-green-500" />}
              tooltip="Percentage return on marketing investment"
              isPercentage
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h4 className="text-md font-medium mb-4 text-gray-700">Conversion Funnel</h4>
              <Bar data={funnelData} options={funnelOptions} height={300} />
            </div>
            <div>
              <h4 className="text-md font-medium mb-4 text-gray-700">Lead Sources</h4>
              <div className="h-[300px] flex items-center justify-center">
                <Bar data={leadSourceData} options={leadSourceOptions} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
