
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Edit, Trash2, Mail, Upload, Plus, Search, GripVertical, Settings, X, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Client, deleteClient, getAllClients } from "../../services/clientGalleryService";
import { sendEmail } from "../../services/emailService";
// REMOVED FIREBASE: import { Timestamp, collection, writeBatch, doc, updateDoc } from "firebase/firestore";
// REMOVED FIREBASE: import { db } from "../../firebase/config";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

// Extended client interface with additional properties for the admin page
interface ExtendedClient extends Client {
  accessCode?: string;
  galleryCount?: number;
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

export default function ClientsPage() {
  // State for clients and UI
  const [clients, setClients] = useState<ExtendedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ExtendedClient | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [clientToEmail, setClientToEmail] = useState<ExtendedClient | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  // CSV import state for file upload functionality
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importTotal, setImportTotal] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [importStats, setImportStats] = useState({ added: 0, updated: 0, failed: 0, total: 0 });
  const { width, height } = useWindowSize();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Column management state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: 'name', label: 'Name', visible: true, width: 250, order: 0 },
    { id: 'email', label: 'Email', visible: true, width: 200, order: 1 },
    { id: 'phone', label: 'Phone', visible: true, width: 150, order: 2 },
    { id: 'galleries', label: 'Galleries', visible: true, width: 100, order: 3 },
    { id: 'createdAt', label: 'Created', visible: true, width: 120, order: 4, type: 'date' },
    { id: 'updatedAt', label: 'Last Updated', visible: true, width: 120, order: 5, type: 'date' }
  ]);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Column customization UI state
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  
  // Inline editing state
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  
  // Fetch clients from Firebase
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const allClients = await getAllClients();
        console.log('Fetched clients:', allClients);
        setClients(allClients);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  // Handle CSV file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setImporting(true);
      setImportProgress(0);
      
      // Read the file as text
      const text = await file.text();
      const rows = text.split('\n');
      
      // Parse header row
      const headers = rows[0].split(',').map(h => h.trim());
      
      // Determine total number of rows to import
      const dataRows = rows.slice(1).filter(row => row.trim().length > 0);
      setImportTotal(dataRows.length);
      
      // Process each row
      const stats = { added: 0, updated: 0, failed: 0, total: dataRows.length };
      const batch = writeBatch(db);
      
      for (let i = 0; i < dataRows.length; i++) {
        try {
          const row = dataRows[i].split(',').map(cell => cell.trim());
          
          // Create client object from row data
          const client: Record<string, any> = {};
          headers.forEach((header, index) => {
            if (row[index]) {
              const field = header.toLowerCase().replace(/\s+/g, '_');
              client[field] = row[index];
            }
          });
          
          // Add required fields if not present
          if (!client.email) {
            console.warn('Skipping row without email:', row);
            stats.failed++;
            continue;
          }
          
          if (!client.name) client.name = client.email.split('@')[0];
          client.createdAt = Timestamp.now();
          client.updatedAt = Timestamp.now();
          
          // Check if client already exists
          const existingClientRef = doc(collection(db, 'clients'), client.id || `${client.email.replace(/[^a-zA-Z0-9]/g, '_')}`);
          batch.set(existingClientRef, client, { merge: true });
          
          stats.updated++;
          setImportProgress(i + 1);
        } catch (rowError) {
          console.error('Error processing row:', rowError);
          stats.failed++;
        }
      }
      
      // Commit batch write
      await batch.commit();
      
      // Refresh clients list
      const allClients = await getAllClients();
      setClients(allClients);
      
      // Show success
      setImportStats(stats);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      console.error('Error importing clients:', error);
      alert('Failed to import clients. Please check the file format and try again.');
    } finally {
      setImporting(false);
    }
  };
  

  
  // Handle deleting a client
  const handleDeleteClick = (client: ExtendedClient) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };
  
  // Confirm client deletion
  const confirmDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      // Use the imported deleteClient function
      await deleteClient(clientToDelete.id);
      console.log('Deleted client:', clientToDelete.id);
      
      // Update local state
      setClients(prev => prev.filter(c => c.id !== clientToDelete.id));
      setShowDeleteModal(false);
      setClientToDelete(null);
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Failed to delete client');
    }
  };
  
  // Handle emailing a client
  const handleEmailClick = (client: ExtendedClient) => {
    setClientToEmail(client);
    setShowEmailModal(true);
  };
  
  // Send email to client
  const handleSendEmail = async () => {
    if (!clientToEmail || !emailSubject || !emailBody) return;
    
    try {
      await sendEmail(clientToEmail.email, emailSubject, emailBody);
      
      setShowEmailModal(false);
      setEmailSubject('');
      setEmailBody('');
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };
  
  // Helper functions for table display and interaction
  const getInputType = useCallback((columnType?: string) => {
    switch(columnType) {
      case 'number': return 'number';
      case 'date': return 'date';
      case 'email': return 'email';
      case 'phone': return 'tel';
      default: return 'text';
    }
  }, []);

  // Format cell values for display
  const formatCellValue = useCallback((client: ExtendedClient, column: ColumnConfig) => {
    if (!column) return '';
    
    const value = client[column.id];
    if (value === undefined || value === null) return '-';
    
    if (column.id === 'createdAt' || column.id === 'updatedAt') {
      return value?.toDate ? new Date(value.toDate()).toLocaleDateString() : '-';
    }
    
    if (column.type === 'date' && value instanceof Timestamp) {
      return new Date(value.toDate()).toLocaleDateString();
    }
    
    if (column.type === 'date' && typeof value === 'string') {
      try {
        return new Date(value).toLocaleDateString();
      } catch (e) {
        return value;
      }
    }
    
    if (column.id === 'galleries') {
      if (Array.isArray(value)) {
        return value.length.toString();
      }
      return '0';
    }
    
    return value.toString();
  }, []);
  
  // Inline editing functions
  const startInlineEdit = useCallback((client: ExtendedClient, fieldId: string) => {
    const column = columns.find(col => col.id === fieldId);
    if (!column) return;
    
    const value = formatCellValue(client, column);
    setEditingClientId(client.id);
    setEditingField(fieldId);
    setEditValue(value.toString());
  }, [columns, formatCellValue]);

  const saveInlineEdit = useCallback(async (client: ExtendedClient) => {
    if (!editingField || !editingClientId) return;
    
    try {
      // Create update data based on the field type
      const column = columns.find(col => col.id === editingField);
      if (!column) return;
      
      let value: any = editValue;
      
      // Convert value based on type if needed
      if (column.type === 'number') {
        value = parseFloat(editValue);
        if (isNaN(value)) value = 0;
      } else if (column.type === 'date' && editValue) {
        try {
          value = new Date(editValue);
          // If it's a valid date, convert to Firebase Timestamp
          if (!isNaN(value.getTime())) {
            value = Timestamp.fromDate(value);
          }
        } catch (e) {
          console.error('Invalid date format', e);
        }
      }
      
      // Use firebase to update the client
      const clientRef = doc(db, 'clients', client.id);
      const updateData = { [editingField]: value, updatedAt: Timestamp.now() };
      await updateDoc(clientRef, updateData);
      
      // Update local state
      const updatedClients = clients.map(c => {
        if (c.id === client.id) {
          return { ...c, [editingField]: value, updatedAt: Timestamp.now() };
        }
        return c;
      });
      
      setClients(updatedClients);
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Failed to update client field');
    } finally {
      setEditingClientId(null);
      setEditingField(null);
      setEditValue('');
    }
  }, [editingField, editingClientId, editValue, columns, clients]);

  const cancelInlineEdit = useCallback(() => {
    setEditingClientId(null);
    setEditingField(null);
    setEditValue('');
  }, []);
  
  // Handle column sorting
  const handleSort = useCallback((columnId: string) => {
    // Toggle sort direction if clicking the same column
    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null); // Reset to default order
        setSortColumn('name'); // Default sort column
      } else {
        setSortDirection('asc');
      }
    } else {
      // Set new sort column
      setSortColumn(columnId);
      setSortDirection('asc');
    }
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

  // Filter and sort clients
  const filteredClients = useMemo(() => {
    // First apply search filter
    let filtered = clients.filter(client => {
      if (!searchTerm) return true;
      
      const term = searchTerm.toLowerCase();
      return (
        client.name?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.phone?.toLowerCase().includes(term)
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
        } else if (sortColumn === 'galleries' && Array.isArray(valA) && Array.isArray(valB)) {
          valA = valA.length;
          valB = valB.length;
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
  }, [clients, searchTerm, sortColumn, sortDirection]);
  
  // Column resize handlers
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

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
  
  // Helper function to get sort icon
  const getSortIcon = useCallback((columnId: string) => {
    if (sortColumn !== columnId) return <ArrowUpDown className="inline-block w-4 h-4 opacity-30" />;
    if (sortDirection === 'asc') return <ChevronUp className="inline-block w-4 h-4" />;
    if (sortDirection === 'desc') return <ChevronDown className="inline-block w-4 h-4" />;
    return <ArrowUpDown className="inline-block w-4 h-4 opacity-30" />;
  }, [sortColumn, sortDirection]);
  
  // Get visible and sorted columns
  const visibleColumns = useMemo(() => {
    return columns
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order);
  }, [columns]);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light mb-1">Clients</h1>
          <p className="text-gray-500">Manage your client relationships</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            onClick={() => setShowColumnSettings(!showColumnSettings)}
          >
            <Settings className="w-4 h-4" />
            Customize Columns
          </button>
          <button 
            className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            onClick={addCustomColumn}
          >
            <Plus className="w-4 h-4" />
            Add Field
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".csv"
            onChange={handleFileUpload} 
          />
          <Link to="/admin/add-client" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Client
          </Link>
        </div>
      </div>

      {/* Column settings modal */}
      {showColumnSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Column Settings</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowColumnSettings(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Column</th>
                    <th className="py-2 pr-4">Visible</th>
                    <th className="py-2 pr-4">Width</th>
                    <th className="py-2 pr-4">Order</th>
                  </tr>
                </thead>
                <tbody>
                  {columns.sort((a, b) => a.order - b.order).map((column, index) => (
                    <tr key={column.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center">
                          <GripVertical className="w-5 h-5 text-gray-400 mr-2" />
                          <span>{column.label}</span>
                          {column.isCustom && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              Custom
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <input
                          type="checkbox"
                          checked={column.visible}
                          onChange={e => {
                            setColumns(prev =>
                              prev.map(col =>
                                col.id === column.id ? { ...col, visible: e.target.checked } : col
                              )
                            );
                          }}
                          className="checkbox checkbox-sm"
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <input
                          type="number"
                          value={column.width || 150}
                          onChange={e => {
                            const width = parseInt(e.target.value);
                            if (isNaN(width) || width < 50) return;
                            
                            setColumns(prev =>
                              prev.map(col =>
                                col.id === column.id ? { ...col, width } : col
                              )
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
            placeholder="Search clients..."
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
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        /* Client Table */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredClients.length > 0 ? (
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
                  <th className="text-right p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr 
                    key={client.id}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    {visibleColumns.map(column => (
                      <td key={`${client.id}-${column.id}`} className="p-4 text-gray-700">
                        {editingClientId === client.id && editingField === column.id ? (
                          <div className="flex">
                            <input
                              type={getInputType(column.type)}
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              className="w-full p-1 border border-gray-300 rounded"
                              autoFocus
                              onBlur={() => saveInlineEdit(client)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') saveInlineEdit(client);
                                if (e.key === 'Escape') cancelInlineEdit();
                              }}
                            />
                          </div>
                        ) : (
                          <div 
                            className="hover:bg-gray-100 rounded p-1 -m-1 cursor-pointer"
                            onClick={() => {
                              // Don't make galleries editable directly
                              if (column.id !== 'galleries') {
                                startInlineEdit(client, column.id);
                              }
                            }}
                          >
                            {formatCellValue(client, column)}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEmailClick(client)}
                          title="Email Client"
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Mail className="w-5 h-5" />
                        </button>
                        <Link 
                          to={`/admin/clients/${client.id}`}
                          title="Edit Client"
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(client)}
                          title="Delete Client"
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-10 px-4 text-center">
              <p className="text-gray-500 mb-4">No clients found</p>
              <Link to="/admin/add-client" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add Your First Client
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Delete Modal */}
      {showDeleteModal && clientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-medium mb-4">Delete Client</h3>
            <p className="mb-6">Are you sure you want to delete <strong>{clientToDelete.name}</strong>? This action cannot be undone.</p>
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
      
      {/* Email Modal */}
      {showEmailModal && clientToEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-xl font-medium mb-4">Email to {clientToEmail.name}</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confetti effect for successful imports */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
    </div>
  );
}

