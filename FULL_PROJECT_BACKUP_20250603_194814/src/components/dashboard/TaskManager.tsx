import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

export default function TaskManager() {
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: '1',
      title: 'Edit Sarah & John Wedding',
      deadline: '2024-03-20',
      priority: 'high',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Deliver Emma Engagement Photos',
      deadline: '2024-03-18',
      priority: 'medium',
      status: 'in-progress'
    }
  ]);

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Tasks</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {task.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-500" />
              )}
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">Due: {task.deadline}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 text-xs rounded-full ${
                task.priority === 'high' 
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.priority}
              </span>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                className="text-sm border rounded p-1"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}