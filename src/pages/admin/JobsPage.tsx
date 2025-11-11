import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Edit, Trash2, Upload, Plus, Search, Settings, X, ChevronUp, ChevronDown, ArrowUpDown, MoreVertical, CheckSquare, Eye, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Job, getAllJobs, deleteJob, updateJob } from "../../services/jobsService";
// REMOVED FIREBASE: import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";

// Extended job interface with additional properties for the admin page
interface ExtendedJob extends Job {
  [key: string]: any; // Allow dynamic custom fields
}

// Column sort direction type
type SortDirection = 'asc' | 'desc' | null;

// Column configuration interface
interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  width: number;
  order: number;
  isCustom?: boolean;
  type?: "text" | "number" | "date" | "email" | "phone";
}

export default function JobsPage() {
  const navigate = useNavigate();
  
  // State for jobs and UI
  const [jobs, setJobs] = useState<ExtendedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<ExtendedJob | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Column management state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: 'name', label: 'Job Name', visible: true, width: 250, order: 0 },
    { id: 'clientName', label: 'Client', visible: true, width: 200, order: 1 },
    { id: 'type', label: 'Type', visible: true, width: 120, order: 2 },
    { id: 'mainShootDate', label: 'Shoot Date', visible: true, width: 150, order: 3, type: 'date' },
    { id: 'location', label: 'Location', visible: true, width: 200, order: 4 },
    { id: 'status', label: 'Status', visible: true, width: 120, order: 5 },
    { id: 'createdAt', label: 'Created', visible: true, width: 120, order: 6, type: 'date' }
  ]);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string>('mainShootDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Column customization UI state
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  
  // Column resize handlers
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; job: ExtendedJob } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  
  // Fetch jobs from Firebase with retry mechanism
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const allJobs = await getAllJobs();
        console.log(`Fetched ${allJobs.length} jobs successfully`);
        setJobs(allJobs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        if (retryCount < maxRetries) {
          console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
          retryCount++;
          // Exponential backoff: wait longer between retries
          setTimeout(fetchJobs, 1000 * Math.pow(2, retryCount));
        } else {
          console.error('Max retries reached. Could not fetch jobs.');
          setLoading(false);
          // Show a user-friendly error message here if needed
        }
      }
    };
    
    fetchJobs();
    
    // Clean up function to handle component unmounting
    return () => {
      // Any cleanup needed
    };
  }, []);

  // Handle deleting a job
  const handleDeleteClick = (job: ExtendedJob) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };
  
  // Confirm job deletion
  const confirmDelete = async () => {
    if (!jobToDelete) return;
    
    try {
      // Delete from Firebase
      await deleteJob(jobToDelete.id);
      console.log('Deleted job:', jobToDelete.id);
      
      // Update local state
      setJobs(prev => prev.filter(j => j.id !== jobToDelete.id));
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };
  
  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, job: ExtendedJob) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, job });
  };
  
  // Hide context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Mark job as complete
  const markJobAsComplete = async (job: ExtendedJob) => {
    try {
      // Update job status in Firebase
      await updateJob(job.id, {
        status: 'completed',
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      setJobs(prev => prev.map(j => 
        j.id === job.id ? { ...j, status: 'completed' } : j
      ));
      
      setContextMenu(null);
    } catch (error) {
      console.error('Error completing job:', error);
      alert('Failed to mark job as complete');
    }
  };
  
  // Export jobs to CSV
  const exportJobs = () => {
    try {
      // Filter visible jobs by search term if any
      const visibleJobs = jobs.filter(job => 
        searchTerm ? 
        job.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (job.clientName && job.clientName.toLowerCase().includes(searchTerm.toLowerCase())) : 
        true
      );
      
      // Get visible columns
      const visibleColumns = columns.filter(col => col.visible).sort((a, b) => a.order - b.order);
      
      // CSV header row
      const header = visibleColumns.map(col => col.label).join(',');
      
      // CSV data rows
      const rows = visibleJobs.map(job => {
        return visibleColumns.map(col => {
          const value = job[col.id];
          
          // Format dates
          if (col.type === 'date' && value instanceof Timestamp) {
            return format(value.toDate(), 'yyyy-MM-dd');
          }
          
          // Escape and format other values
          return value ? `"${String(value).replace(/"/g, '""')}"` : '';
        }).join(',');
      });
      
      // Combine header and rows
      const csvContent = [header, ...rows].join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `hariel-xavier-jobs-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting jobs:', error);
      alert('Failed to export jobs');
    }
  };
  
  // Format date for display
  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return '';
    return format(timestamp.toDate(), 'MMM d, yyyy');
  };
  
  // Calculate workflow progress percentage
  const getWorkflowProgress = (job: ExtendedJob) => {
    const status = job.status || 'active';
    
    if (status === 'completed') return 100;
    if (status === 'cancelled') return 100;
    
    // Custom calculation based on workflow stage
    const stage = job.workflowStage || 0;
    
    // For simplification, assuming 5 workflow stages (0-4)
    return Math.min(100, Math.max(0, (stage / 4) * 100));
  };
  
  // Get workflow progress bar color
  const getProgressColor = (job: ExtendedJob) => {
    const status = job.status || 'active';
    
    if (status === 'completed') return 'bg-green-500';
    if (status === 'cancelled') return 'bg-red-500';
    return 'bg-amber-500'; // In progress
  };

  // Format cell values for display
  const formatCellValue = useCallback((job: ExtendedJob, column: ColumnConfig) => {
    if (!column) return '';
    
    const value = job[column.id];
    if (value === undefined || value === null) return '-';
    
    if (column.id === 'mainShootDate' || column.id === 'createdAt' || column.id === 'updatedAt') {
      return value?.toDate ? formatDate(value) : '-';
    }
    
    if (column.type === 'date' && value instanceof Timestamp) {
      return formatDate(value);
    }
    
    if (column.type === 'date' && typeof value === 'string') {
      try {
        return new Date(value).toLocaleDateString();
      } catch (e) {
        return value;
      }
    }
    
    return value.toString();
  }, []);



  // Column resize handlers
  const startResize = useCallback((e: React.MouseEvent, columnId: string) => {
    e.preventDefault();
    setResizingColumn(columnId);
    setStartX(e.clientX);
  }, []);
  
  const handleResize = useCallback((e: MouseEvent) => {
    if (!resizingColumn) return;
    
    const column = columns.find(col => col.id === resizingColumn);
    if (!column) return;
    
    const currentWidth = column.width || 150;
    const diff = e.clientX - startX;
    const newWidth = Math.max(80, currentWidth + diff); // Minimum width of 80px
    
    setStartX(e.clientX);
    
    // Update column width
    setColumns(prev => prev.map(col => {
      if (col.id === resizingColumn) {
        return { ...col, width: newWidth };
      }
      return col;
    }));
    
    // Also update column widths for direct styling
    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn]: newWidth,
    }));
  }, [resizingColumn, startX, columns]);
  
  const endResize = useCallback(() => {
    setResizingColumn(null);
  }, []);
  
  // Add resize event listeners
  useEffect(() => {
    if (resizingColumn) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', endResize);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', endResize);
    };
  }, [resizingColumn, handleResize, endResize]);

  // Handle column sorting
  const handleSort = useCallback((columnId: string) => {
    // Toggle sort direction if clicking the same column
    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null); // Reset to default order
        setSortColumn('mainShootDate'); // Default sort column
      } else {
        setSortDirection('asc');
      }
    } else {
      // Set new sort column
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

  // Helper function to get sort icon
  const getSortIcon = useCallback((columnId: string) => {
    if (sortColumn !== columnId) return <ArrowUpDown className="inline-block w-4 h-4 opacity-30" />;
    if (sortDirection === 'asc') return <ChevronUp className="inline-block w-4 h-4" />;
    if (sortDirection === 'desc') return <ChevronDown className="inline-block w-4 h-4" />;
    return <ArrowUpDown className="inline-block w-4 h-4 opacity-30" />;
  }, [sortColumn, sortDirection]);

  // Add custom column function
  const addCustomColumn = useCallback(() => {
    const columnName = prompt('Enter column name:');
    if (!columnName) return;
    
    const columnId = columnName.toLowerCase().replace(/\s+/g, '_');
    // Check if column already exists
    if (columns.some(col => col.id === columnId)) {
      alert('A column with this name already exists');
      return;
    }
    
    const columnType = prompt('Enter column type (text, number, date, email, phone):', 'text');
    if (!columnType) return;
    
    const newColumn: ColumnConfig = {
      id: columnId,
      label: columnName,
      visible: true,
      width: 150,
      order: columns.length,
      isCustom: true,
      type: columnType as any
    };
    
    setColumns([...columns, newColumn]);
  }, [columns]);

  // Get visible and sorted columns
  const visibleColumns = useMemo(() => {
    return columns
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order);
  }, [columns]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    // First apply search filter
    let filtered = jobs.filter(job => {
      if (!searchTerm) return true;
      
      const term = searchTerm.toLowerCase();
      return (
        job.name?.toLowerCase().includes(term) ||
        job.clientName?.toLowerCase().includes(term) ||
        job.clientEmail?.toLowerCase().includes(term) ||
        job.location?.toLowerCase().includes(term) ||
        job.type?.toLowerCase().includes(term)
      );
    });
    
    // Then apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];
        
        // Handle special types
        if (valA instanceof Timestamp && valB instanceof Timestamp) {
          valA = valA.toMillis();
          valB = valB.toMillis();
        }
        
        if (valA === undefined || valA === null) valA = '';
        if (valB === undefined || valB === null) valB = '';
        
        // Compare values based on type
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDirection === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        } else {
          return sortDirection === 'asc' 
            ? (valA > valB ? 1 : -1) 
            : (valB > valA ? 1 : -1);
        }
      });
    }
    
    return filtered;
  }, [jobs, searchTerm, sortColumn, sortDirection]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-gray-500">Manage wedding and photography jobs</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportJobs}
            className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Jobs</span>
          </button>
          <button
            onClick={() => {
              // Open file input for importing jobs
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.csv';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  // Handle file upload
                  alert('CSV import would happen here');
                }
              };
              input.click();
            }}
            className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <Link 
            to="/admin/add-job"
            className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Job</span>
          </Link>
        </div>
      </div>

      {/* Column Settings Modal */}
      {showColumnSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-medium">Column Settings</h3>
              <button 
                onClick={() => setShowColumnSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <p className="text-gray-500 mb-4">Configure which columns to display and their order.</p>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 text-left">Visible</th>
                    <th className="py-2 px-4 text-left">Column</th>
                    <th className="py-2 px-4 text-left">Width</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {columns.sort((a, b) => a.order - b.order).map((column, index) => (
                    <tr key={column.id} className="border-t">
                      <td className="py-3 pl-4">
                        <input 
                          type="checkbox" 
                          checked={column.visible}
                          onChange={() => {
                            setColumns(prev =>
                              prev.map(col => {
                                if (col.id === column.id) {
                                  return { ...col, visible: !col.visible };
                                }
                                return col;
                              })
                            );
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-4">
                        {column.label}
                        {column.isCustom && <span className="ml-2 text-xs text-blue-500 font-medium">(Custom)</span>}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={column.width}
                          onChange={(e) => {
                            const width = parseInt(e.target.value);
                            if (isNaN(width)) return;
                            
                            setColumns(prev =>
                              prev.map(col => {
                                if (col.id === column.id) {
                                  return { ...col, width };
                                }
                                return col;
                              })
                            );
                          }}
                          min="50"
                          className="input input-sm input-bordered w-20"
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                            disabled={index === 0}
                            onClick={() => {
                              if (index === 0) return;
                              const prevColumn = columns.find(col => col.order === index - 1);
                              if (!prevColumn) return;
                              
                              setColumns(prev =>
                                prev.map(col => {
                                  if (col.id === column.id) {
                                    return { ...col, order: col.order - 1 };
                                  }
                                  if (col.id === prevColumn.id) {
                                    return { ...col, order: col.order + 1 };
                                  }
                                  return col;
                                })
                              );
                            }}
                          >
                            ↑
                          </button>
                          <button
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                            disabled={index === columns.length - 1}
                            onClick={() => {
                              if (index === columns.length - 1) return;
                              const nextColumn = columns.find(col => col.order === index + 1);
                              if (!nextColumn) return;
                              
                              setColumns(prev =>
                                prev.map(col => {
                                  if (col.id === column.id) {
                                    return { ...col, order: col.order + 1 };
                                  }
                                  if (col.id === nextColumn.id) {
                                    return { ...col, order: col.order - 1 };
                                  }
                                  return col;
                                })
                              );
                            }}
                          >
                            ↓
                          </button>
                          {column.isCustom && (
                            <button
                              className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded ml-auto"
                              onClick={() => {
                                if (confirm(`Delete the ${column.label} column?`)) {
                                  setColumns(prev => prev.filter(col => col.id !== column.id));
                                }
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => setShowColumnSettings(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex gap-4 items-center justify-between">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowColumnSettings(true)}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Column Settings</span>
          </button>
          <button 
            onClick={addCustomColumn}
            className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Field</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredJobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {visibleColumns.map(column => (
                      <th 
                        key={column.id}
                        className="text-left p-4 font-medium text-gray-500 relative"
                        style={{ 
                          width: `${columnWidths[column.id] || column.width}px`, 
                          minWidth: `${columnWidths[column.id] || column.width}px` 
                        }}
                      >
                        <div 
                          className="flex items-center gap-1 cursor-pointer select-none"
                          onClick={() => handleSort(column.id)}
                        >
                          {column.label}
                          <span>{getSortIcon(column.id)}</span>
                        </div>
                        <div
                          className="absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-ew-resize hover:bg-blue-500 opacity-0 hover:opacity-100"
                          onMouseDown={e => startResize(e, column.id)}
                        ></div>
                      </th>
                    ))}
                    <th className="text-left p-4 font-medium text-gray-500">Workflow Progress</th>
                    <th className="text-left p-4 font-medium text-gray-500">Documents</th>
                    <th className="text-right p-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <tr 
                      key={job.id}
                      className="group hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/jobs/${job.id}`)}
                      onContextMenu={(e) => handleContextMenu(e, job)}
                    >
                      {visibleColumns.map(column => (
                        <td key={`${job.id}-${column.id}`} className="p-4 text-gray-700">
                          {formatCellValue(job, column)}
                        </td>
                      ))}
                      <td className="p-4 text-gray-700">
                        <div className="flex gap-1 flex-wrap">
                          {job.documents?.contracts?.length > 0 && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {job.documents.contracts.length} contracts
                            </span>
                          )}
                          {job.documents?.invoices?.length > 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {job.documents.invoices.length} invoices
                            </span>
                          )}
                          {job.documents?.questionnaires?.length > 0 && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                              {job.documents.questionnaires.length} questionnaires
                            </span>
                          )}
                          {job.documents?.quotes?.length > 0 && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                              {job.documents.quotes.length} quotes
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Workflow Progress */}
                      <td className="p-4 text-gray-700">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`${getProgressColor(job)} h-2.5 rounded-full`} 
                            style={{ width: `${getWorkflowProgress(job)}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {job.status === 'completed' ? 'Job complete' : job.nextTask || 'In progress'}
                        </div>
                      </td>
                      
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={(e) => handleContextMenu(e, job)}
                            title="More Options"
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 px-4 text-center">
              <p className="text-gray-500 mb-4">No jobs found</p>
              <Link to="/admin/add-job" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add Your First Job
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Delete Modal */}
      {showDeleteModal && jobToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-medium mb-4">Delete Job</h3>
            <p className="mb-6">Are you sure you want to delete <strong>{jobToDelete.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Context Menu */}
      {contextMenu && (
        <div 
          ref={contextMenuRef}
          className="fixed bg-white shadow-lg rounded-lg py-2 z-50 w-48"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div className="px-4 py-2 text-sm font-semibold text-gray-600 border-b border-gray-100">
            Job Options
          </div>
          
          <Link 
            to={`/admin/jobs/${contextMenu.job.id}`} 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => setContextMenu(null)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Job
          </Link>
          
          <Link 
            to={`/admin/job-view/${contextMenu.job.id}`} 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => setContextMenu(null)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Job
          </Link>
          
          {contextMenu.job.status !== 'completed' && (
            <button 
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => markJobAsComplete(contextMenu.job)}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Mark as Complete
            </button>
          )}
          
          <button 
            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              handleDeleteClick(contextMenu.job);
              setContextMenu(null);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Job
          </button>
        </div>
      )}
      
      {/* Context Menu */}
      {contextMenu && (
        <div 
          ref={contextMenuRef}
          className="fixed bg-white shadow-lg rounded-lg py-2 z-50 w-48"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div className="px-4 py-2 text-sm font-semibold text-gray-600 border-b border-gray-100">
            Job Options
          </div>
          
          <Link 
            to={`/admin/jobs/${contextMenu.job.id}`} 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => setContextMenu(null)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Job
          </Link>
          
          <Link 
            to={`/admin/job-view/${contextMenu.job.id}`} 
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => setContextMenu(null)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Job
          </Link>
          
          {contextMenu.job.status !== 'completed' && (
            <button 
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => markJobAsComplete(contextMenu.job)}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Mark as Complete
            </button>
          )}
          
          <button 
            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              handleDeleteClick(contextMenu.job);
              setContextMenu(null);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Job
          </button>
        </div>
      )}
    </div>
  );
}
