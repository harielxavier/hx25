import React, { useState } from 'react';
import { CheckSquare, Clock, AlertTriangle } from 'lucide-react';

interface Workflow {
  client: string;
  stage: string;
  progress: number;
  dueDate: string;
  tasks: {
    title: string;
    completed: boolean;
  }[];
}

export default function WorkflowManager() {
  const [workflows] = useState<Workflow[]>([
    {
      client: 'Sarah & John Wedding',
      stage: 'Editing',
      progress: 65,
      dueDate: '2024-03-20',
      tasks: [
        { title: 'Initial Culling', completed: true },
        { title: 'Color Correction', completed: false },
        { title: 'Final Edits', completed: false }
      ]
    },
    {
      client: 'Emma Engagement',
      stage: 'Delivery',
      progress: 90,
      dueDate: '2024-03-18',
      tasks: [
        { title: 'Gallery Creation', completed: true },
        { title: 'Client Review', completed: true },
        { title: 'Final Delivery', completed: false }
      ]
    }
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Active Workflows</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Create Workflow
        </button>
      </div>
      
      <div className="space-y-6">
        {workflows.map((workflow, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium">{workflow.client}</h4>
                <p className="text-sm text-gray-500">Stage: {workflow.stage}</p>
              </div>
              <span className="text-sm text-gray-500">Due: {workflow.dueDate}</span>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <span>Progress</span>
                <span>{workflow.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${workflow.progress}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              {workflow.tasks.map((task, taskIndex) => (
                <div key={taskIndex} className="flex items-center gap-2">
                  {task.completed ? (
                    <CheckSquare className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className={`text-sm ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}