import { useState } from 'react';
import { Download, Share2, Grid, List, Search, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';

interface Project {
  id: string;
  title: string;
  client: string;
  date: string;
  deadline: string;
  status: 'planning' | 'shooting' | 'editing' | 'delivery' | 'completed';
  progress: number;
  tasks: Task[];
  coverImage: string;
  imageCount: number;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Sarah & John Wedding',
    client: 'Sarah Johnson',
    date: '2024-03-15',
    deadline: '2024-04-15',
    status: 'editing',
    progress: 65,
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
    imageCount: 245,
    tasks: [
      { id: '1', title: 'Initial Client Meeting', completed: true, dueDate: '2024-03-01' },
      { id: '2', title: 'Engagement Shoot', completed: true, dueDate: '2024-03-10' },
      { id: '3', title: 'Wedding Day Shoot', completed: true, dueDate: '2024-03-15' },
      { id: '4', title: 'Initial Culling', completed: true, dueDate: '2024-03-20' },
      { id: '5', title: 'Color Correction', completed: false, dueDate: '2024-03-25' },
      { id: '6', title: 'Final Edits', completed: false, dueDate: '2024-04-01' },
      { id: '7', title: 'Client Review', completed: false, dueDate: '2024-04-10' },
      { id: '8', title: 'Final Delivery', completed: false, dueDate: '2024-04-15' }
    ]
  }
];

export default function GalleryView() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const getStatusColor = (status: Project['status']) => {
    const colors = {
      planning: 'bg-gray-500',
      shooting: 'bg-blue-500',
      editing: 'bg-purple-500',
      delivery: 'bg-yellow-500',
      completed: 'bg-green-500'
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold text-white">Projects & Gallery</h1>
        <button className="inline-flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="w-full sm:flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-white focus:ring-1 focus:ring-white"
          />
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-white focus:ring-1 focus:ring-white"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="shooting">Shooting</option>
            <option value="editing">Editing</option>
            <option value="delivery">Delivery</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex gap-2 bg-gray-900 border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-800' : ''}`}
            >
              <Grid className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-800' : ''}`}
            >
              <List className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Project Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-white transition-colors cursor-pointer group"
            >
              <div className="relative aspect-video">
                <OptimizedImage
                  src={project.coverImage}
                  alt={project.title}
                  type="gallery"
                  className="w-full h-full"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                    <Share2 className="w-5 h-5 text-black" />
                  </button>
                  <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                    <Download className="w-5 h-5 text-black" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-white">{project.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)} text-white`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{project.imageCount} photos</span>
                  <span>{project.progress}% complete</span>
                </div>
                <div className="mt-3 w-full bg-gray-800 rounded-full h-1.5">
                  <div
                    className={`${getStatusColor(project.status)} h-1.5 rounded-full transition-all`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  {project.tasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center gap-2 text-sm">
                      {task.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className={task.completed ? 'text-gray-500 line-through' : 'text-white'}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                  {project.tasks.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{project.tasks.length - 3} more tasks
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-gray-900 border border-gray-800 rounded-lg hover:border-white transition-colors cursor-pointer"
            >
              <div className="p-4 flex items-center gap-4">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-24 h-24 rounded object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-white">{project.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)} text-white`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    Client: {project.client} • Due: {project.deadline}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div
                          className={`${getStatusColor(project.status)} h-1.5 rounded-full transition-all`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-800 rounded">
                        <Share2 className="w-5 h-5 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-800 rounded">
                        <Download className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedProject.title}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <img
                    src={selectedProject.coverImage}
                    alt={selectedProject.title}
                    className="w-full rounded-lg"
                  />
                  
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Project Timeline</h3>
                    <div className="space-y-4">
                      {selectedProject.tasks.map(task => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {task.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-500" />
                            )}
                            <span className={task.completed ? 'text-gray-500 line-through' : 'text-white'}>
                              {task.title}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            Due: {task.dueDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-4">Project Details</h3>
                    <div className="space-y-3 text-sm grid sm:grid-cols-2 gap-x-4">

                      <div>
                        <span className="text-gray-400">Client:</span>
                        <span className="text-white ml-2">{selectedProject.client}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Shoot Date:</span>
                        <span className="text-white ml-2">{selectedProject.date}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Deadline:</span>
                        <span className="text-white ml-2">{selectedProject.deadline}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedProject.status)} text-white`}>
                          {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-4">Progress</h3>
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-white">{selectedProject.progress}%</span>
                      <span className="text-gray-400 text-sm ml-1">Complete</span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-2 mb-4">
                      <div
                        className={`${getStatusColor(selectedProject.status)} h-2 rounded-full transition-all`}
                        style={{ width: `${selectedProject.progress}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-400">
                      {selectedProject.tasks.filter(t => t.completed).length} of {selectedProject.tasks.length} tasks completed
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-white text-black rounded hover:bg-gray-100 transition-colors">
                        Upload Photos
                      </button>
                      <button className="w-full px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors">
                        Share Gallery
                      </button>
                      <button className="w-full px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors">
                        Download All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}