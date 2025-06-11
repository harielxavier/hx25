import React, { useState, useEffect } from 'react';
import { Clock, Plus, Save, X } from 'lucide-react';
import { AvailabilitySetting, getAvailabilitySettings, updateAvailabilitySettings } from '../../lib/booking';

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export default function AvailabilityManager() {
  const [settings, setSettings] = useState<AvailabilitySetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const settings = await getAvailabilitySettings();
      setSettings(settings);
    } catch (error) {
      console.error('Error loading availability settings:', error);
    } finally {
      setLoading(false);
    }
  }

  const addTimeSlot = (dayOfWeek: number) => {
    setSettings([
      ...settings,
      {
        id: `temp-${Date.now()}`,
        day_of_week: dayOfWeek,
        start_time: '09:00',
        end_time: '17:00',
        is_available: true,
        buffer_before: 0,
        buffer_after: 0
      }
    ]);
  };

  const removeTimeSlot = (id: string) => {
    setSettings(settings.filter(setting => setting.id !== id));
  };

  const updateTimeSlot = (id: string, updates: Partial<AvailabilitySetting>) => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, ...updates } : setting
    ));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateAvailabilitySettings(settings);
    } catch (error) {
      console.error('Error saving availability settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-100 h-96 rounded-lg" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Availability Settings</h3>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="space-y-6">
          {DAYS.map((day, index) => {
            const daySettings = settings.filter(s => s.day_of_week === index);

            return (
              <div key={day} className="border-b border-gray-200 last:border-0 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">{day}</h4>
                  <button
                    onClick={() => addTimeSlot(index)}
                    className="flex items-center gap-2 px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Time Slot
                  </button>
                </div>

                {daySettings.length === 0 ? (
                  <p className="text-sm text-gray-500">No availability set</p>
                ) : (
                  <div className="space-y-4">
                    {daySettings.map((setting) => (
                      <div key={setting.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-gray-400" />
                        
                        <div className="flex items-center gap-4">
                          <input
                            type="time"
                            value={setting.start_time}
                            onChange={(e) => updateTimeSlot(setting.id, {
                              start_time: e.target.value
                            })}
                            className="px-3 py-1 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={setting.end_time}
                            onChange={(e) => updateTimeSlot(setting.id, {
                              end_time: e.target.value
                            })}
                            className="px-3 py-1 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div className="flex items-center gap-4 ml-auto">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={setting.is_available}
                              onChange={(e) => updateTimeSlot(setting.id, {
                                is_available: e.target.checked
                              })}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm">Available</span>
                          </label>

                          <button
                            onClick={() => removeTimeSlot(setting.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}