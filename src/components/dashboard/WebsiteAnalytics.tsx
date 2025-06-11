import { FC } from 'react';
import { Eye, ArrowUpRight, Users, Clock } from 'lucide-react';
import { Line } from 'react-chartjs-2';

const WebsiteAnalytics: FC = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Visitors',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#10B981',
        tension: 0.4,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Website Analytics</h3>
        <select className="text-sm border rounded-lg px-3 py-2">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Eye className="w-4 h-4" />
            <span>Total Visitors</span>
          </div>
          <p className="text-2xl font-light">0</p>
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>0% change</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Users className="w-4 h-4" />
            <span>New Leads</span>
          </div>
          <p className="text-2xl font-light">0</p>
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>0% change</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Clock className="w-4 h-4" />
            <span>Avg. Time on Site</span>
          </div>
          <p className="text-2xl font-light">0:00</p>
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>0% change</span>
          </div>
        </div>
      </div>

      <div>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WebsiteAnalytics;