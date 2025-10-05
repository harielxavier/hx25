import { v4 as uuidv4 } from 'uuid';
import { addDays, format } from 'date-fns';

// Workflow template types
export type WorkflowType = 
  | 'wedding'
  | 'portrait'
  | 'family'
  | 'newborn'
  | 'engagement'
  | 'event'
  | 'commercial';

// Task status types
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';

// Task priority types
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Task interface
export interface Task {
  id: string;
  workflowId: string;
  jobId?: string;
  title: string;
  description: string;
  dueDate?: string; // ISO string
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string; // User ID
  completedAt?: string; // ISO string
  relativeDay?: number; // Days relative to job date (can be negative)
  category: string;
  order: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Workflow template task interface
export interface WorkflowTemplateTask {
  id: string;
  templateId: string;
  title: string;
  description: string;
  relativeDay: number; // Days relative to job date (can be negative)
  category: string;
  priority: TaskPriority;
  order: number;
}

// Workflow template interface
export interface WorkflowTemplate {
  id: string;
  name: string;
  type: WorkflowType;
  description: string;
  tasks: WorkflowTemplateTask[];
  isDefault: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Active workflow interface
export interface Workflow {
  id: string;
  templateId: string;
  jobId: string;
  name: string;
  type: WorkflowType;
  status: 'active' | 'completed' | 'cancelled';
  progress: number; // 0-100
  startDate: string; // ISO string
  endDate?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Mock workflow templates
const workflowTemplates: WorkflowTemplate[] = [
  {
    id: '1',
    name: 'Wedding Photography Workflow',
    type: 'wedding',
    description: 'Complete workflow for wedding photography from booking to delivery',
    isDefault: true,
    tasks: [
      // Pre-Wedding Tasks
      {
        id: '1-1',
        templateId: '1',
        title: 'Send booking confirmation',
        description: 'Send booking confirmation email and contract to client',
        relativeDay: -180, // 6 months before
        category: 'admin',
        priority: 'high',
        order: 1
      },
      {
        id: '1-2',
        templateId: '1',
        title: 'Collect engagement session details',
        description: 'Gather information for engagement session if included in package',
        relativeDay: -150, // 5 months before
        category: 'planning',
        priority: 'medium',
        order: 2
      },
      {
        id: '1-3',
        templateId: '1',
        title: 'Schedule engagement session',
        description: 'Book date and location for engagement session',
        relativeDay: -120, // 4 months before
        category: 'planning',
        priority: 'medium',
        order: 3
      },
      {
        id: '1-4',
        templateId: '1',
        title: 'Engagement session',
        description: 'Photograph engagement session',
        relativeDay: -90, // 3 months before
        category: 'shooting',
        priority: 'high',
        order: 4
      },
      {
        id: '1-5',
        templateId: '1',
        title: 'Edit engagement photos',
        description: 'Cull and edit engagement session photos',
        relativeDay: -80, // ~2.5 months before
        category: 'editing',
        priority: 'medium',
        order: 5
      },
      {
        id: '1-6',
        templateId: '1',
        title: 'Deliver engagement photos',
        description: 'Upload engagement photos to client gallery and notify client',
        relativeDay: -75, // ~2.5 months before
        category: 'delivery',
        priority: 'high',
        order: 6
      },
      {
        id: '1-7',
        templateId: '1',
        title: 'Send wedding questionnaire',
        description: 'Send detailed questionnaire about wedding day timeline and shot list',
        relativeDay: -60, // 2 months before
        category: 'planning',
        priority: 'high',
        order: 7
      },
      {
        id: '1-8',
        templateId: '1',
        title: 'Wedding planning meeting',
        description: 'Meet with couple to discuss wedding day details and timeline',
        relativeDay: -30, // 1 month before
        category: 'planning',
        priority: 'high',
        order: 8
      },
      {
        id: '1-9',
        templateId: '1',
        title: 'Finalize shot list',
        description: 'Confirm family groupings and special photo requests',
        relativeDay: -14, // 2 weeks before
        category: 'planning',
        priority: 'high',
        order: 9
      },
      {
        id: '1-10',
        templateId: '1',
        title: 'Venue walkthrough',
        description: 'Visit venue to scout locations and lighting',
        relativeDay: -7, // 1 week before
        category: 'planning',
        priority: 'medium',
        order: 10
      },
      {
        id: '1-11',
        templateId: '1',
        title: 'Prepare equipment',
        description: 'Check and clean all camera equipment, charge batteries, format cards',
        relativeDay: -2, // 2 days before
        category: 'preparation',
        priority: 'high',
        order: 11
      },
      {
        id: '1-12',
        templateId: '1',
        title: 'Send final confirmation',
        description: 'Confirm arrival time and final details with couple',
        relativeDay: -2, // 2 days before
        category: 'admin',
        priority: 'high',
        order: 12
      },
      
      // Wedding Day
      {
        id: '1-13',
        templateId: '1',
        title: 'Wedding day photography',
        description: 'Photograph wedding day according to timeline',
        relativeDay: 0, // Wedding day
        category: 'shooting',
        priority: 'urgent',
        order: 13
      },
      {
        id: '1-14',
        templateId: '1',
        title: 'Backup all photos',
        description: 'Create multiple backups of all raw files',
        relativeDay: 1, // Day after wedding
        category: 'admin',
        priority: 'urgent',
        order: 14
      },
      
      // Post-Wedding
      {
        id: '1-15',
        templateId: '1',
        title: 'Send thank you note',
        description: 'Send thank you email with timeline for photo delivery',
        relativeDay: 2, // 2 days after
        category: 'admin',
        priority: 'high',
        order: 15
      },
      {
        id: '1-16',
        templateId: '1',
        title: 'Share sneak peek',
        description: 'Edit and share 5-10 preview images',
        relativeDay: 3, // 3 days after
        category: 'editing',
        priority: 'high',
        order: 16
      },
      {
        id: '1-17',
        templateId: '1',
        title: 'Cull photos',
        description: 'Select final images for editing',
        relativeDay: 7, // 1 week after
        category: 'editing',
        priority: 'high',
        order: 17
      },
      {
        id: '1-18',
        templateId: '1',
        title: 'Edit photos',
        description: 'Edit all selected wedding photos',
        relativeDay: 14, // 2 weeks after
        category: 'editing',
        priority: 'high',
        order: 18
      },
      {
        id: '1-19',
        templateId: '1',
        title: 'Design album draft',
        description: 'Create first draft of wedding album if included in package',
        relativeDay: 30, // 1 month after
        category: 'products',
        priority: 'medium',
        order: 19
      },
      {
        id: '1-20',
        templateId: '1',
        title: 'Deliver final gallery',
        description: 'Upload all edited photos to client gallery and send access details',
        relativeDay: 30, // 1 month after
        category: 'delivery',
        priority: 'high',
        order: 20
      },
      {
        id: '1-21',
        templateId: '1',
        title: 'Follow up on album',
        description: 'Get feedback on album draft and make revisions',
        relativeDay: 45, // 1.5 months after
        category: 'products',
        priority: 'medium',
        order: 21
      },
      {
        id: '1-22',
        templateId: '1',
        title: 'Order album',
        description: 'Submit final album design for printing',
        relativeDay: 60, // 2 months after
        category: 'products',
        priority: 'medium',
        order: 22
      },
      {
        id: '1-23',
        templateId: '1',
        title: 'Deliver album',
        description: 'Ship or hand-deliver wedding album to couple',
        relativeDay: 75, // 2.5 months after
        category: 'delivery',
        priority: 'high',
        order: 23
      },
      {
        id: '1-24',
        templateId: '1',
        title: 'Request review',
        description: 'Ask couple for review and referrals',
        relativeDay: 90, // 3 months after
        category: 'marketing',
        priority: 'medium',
        order: 24
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Portrait Session Workflow',
    type: 'portrait',
    description: 'Workflow for portrait photography sessions',
    isDefault: true,
    tasks: [
      // Pre-Session
      {
        id: '2-1',
        templateId: '2',
        title: 'Send booking confirmation',
        description: 'Send booking confirmation email and contract to client',
        relativeDay: -30, // 1 month before
        category: 'admin',
        priority: 'high',
        order: 1
      },
      {
        id: '2-2',
        templateId: '2',
        title: 'Send preparation guide',
        description: 'Send guide on what to wear and how to prepare for the session',
        relativeDay: -14, // 2 weeks before
        category: 'planning',
        priority: 'medium',
        order: 2
      },
      {
        id: '2-3',
        templateId: '2',
        title: 'Confirm session details',
        description: 'Confirm date, time, location, and any special requests',
        relativeDay: -7, // 1 week before
        category: 'planning',
        priority: 'high',
        order: 3
      },
      {
        id: '2-4',
        templateId: '2',
        title: 'Prepare equipment',
        description: 'Check and clean all camera equipment, charge batteries, format cards',
        relativeDay: -1, // 1 day before
        category: 'preparation',
        priority: 'high',
        order: 4
      },
      
      // Session Day
      {
        id: '2-5',
        templateId: '2',
        title: 'Portrait session',
        description: 'Photograph portrait session',
        relativeDay: 0, // Session day
        category: 'shooting',
        priority: 'urgent',
        order: 5
      },
      {
        id: '2-6',
        templateId: '2',
        title: 'Backup photos',
        description: 'Create backup of all raw files',
        relativeDay: 0, // Same day
        category: 'admin',
        priority: 'urgent',
        order: 6
      },
      
      // Post-Session
      {
        id: '2-7',
        templateId: '2',
        title: 'Share sneak peek',
        description: 'Edit and share 2-3 preview images',
        relativeDay: 1, // 1 day after
        category: 'editing',
        priority: 'high',
        order: 7
      },
      {
        id: '2-8',
        templateId: '2',
        title: 'Cull photos',
        description: 'Select final images for editing',
        relativeDay: 3, // 3 days after
        category: 'editing',
        priority: 'high',
        order: 8
      },
      {
        id: '2-9',
        templateId: '2',
        title: 'Edit photos',
        description: 'Edit all selected photos',
        relativeDay: 7, // 1 week after
        category: 'editing',
        priority: 'high',
        order: 9
      },
      {
        id: '2-10',
        templateId: '2',
        title: 'Deliver gallery',
        description: 'Upload edited photos to client gallery and send access details',
        relativeDay: 14, // 2 weeks after
        category: 'delivery',
        priority: 'high',
        order: 10
      },
      {
        id: '2-11',
        templateId: '2',
        title: 'Follow up on print orders',
        description: 'Check if client wants to order prints or products',
        relativeDay: 21, // 3 weeks after
        category: 'products',
        priority: 'medium',
        order: 11
      },
      {
        id: '2-12',
        templateId: '2',
        title: 'Request review',
        description: 'Ask client for review and referrals',
        relativeDay: 28, // 4 weeks after
        category: 'marketing',
        priority: 'medium',
        order: 12
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock active workflows
const activeWorkflows: Workflow[] = [];

// Mock tasks
let tasks: Task[] = [];

/**
 * Get all workflow templates
 */
export const getWorkflowTemplates = async (): Promise<WorkflowTemplate[]> => {
  // In a real implementation, this would fetch from a database
  return workflowTemplates;
};

/**
 * Get workflow template by ID
 */
export const getWorkflowTemplateById = async (id: string): Promise<WorkflowTemplate | null> => {
  const template = workflowTemplates.find(t => t.id === id);
  return template || null;
};

/**
 * Get workflow template by type
 */
export const getWorkflowTemplateByType = async (type: WorkflowType): Promise<WorkflowTemplate | null> => {
  const template = workflowTemplates.find(t => t.type === type && t.isDefault);
  return template || null;
};

/**
 * Create a new workflow template
 */
export const createWorkflowTemplate = async (template: Omit<WorkflowTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkflowTemplate> => {
  const newTemplate: WorkflowTemplate = {
    ...template,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  workflowTemplates.push(newTemplate);
  return newTemplate;
};

/**
 * Update a workflow template
 */
export const updateWorkflowTemplate = async (id: string, updates: Partial<WorkflowTemplate>): Promise<WorkflowTemplate | null> => {
  const index = workflowTemplates.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  const updatedTemplate = {
    ...workflowTemplates[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  workflowTemplates[index] = updatedTemplate;
  return updatedTemplate;
};

/**
 * Delete a workflow template
 */
export const deleteWorkflowTemplate = async (id: string): Promise<boolean> => {
  const initialLength = workflowTemplates.length;
  const filtered = workflowTemplates.filter(t => t.id !== id);
  
  if (filtered.length < initialLength) {
    workflowTemplates.length = 0;
    workflowTemplates.push(...filtered);
    return true;
  }
  
  return false;
};

/**
 * Create a new workflow from a template for a job
 */
export const createWorkflowFromTemplate = async (
  templateId: string,
  jobId: string,
  jobDate: string // ISO string
): Promise<Workflow | null> => {
  const template = await getWorkflowTemplateById(templateId);
  if (!template) return null;
  
  const workflowId = uuidv4();
  const now = new Date().toISOString();
  
  // Create the workflow
  const workflow: Workflow = {
    id: workflowId,
    templateId,
    jobId,
    name: template.name,
    type: template.type,
    status: 'active',
    progress: 0,
    startDate: now,
    createdAt: now,
    updatedAt: now
  };
  
  activeWorkflows.push(workflow);
  
  // Create tasks from template tasks
  const jobDateObj = new Date(jobDate);
  
  for (const templateTask of template.tasks) {
    const taskDueDate = addDays(jobDateObj, templateTask.relativeDay);
    
    const task: Task = {
      id: uuidv4(),
      workflowId,
      jobId,
      title: templateTask.title,
      description: templateTask.description,
      dueDate: taskDueDate.toISOString(),
      status: 'pending',
      priority: templateTask.priority,
      category: templateTask.category,
      order: templateTask.order,
      relativeDay: templateTask.relativeDay,
      createdAt: now,
      updatedAt: now
    };
    
    tasks.push(task);
  }
  
  return workflow;
};

/**
 * Get active workflow by job ID
 */
export const getWorkflowByJobId = async (jobId: string): Promise<Workflow | null> => {
  const workflow = activeWorkflows.find(w => w.jobId === jobId);
  return workflow || null;
};

/**
 * Get tasks for a workflow
 */
export const getTasksForWorkflow = async (workflowId: string): Promise<Task[]> => {
  return tasks.filter(t => t.workflowId === workflowId)
    .sort((a, b) => a.order - b.order);
};

/**
 * Get tasks for a job
 */
export const getTasksForJob = async (jobId: string): Promise<Task[]> => {
  return tasks.filter(t => t.jobId === jobId)
    .sort((a, b) => a.order - b.order);
};

/**
 * Update task status
 */
export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus,
  completedAt?: string
): Promise<Task | null> => {
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) return null;
  
  const updatedTask = {
    ...tasks[index],
    status,
    completedAt: status === 'completed' ? (completedAt || new Date().toISOString()) : tasks[index].completedAt,
    updatedAt: new Date().toISOString()
  };
  
  tasks[index] = updatedTask;
  
  // Update workflow progress
  const workflowId = updatedTask.workflowId;
  const workflowTasks = await getTasksForWorkflow(workflowId);
  const completedTasks = workflowTasks.filter(t => t.status === 'completed').length;
  const progress = Math.round((completedTasks / workflowTasks.length) * 100);
  
  const workflowIndex = activeWorkflows.findIndex(w => w.id === workflowId);
  if (workflowIndex !== -1) {
    activeWorkflows[workflowIndex] = {
      ...activeWorkflows[workflowIndex],
      progress,
      status: progress === 100 ? 'completed' : 'active',
      endDate: progress === 100 ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };
  }
  
  return updatedTask;
};

/**
 * Add a custom task to a workflow
 */
export const addCustomTask = async (
  workflowId: string,
  task: Omit<Task, 'id' | 'workflowId' | 'createdAt' | 'updatedAt'>
): Promise<Task | null> => {
  const workflow = activeWorkflows.find(w => w.id === workflowId);
  if (!workflow) return null;
  
  const workflowTasks = await getTasksForWorkflow(workflowId);
  const maxOrder = workflowTasks.length > 0 
    ? Math.max(...workflowTasks.map(t => t.order)) 
    : 0;
  
  const newTask: Task = {
    ...task,
    id: uuidv4(),
    workflowId,
    order: task.order || maxOrder + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  return newTask;
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId: string): Promise<boolean> => {
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== taskId);
  return tasks.length < initialLength;
};

/**
 * Get upcoming tasks for a user
 */
export const getUpcomingTasksForUser = async (
  userId: string,
  daysAhead: number = 7
): Promise<Task[]> => {
  const now = new Date();
  const futureDate = addDays(now, daysAhead);
  
  return tasks.filter(task => 
    (task.assignedTo === userId || !task.assignedTo) && 
    task.status !== 'completed' &&
    task.status !== 'cancelled' &&
    task.dueDate && 
    new Date(task.dueDate) <= futureDate
  ).sort((a, b) => {
    // Sort by due date, then by priority
    if (a.dueDate && b.dueDate) {
      const dateComparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (dateComparison !== 0) return dateComparison;
    }
    
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

/**
 * Get overdue tasks
 */
export const getOverdueTasks = async (): Promise<Task[]> => {
  const now = new Date();
  
  return tasks.filter(task => 
    task.status !== 'completed' &&
    task.status !== 'cancelled' &&
    task.dueDate && 
    new Date(task.dueDate) < now
  );
};

/**
 * Update overdue task statuses
 * This would typically be called by a cron job or scheduled function
 */
export const updateOverdueTaskStatuses = async (): Promise<number> => {
  const overdueTasks = await getOverdueTasks();
  let updatedCount = 0;
  
  for (const task of overdueTasks) {
    if (task.status !== 'overdue') {
      await updateTaskStatus(task.id, 'overdue');
      updatedCount++;
    }
  }
  
  return updatedCount;
};

export default {
  getWorkflowTemplates,
  getWorkflowTemplateById,
  getWorkflowTemplateByType,
  createWorkflowTemplate,
  updateWorkflowTemplate,
  deleteWorkflowTemplate,
  createWorkflowFromTemplate,
  getWorkflowByJobId,
  getTasksForWorkflow,
  getTasksForJob,
  updateTaskStatus,
  addCustomTask,
  deleteTask,
  getUpcomingTasksForUser,
  getOverdueTasks,
  updateOverdueTaskStatuses
};
