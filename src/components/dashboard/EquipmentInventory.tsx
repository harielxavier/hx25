import React from 'react';
import { Camera, Battery, AlertTriangle, Plus } from 'lucide-react';

export default function EquipmentInventory() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Equipment Inventory</h3>
        <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
          <Plus className="w-4 h-4" />
          Add Equipment
        </button>
      </div>
      
      <div className="space-y-4">
        {[
          {
            name: 'Canon EOS R5',
            type: 'Camera Body',
            status: 'active',
            lastService: '2024-01-15',
            nextService: '2024-07-15',
            batteryLife: 85
          },
          {
            name: 'RF 70-200mm f/2.8',
            type: 'Lens',
            status: 'maintenance',
            lastService: '2024-02-01',
            nextService: '2024-08-01',
            batteryLife: null
          }
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{item.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              {item.batteryLife && (
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{item.batteryLife}%</span>
                </div>
              )}
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                  item.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status === 'maintenance' && <AlertTriangle className="w-3 h-3" />}
                  {item.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Next service: {item.nextService}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}