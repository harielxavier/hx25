import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  File, 
  Image, 
  FileText, 
  Archive, 
  Eye,
  Share2,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Search,
  Grid,
  List
} from 'lucide-react';
import { Job } from '../../services/jobsService';

interface DownloadCenterProps {
  clientId: string;
  job: Job;
}

interface DownloadableFile {
  id: string;
  name: string;
  description: string;
  type: 'image' | 'document' | 'video' | 'archive';
  category: 'engagement' | 'wedding' | 'contract' | 'invoice' | 'other';
  url: string;
  thumbnailUrl?: string;
  size: number;
  uploadedAt: Date;
  expiresAt?: Date;
  downloadCount: number;
  maxDownloads?: number;
  status: 'available' | 'processing' | 'expired' | 'restricted';
  resolution?: string;
  format?: string;
}

interface DownloadPackage {
  id: string;
  name: string;
  description: string;
  files: DownloadableFile[];
  totalSize: number;
  createdAt: Date;
  downloadUrl: string;
  status: 'ready' | 'preparing' | 'expired';
}

const DownloadCenter: React.FC<DownloadCenterProps> = ({ clientId, job }) => {
  const [files, setFiles] = useState<DownloadableFile[]>([]);
  const [packages, setPackages] = useState<DownloadPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'images' | 'documents' | 'videos' | 'archives'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'engagement' | 'wedding' | 'contract' | 'invoice' | 'other'>('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockFiles: DownloadableFile[] = [
      {
        id: '1',
        name: 'Engagement Session - High Resolution',
        description: 'Complete engagement photo collection in high resolution',
        type: 'archive',
        category: 'engagement',
        url: '/downloads/engagement-hr.zip',
        size: 524288000, // 500MB
        uploadedAt: new Date('2024-02-28'),
        downloadCount: 3,
        maxDownloads: 10,
        status: 'available'
      },
      {
        id: '2',
        name: 'Wedding Photography Contract',
        description: 'Signed photography agreement and terms',
        type: 'document',
        category: 'contract',
        url: '/downloads/contract.pdf',
        thumbnailUrl: '/MoStuff/WeddingGuide.pdf',
        size: 2048000, // 2MB
        uploadedAt: new Date('2024-01-20'),
        downloadCount: 1,
        status: 'available',
        format: 'PDF'
      },
      {
        id: '3',
        name: 'Engagement Highlights Video',
        description: 'Short highlight reel from your engagement session',
        type: 'video',
        category: 'engagement',
        url: '/downloads/engagement-video.mp4',
        thumbnailUrl: '/MoStuff/amanda/hero.jpg',
        size: 157286400, // 150MB
        uploadedAt: new Date('2024-03-05'),
        downloadCount: 2,
        status: 'available',
        resolution: '1080p',
        format: 'MP4'
      },
      {
        id: '4',
        name: 'Print Release Form',
        description: 'Authorization for printing your photos',
        type: 'document',
        category: 'contract',
        url: '/downloads/print-release.pdf',
        size: 512000, // 500KB
        uploadedAt: new Date('2024-02-28'),
        downloadCount: 0,
        status: 'available',
        format: 'PDF'
      },
      {
        id: '5',
        name: 'Wedding Day Sneak Peeks',
        description: 'Preview photos from your wedding day',
        type: 'archive',
        category: 'wedding',
        url: '/downloads/wedding-sneak-peeks.zip',
        size: 52428800, // 50MB
        uploadedAt: new Date('2024-04-17'),
        downloadCount: 5,
        status: 'available'
      },
      {
        id: '6',
        name: 'Final Wedding Gallery',
        description: 'Complete wedding photo collection - coming soon!',
        type: 'archive',
        category: 'wedding',
        url: '/downloads/wedding-final.zip',
        size: 1073741824, // 1GB
        uploadedAt: new Date('2024-05-30'),
        downloadCount: 0,
        status: 'processing'
      }
    ];

    const mockPackages: DownloadPackage[] = [
      {
        id: '1',
        name: 'Complete Engagement Collection',
        description: 'All engagement photos, video, and documents in one package',
        files: mockFiles.filter(f => f.category === 'engagement'),
        totalSize: 734003200, // ~700MB
        createdAt: new Date('2024-03-01'),
        downloadUrl: '/downloads/complete-engagement.zip',
        status: 'ready'
      },
      {
        id: '2',
        name: 'Wedding Documentation Package',
        description: 'All contracts, releases, and legal documents',
        files: mockFiles.filter(f => f.category === 'contract'),
        totalSize: 2560000, // ~2.5MB
        createdAt: new Date('2024-01-25'),
        downloadUrl: '/downloads/wedding-docs.zip',
        status: 'ready'
      }
    ];

    setTimeout(() => {
      setFiles(mockFiles);
      setPackages(mockPackages);
      setLoading(false);
    }, 1000);
  }, [clientId, job]);

  const filteredFiles = files.filter(file => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'images' && file.type === 'image') ||
                         (filter === 'documents' && file.type === 'document') ||
                         (filter === 'videos' && file.type === 'video') ||
                         (filter === 'archives' && file.type === 'archive');
    
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    
    const matchesSearch = searchTerm === '' || 
                         file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const getFileIcon = (type: DownloadableFile['type']) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <File className="w-5 h-5" />;
      case 'archive':
        return <Archive className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: DownloadableFile['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'restricted':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: DownloadableFile['status']) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'expired':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'restricted':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadFile = (file: DownloadableFile) => {
    if (file.status !== 'available') return;
    
    // Update download count
    setFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, downloadCount: f.downloadCount + 1 } : f
    ));
    
    // Trigger download
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPackage = (pkg: DownloadPackage) => {
    if (pkg.status !== 'ready') return;
    
    const link = document.createElement('a');
    link.href = pkg.downloadUrl;
    link.download = pkg.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Download Center</h2>
            <p className="text-gray-600">Access your photos, videos, and documents</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Download Packages */}
      {packages.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Download Packages</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">{pkg.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span>{pkg.files.length} files</span>
                      <span>{formatFileSize(pkg.totalSize)}</span>
                      <span>Created {pkg.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => downloadPackage(pkg)}
                    disabled={pkg.status !== 'ready'}
                    className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Files</option>
              <option value="images">Images</option>
              <option value="documents">Documents</option>
              <option value="videos">Videos</option>
              <option value="archives">Archives</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="engagement">Engagement</option>
              <option value="wedding">Wedding</option>
              <option value="contract">Contracts</option>
              <option value="invoice">Invoices</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Files */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Individual Files</h3>
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                className={`border rounded-xl p-6 transition-all duration-200 hover:shadow-md ${getStatusColor(file.status)}`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                    <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                      {getStatusIcon(file.status)}
                      <span className="capitalize">{file.status}</span>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-800 mb-2">{file.name}</h4>
                <p className="text-gray-600 text-sm mb-4">{file.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span>{file.uploadedAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downloads:</span>
                    <span>{file.downloadCount}{file.maxDownloads ? `/${file.maxDownloads}` : ''}</span>
                  </div>
                  {file.format && (
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span>{file.format}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadFile(file)}
                    disabled={file.status !== 'available'}
                    className="flex-1 flex items-center justify-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  
                  {file.thumbnailUrl && (
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <div key={file.id} className={`border rounded-xl p-6 ${getStatusColor(file.status)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-semibold text-gray-800">{file.name}</h4>
                        <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                          {getStatusIcon(file.status)}
                          <span className="capitalize">{file.status}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{file.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>Uploaded {file.uploadedAt.toLocaleDateString()}</span>
                        <span>{file.downloadCount} downloads</span>
                        {file.format && <span>{file.format}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.thumbnailUrl && (
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => downloadFile(file)}
                      disabled={file.status !== 'available'}
                      className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No files found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadCenter;
