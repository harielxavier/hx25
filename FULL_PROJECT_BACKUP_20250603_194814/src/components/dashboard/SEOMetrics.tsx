import React from 'react';
import { TrendingUp, TrendingDown, Search, Globe, Link as LinkIcon } from 'lucide-react';
import { Line } from 'react-chartjs-2';

export default function SEOMetrics() {
  const keywordData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Keyword Rankings',
        data: [15, 12, 8, 6, 4, 3],
        fill: false,
        borderColor: '#10B981',
        tension: 0.4
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
        reverse: true,
        beginAtZero: false,
        max: 20,
        min: 1
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-6">SEO Performance</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Search className="w-5 h-5 text-green-600" />
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-light">1,234</p>
          <p className="text-sm text-gray-600">Organic Visits</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-light">45</p>
          <p className="text-sm text-gray-600">Keywords in Top 10</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium mb-4">Top Keywords</h4>
        <div className="space-y-3">
          {[
            { keyword: 'wedding photographer nj', position: 2, change: 1 },
            { keyword: 'best wedding photos', position: 4, change: -1 },
            { keyword: 'engagement photographer', position: 3, change: 2 }
          ].map((keyword, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{keyword.keyword}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">#{keyword.position}</span>
                {keyword.change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-4">Keyword Trend</h4>
        <Line data={keywordData} options={options} />
      </div>
    </div>
  );
}