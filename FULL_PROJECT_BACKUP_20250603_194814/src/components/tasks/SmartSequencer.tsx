import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Square, 
  Calendar, 
  Camera, 
  Users, 
  MapPin, 
  Clock, 
  Star,
  AlertCircle,
  Plus,
  Filter,
  Eye,
  EyeOff,
  Zap,
  Target,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  LucideIcon
} from 'lucide-react';

interface SmartSequencerProps {
  jobId: string;
  jobType: JobType;
  packageDetails: PackageDetails;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate: (task: Omit<Task, 'id'>) => void;
}

interface JobType {
  category: 'wedding' | 'portrait' | 'corporate' | 'event' | 'commercial';
  subcategory?: string;
  duration: number; // hours
  complexity: 'simple' | 'standard' | 'complex' | 'premium';
}

interface PackageDetails {
  includes: string[];
  addOns: string[];
  deliverables: string[];
  timeline: number; // days
  teamSize: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'skipped';
  dueDate?: Date;
  estimatedTime: number; // minutes
  dependencies: string[]; // task IDs
  assignee?: string;
  conditions: TaskCondition[];
  automationTriggers: AutomationTrigger[];
  visible: boolean;
  sequence: number;
  phase: TaskPhase;
}

interface TaskCondition {
  type: 'package_includes' | 'job_type' | 'complexity' | 'team_size' | 'custom';
  operator: 'equals' | 'includes' | 'greater_than' | 'less_than' | 'not_equals';
  value: any;
  required: boolean;
}

interface AutomationTrigger {
  event: 'task_completed' | 'date_reached' | 'condition_met' | 'manual';
  action: 'show_task' | 'hide_task' | 'create_task' | 'send_notification' | 'update_status';
  target?: string;
  delay?: number; // minutes
}

interface TaskCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

interface TaskPhase {
  id: string;
  name: string;
  order: number;
  description: string;
  estimatedDuration: number; // days
}

const SmartSequencer: React.FC<SmartSequencerProps> = ({ 
  jobId, 
  jobType, 
  packageDetails, 
  onTaskUpdate, 
  onTaskCreate 
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [phases, setPhases] = useState<TaskPhase[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  // Initialize task categories
  useEffect(() => {
    const taskCategories: TaskCategory[] = [
      {
        id: 'consultation',
        name: 'Consultation',
        icon: Users,
        color: 'bg-blue-500',
        description: 'Client meetings and planning'
      },
      {
        id: 'preparation',
        name: 'Preparation',
        icon: CheckSquare,
        color: 'bg-green-500',
        description: 'Pre-shoot preparation tasks'
      },
      {
        id: 'shooting',
        name: 'Shooting',
        icon: Camera,
        color: 'bg-purple-500',
        description: 'Photography session tasks'
      },
      {
        id: 'post_production',
        name: 'Post-Production',
        icon: Star,
        color: 'bg-orange-500',
        description: 'Editing and processing'
      },
      {
        id: 'delivery',
        name: 'Delivery',
        icon: Target,
        color: 'bg-red-500',
        description: 'Final delivery and follow-up'
      },
      {
        id: 'administrative',
        name: 'Administrative',
        icon: Calendar,
        color: 'bg-gray-500',
        description: 'Business and admin tasks'
      }
    ];

    setCategories(taskCategories);
  }, []);

  // Initialize task phases
  useEffect(() => {
    const taskPhases: TaskPhase[] = [
      {
        id: 'booking',
        name: 'Booking & Planning',
        order: 1,
        description: 'Initial booking and planning phase',
        estimatedDuration: 7
      },
      {
        id: 'preparation',
        name: 'Pre-Shoot Preparation',
        order: 2,
        description: 'Preparation before the shoot',
        estimatedDuration: 3
      },
      {
        id: 'execution',
        name: 'Shoot Execution',
        order: 3,
        description: 'The actual photography session',
        estimatedDuration: 1
      },
      {
        id: 'post_production',
        name: 'Post-Production',
        order: 4,
        description: 'Editing and processing',
        estimatedDuration: 14
      },
      {
        id: 'delivery',
        name: 'Delivery & Follow-up',
        order: 5,
        description: 'Final delivery and client follow-up',
        estimatedDuration: 3
      }
    ];

    setPhases(taskPhases);
    setExpandedPhases(new Set(taskPhases.map(p => p.id)));
  }, []);

  // Generate mock tasks based on job type
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: `${jobId}_consultation`,
        title: 'Initial Consultation',
        description: 'Meet with client to discuss requirements',
        category: categories.find(c => c.id === 'consultation') || categories[0],
        priority: 'high',
        status: 'completed',
        estimatedTime: 60,
        dependencies: [],
        conditions: [],
        automationTriggers: [],
        visible: true,
        sequence: 1,
        phase: phases.find(p => p.id === 'booking') || phases[0]
      },
      {
        id: `${jobId}_contract`,
        title: 'Prepare Contract',
        description: 'Create and customize contract',
        category: categories.find(c => c.id === 'administrative') || categories[0],
        priority: 'high',
        status: 'in_progress',
        estimatedTime: 30,
        dependencies: [`${jobId}_consultation`],
        conditions: [],
        automationTriggers: [],
        visible: true,
        sequence: 2,
        phase: phases.find(p => p.id === 'booking') || phases[0]
      }
    ];

    // Add job-specific tasks
    if (jobType.category === 'wedding') {
      mockTasks.push(
        {
          id: `${jobId}_timeline`,
          title: 'Create Wedding Timeline',
          description: 'Develop detailed timeline for wedding day',
          category: categories.find(c => c.id === 'preparation') || categories[0],
          priority: 'high',
          status: 'pending',
          estimatedTime: 90,
          dependencies: [`${jobId}_contract`],
          conditions: [],
          automationTriggers: [],
          visible: true,
          sequence: 3,
          phase: phases.find(p => p.id === 'preparation') || phases[0]
        },
        {
          id: `${jobId}_engagement`,
          title: 'Engagement Session',
          description: 'Conduct engagement photo session',
          category: categories.find(c => c.id === 'shooting') || categories[0],
          priority: 'medium',
          status: 'pending',
          estimatedTime: 180,
          dependencies: [`${jobId}_timeline`],
          conditions: [],
          automationTriggers: [],
          visible: packageDetails.includes.includes('engagement_session'),
          sequence: 4,
          phase: phases.find(p => p.id === 'execution') || phases[0]
        }
      );
    }

    if (jobType.category === 'corporate') {
      mockTasks.push({
        id: `${jobId}_brand_review`,
        title: 'Review Brand Guidelines',
        description: 'Study client brand guidelines',
        category: categories.find(c => c.id === 'preparation') || categories[0],
        priority: 'high',
        status: 'pending',
        estimatedTime: 60,
        dependencies: [`${jobId}_contract`],
        conditions: [],
        automationTriggers: [],
        visible: true,
        sequence: 3,
        phase: phases.find(p => p.id === 'preparation') || phases[0]
      });
    }

    // Add common post-production tasks
    mockTasks.push(
      {
        id: `${jobId}_culling`,
        title: 'Photo Culling',
        description: 'Select best photos from session',
        category: categories.find(c => c.id === 'post_production') || categories[0],
        priority: 'high',
        status: 'pending',
        estimatedTime: 180,
        dependencies: [],
        conditions: [],
        automationTriggers: [],
        visible: true,
        sequence: 10,
        phase: phases.find(p => p.id === 'post_production') || phases[0]
      },
      {
        id: `${jobId}_editing`,
        title: 'Basic Editing',
        description: 'Apply basic corrections and adjustments',
        category: categories.find(c => c.id === 'post_production') || categories[0],
        priority: 'high',
        status: 'pending',
        estimatedTime: 300,
        dependencies: [`${jobId}_culling`],
        conditions: [],
        automationTriggers: [],
        visible: true,
        sequence: 11,
        phase: phases.find(p => p.id === 'post_production') || phases[0]
      },
      {
        id: `${jobId}_delivery`,
        title: 'Deliver Final Photos',
        description: 'Send final photos to client',
        category: categories.find(c => c.id === 'delivery') || categories[0],
        priority: 'high',
        status: 'pending',
        estimatedTime: 30,
        dependencies: [`${jobId}_editing`],
        conditions: [],
        automationTriggers: [],
        visible: true,
        sequence: 12,
        phase: phases.find(p => p.id === 'delivery') || phases[0]
      }
    );

    setTasks(mockTasks);
  }, [jobId, jobType, packageDetails, categories, phases]);

  /**
   * Handle task status update
   */
  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    onTaskUpdate(taskId, updates);
  };

  /**
   * Toggle phase expansion
   */
  const togglePhaseExpansion = (phaseId: string) => {
    setExpandedPhases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId);
      } else {
        newSet.add(phaseId);
      }
      return newSet;
    });
  };

  /**
   * Get tasks for a specific phase
   */
  const getTasksForPhase = (phaseId: string) => {
    return tasks.filter(task => {
      const matchesPhase = task.phase.id === phaseId;
      const matchesCategory = !selectedCategory || task.category.id === selectedCategory;
      const matchesVisibility = showCompleted || task.status !== 'completed';
      const matchesHidden = showHidden || task.visible;
      
      return matchesPhase && matchesCategory && matchesVisibility && matchesHidden;
    });
  };

  /**
   * Get task completion stats for phase
   */
  const getPhaseStats = (phaseId: string) => {
    const phaseTasks = tasks.filter(task => task.phase.id === phaseId && task.visible);
    const completedTasks = phaseTasks.filter(task => task.status === 'completed');
    
    return {
      total: phaseTasks.length,
      completed: completedTasks.length,
      percentage: phaseTasks.length > 0 ? Math.round((completedTasks.length / phaseTasks.length) * 100) : 0
    };
  };

  /**
   * Check if task dependencies are met
   */
  const areDependenciesMet = (task: Task): boolean => {
    return task.dependencies.every(depId => {
      const depTask = tasks.find(t => t.id === depId);
      return depTask?.status === 'completed';
    });
  };

  /**
   * Get priority color
   */
  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-yellow-500',
      high: 'text-orange-500',
      critical: 'text-red-500'
    };
    return colors[priority];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Smart Sequencer</h2>
              <p className="text-gray-600">
                Intelligent task board for {jobType.category} ({jobType.complexity})
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                showCompleted 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {showCompleted ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>Completed</span>
            </button>
            
            <button
              onClick={() => setShowHidden(!showHidden)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                showHidden 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Hidden</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !selectedCategory 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          All Categories
        </button>
        {categories.map(category => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                selectedCategory === category.id 
                  ? `${category.color} text-white` 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Task Phases */}
      <div className="space-y-4">
        {phases.map(phase => {
          const phaseStats = getPhaseStats(phase.id);
          const phaseTasks = getTasksForPhase(phase.id);
          const isExpanded = expandedPhases.has(phase.id);
          
          return (
            <div key={phase.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Phase Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => togglePhaseExpansion(phase.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{phase.name}</h3>
                      <p className="text-sm text-gray-600">{phase.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">
                        {phaseStats.completed}/{phaseStats.total} tasks
                      </div>
                      <div className="text-xs text-gray-500">
                        {phaseStats.percentage}% complete
                      </div>
                    </div>
                    
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${phaseStats.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Phase Tasks */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-4 space-y-3">
                      {phaseTasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No tasks in this phase match your current filters
                        </div>
                      ) : (
                        phaseTasks.map(task => {
                          const dependenciesMet = areDependenciesMet(task);
                          const isBlocked = !dependenciesMet && task.status === 'pending';
                          const IconComponent = task.category.icon;
                          
                          return (
                            <motion.div
                              key={task.id}
                              className={`p-4 rounded-lg border transition-all ${
                                task.status === 'completed' 
                                  ? 'bg-green-50 border-green-200' 
                                  : isBlocked
                                  ? 'bg-red-50 border-red-200'
                                  : task.status === 'in_progress'
                                  ? 'bg-blue-50 border-blue-200'
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => handleTaskUpdate(task.id, {
                                      status: task.status === 'completed' ? 'pending' : 'completed'
                                    })}
                                    className="flex-shrink-0"
                                    disabled={isBlocked}
                                  >
                                    {task.status === 'completed' ? (
                                      <CheckSquare className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <Square className={`w-5 h-5 ${isBlocked ? 'text-red-400' : 'text-gray-400 hover:text-gray-600'}`} />
                                    )}
                                  </button>
                                  
                                  <div className={`w-3 h-3 ${task.category.color} rounded-full`} />
                                  
                                  <div className="flex-1">
                                    <h4 className={`font-medium ${
                                      task.status === 'completed' 
                                        ? 'text-gray-500 line-through' 
                                        : 'text-gray-800'
                                    }`}>
                                      {task.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">{task.description}</p>
                                    
                                    <div className="flex items-center space-x-4 mt-2">
                                      <div className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">
                                          {Math.round(task.estimatedTime / 60)}h {task.estimatedTime % 60}m
                                        </span>
                                      </div>
                                      
                                      <div className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                        {task.priority.toUpperCase()}
                                      </div>
                                      
                                      {isBlocked && (
                                        <div className="flex items-center space-x-1">
                                          <AlertCircle className="w-3 h-3 text-red-500" />
                                          <span className="text-xs text-red-500">Blocked</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <IconComponent className="w-4 h-4 text-gray-400" />
                                  
                                  {task.status === 'in_progress' && (
                                    <button
                                      onClick={() => handleTaskUpdate(task.id, { status: 'pending' })}
                                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                                    >
                                      Pause
                                    </button>
                                  )}
                                  
                                  {task.status === 'pending' && !isBlocked && (
                                    <button
                                      onClick={() => handleTaskUpdate(task.id, { status: 'in_progress' })}
                                      className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                                    >
                                      Start
                                    </button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Overview</h3>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.visible).length}
            </div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed' && t.visible).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {tasks.filter(t => t.status === 'in_progress' && t.visible).length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {Math.round(tasks.reduce((sum, t) => sum + t.estimatedTime, 0) / 60)}h
            </div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSequencer;
export type { Task, JobType, PackageDetails, TaskCategory, TaskPhase };
