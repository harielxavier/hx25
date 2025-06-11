import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Mail, 
  MapPin, 
  Phone, 
  User, 
  Edit, 
  ArrowLeft, 
  Download, 
  Upload, 
  Trash2,
  Clock,
  CheckSquare
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Job, getJob, updateJob, uploadJobDocument, deleteJobDocument } from '../../services/jobsService';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentType, setDocumentType] = useState<'contracts' | 'invoices' | 'questionnaires' | 'quotes' | 'otherDocs'>('contracts');
  
  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      
      try {
        setLoading(true);
        const jobData = await getJob(jobId);
        
        if (!jobData) {
          setError('Job not found');
          return;
        }
        
        setJob(jobData);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [jobId]);
  
  // Format date helper
  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'Not scheduled';
    return format(timestamp.toDate(), 'MMM d, yyyy');
  };
  
  // Format time helper
  const formatTime = (timestamp: Timestamp | null) => {
    if (!timestamp) return '';
    return format(timestamp.toDate(), 'h:mm a');
  };
  
  // Calculate workflow progress percentage
  const getWorkflowProgress = () => {
    if (!job) return 0;
    
    const status = job.status || 'active';
    
    if (status === 'completed') return 100;
    if (status === 'cancelled') return 100;
    
    // Custom calculation based on workflow stage
    const stage = job.workflowStage || 0;
    
    // For simplification, assuming 5 workflow stages (0-4)
    return Math.min(100, Math.max(0, (stage / 4) * 100));
  };
  
  // Handle document upload
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!jobId || !e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploadingDocument(true);
      const file = e.target.files[0];
      await uploadJobDocument(jobId, file, documentType);
      
      // Refresh job data
      const updatedJob = await getJob(jobId);
      if (updatedJob) setJob(updatedJob);
      
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Failed to upload document');
    } finally {
      setUploadingDocument(false);
    }
  };
  
  // Handle document deletion
  const handleDeleteDocument = async (docId: string, docType: keyof Job['documents']) => {
    if (!jobId) return;
    
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      await deleteJobDocument(jobId, docId, docType);
      
      // Refresh job data
      const updatedJob = await getJob(jobId);
      if (updatedJob) setJob(updatedJob);
      
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document');
    }
  };
  
  // Mark job as complete
  const markAsComplete = async () => {
    if (!job || !jobId) return;
    
    try {
      await updateJob(jobId, {
        status: 'completed',
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      setJob({
        ...job,
        status: 'completed',
        updatedAt: Timestamp.now()
      });
      
    } catch (err) {
      console.error('Error completing job:', err);
      alert('Failed to mark job as complete');
    }
  };
  
  if (loading) {
    return (
      <AdminLayout title="Job Details">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (error || !job) {
    return (
      <AdminLayout title="Job Details">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          <p>{error || 'Failed to load job'}</p>
          <button 
            onClick={() => navigate('/admin/jobs')}
            className="mt-4 px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
          >
            Return to Jobs
          </button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title={job.name}>
      <div className="space-y-6">
        {/* Header with back button, job title, and actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/jobs"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{job.name}</h1>
              <p className="text-gray-500">{job.type || 'Photography Job'} • {formatDate(job.mainShootDate)}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {job.status !== 'completed' ? (
              <button
                onClick={markAsComplete}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Mark Complete</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <CheckSquare className="w-4 h-4" />
                <span>Completed</span>
              </div>
            )}
            
            <Link
              to={`/admin/jobs/${jobId}/edit`}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Job</span>
            </Link>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'workflow'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('workflow')}
            >
              Workflow
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mt-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Job Info */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Job Information</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Shoot Date</p>
                      <p className="font-medium">{formatDate(job.mainShootDate)}</p>
                      {job.mainShootDate && (
                        <p className="text-sm text-gray-500">{formatTime(job.mainShootDate)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{job.location || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Job Type</p>
                      <p className="font-medium">{job.type || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">{formatDate(job.createdAt)}</p>
                    </div>
                  </div>
                  
                  {job.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">Notes</p>
                      <p className="mt-1 whitespace-pre-wrap">{job.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Client Info */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Client Information</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{job.clientName || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      {job.clientEmail ? (
                        <a href={`mailto:${job.clientEmail}`} className="font-medium text-blue-600 hover:underline">
                          {job.clientEmail}
                        </a>
                      ) : (
                        <p className="font-medium">Not specified</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      {job.clientPhone ? (
                        <a href={`tel:${job.clientPhone}`} className="font-medium text-blue-600 hover:underline">
                          {job.clientPhone}
                        </a>
                      ) : (
                        <p className="font-medium">Not specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Status</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Job Status</p>
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      job.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : job.status === 'cancelled' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {job.status || 'Active'}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Workflow Progress</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${
                          job.status === 'completed' 
                            ? 'bg-green-500' 
                            : job.status === 'cancelled' 
                            ? 'bg-red-500' 
                            : 'bg-amber-500'
                        } h-2.5 rounded-full`} 
                        style={{ width: `${getWorkflowProgress()}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Lead Source</p>
                    <p className="font-medium">{job.leadSource || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium">Documents</h3>
                
                <div className="flex items-center gap-2">
                  <select 
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as any)}
                  >
                    <option value="contracts">Contract</option>
                    <option value="invoices">Invoice</option>
                    <option value="questionnaires">Questionnaire</option>
                    <option value="quotes">Quote</option>
                    <option value="otherDocs">Other</option>
                  </select>
                  
                  <label className="cursor-pointer flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleDocumentUpload}
                      disabled={uploadingDocument}
                    />
                  </label>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {(['contracts', 'invoices', 'questionnaires', 'quotes', 'otherDocs'] as const).map(docType => (
                  <div key={docType} className="p-4">
                    <h4 className="font-medium mb-2 capitalize">{docType.replace('otherDocs', 'Other Documents')}</h4>
                    
                    {job.documents[docType]?.length > 0 ? (
                      <div className="space-y-2">
                        {job.documents[docType].map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-xs text-gray-500">
                                  Uploaded {doc.uploadedAt?.toDate 
                                    ? format(doc.uploadedAt.toDate(), 'MMM d, yyyy') 
                                    : 'Unknown date'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <a 
                                href={doc.fileUrl} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Download className="w-5 h-5" />
                              </a>
                              <button
                                onClick={() => handleDeleteDocument(doc.id, docType)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No {docType.replace('otherDocs', 'other documents')} available</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Workflow Tab */}
          {activeTab === 'workflow' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Workflow Status</h3>
              </div>
              
              <div className="p-6">
                <div className="relative">
                  {/* Timeline track */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline items */}
                  <div className="space-y-8">
                    <div className="relative flex items-start">
                      <div className={`absolute left-5 w-5 h-5 rounded-full -translate-x-1/2 -translate-y-0.5 ${
                        job.status !== 'cancelled' ? 'bg-green-500' : 'bg-gray-300'
                      } flex items-center justify-center`}>
                        <CheckSquare className="w-3 h-3 text-white" />
                      </div>
                      <div className="ml-8">
                        <h4 className="font-medium">Inquiry Received</h4>
                        <p className="text-sm text-gray-500">{formatDate(job.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className={`absolute left-5 w-5 h-5 rounded-full -translate-x-1/2 -translate-y-0.5 ${
                        (job.workflowStage && job.workflowStage >= 1) || job.status === 'completed' 
                          ? 'bg-green-500' 
                          : 'bg-gray-300'
                      } flex items-center justify-center`}>
                        {(job.workflowStage && job.workflowStage >= 1) || job.status === 'completed' ? (
                          <CheckSquare className="w-3 h-3 text-white" />
                        ) : (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="ml-8">
                        <h4 className="font-medium">Contract Signed</h4>
                        <p className="text-sm text-gray-500">
                          {job.documents?.contracts?.length > 0 
                            ? `${job.documents.contracts.length} contract(s) uploaded` 
                            : 'No contracts uploaded yet'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className={`absolute left-5 w-5 h-5 rounded-full -translate-x-1/2 -translate-y-0.5 ${
                        (job.workflowStage && job.workflowStage >= 2) || job.status === 'completed' 
                          ? 'bg-green-500' 
                          : 'bg-gray-300'
                      } flex items-center justify-center`}>
                        {(job.workflowStage && job.workflowStage >= 2) || job.status === 'completed' ? (
                          <CheckSquare className="w-3 h-3 text-white" />
                        ) : (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="ml-8">
                        <h4 className="font-medium">Shoot Scheduled</h4>
                        <p className="text-sm text-gray-500">
                          {job.mainShootDate 
                            ? formatDate(job.mainShootDate) 
                            : 'Not scheduled yet'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className={`absolute left-5 w-5 h-5 rounded-full -translate-x-1/2 -translate-y-0.5 ${
                        (job.workflowStage && job.workflowStage >= 3) || job.status === 'completed' 
                          ? 'bg-green-500' 
                          : 'bg-gray-300'
                      } flex items-center justify-center`}>
                        {(job.workflowStage && job.workflowStage >= 3) || job.status === 'completed' ? (
                          <CheckSquare className="w-3 h-3 text-white" />
                        ) : (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="ml-8">
                        <h4 className="font-medium">Image Delivery</h4>
                        <p className="text-sm text-gray-500">
                          {job.imageDeliveryDate 
                            ? formatDate(job.imageDeliveryDate) 
                            : 'Not delivered yet'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative flex items-start">
                      <div className={`absolute left-5 w-5 h-5 rounded-full -translate-x-1/2 -translate-y-0.5 ${
                        job.status === 'completed' 
                          ? 'bg-green-500' 
                          : 'bg-gray-300'
                      } flex items-center justify-center`}>
                        {job.status === 'completed' ? (
                          <CheckSquare className="w-3 h-3 text-white" />
                        ) : (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="ml-8">
                        <h4 className="font-medium">Job Completed</h4>
                        <p className="text-sm text-gray-500">
                          {job.status === 'completed' 
                            ? formatDate(job.updatedAt) 
                            : 'Not completed yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
