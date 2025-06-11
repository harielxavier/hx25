import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Check, 
  AlertCircle, 
  Clock, 
  Pen,
  Eye,
  Shield,
  Calendar,
  User
} from 'lucide-react';
import { Job } from '../../services/jobsService';

interface ContractSigningInterfaceProps {
  clientId: string;
  job: Job;
}

interface Contract {
  id: string;
  title: string;
  type: 'photography_agreement' | 'model_release' | 'venue_agreement' | 'payment_terms';
  status: 'pending' | 'signed' | 'expired';
  createdDate: Date;
  dueDate: Date;
  signedDate?: Date;
  documentUrl: string;
  signingUrl?: string;
  description: string;
  requiresWitness: boolean;
  witnessEmail?: string;
  witnessSignedDate?: Date;
}

const ContractSigningInterface: React.FC<ContractSigningInterfaceProps> = ({ clientId, job }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isSigningMode, setIsSigningMode] = useState(false);
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(true);
  const [signingLoading, setSigning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockContracts: Contract[] = [
      {
        id: '1',
        title: 'Wedding Photography Agreement',
        type: 'photography_agreement',
        status: 'signed',
        createdDate: new Date('2024-01-15'),
        dueDate: new Date('2024-02-15'),
        signedDate: new Date('2024-01-20'),
        documentUrl: '/MoStuff/WeddingGuide.pdf',
        description: 'Main photography contract outlining services, deliverables, and terms.',
        requiresWitness: false
      },
      {
        id: '2',
        title: 'Model Release Form',
        type: 'model_release',
        status: 'pending',
        createdDate: new Date('2024-01-15'),
        dueDate: new Date('2024-02-01'),
        documentUrl: '/MoStuff/WeddingGuide.pdf',
        signingUrl: '#',
        description: 'Permission to use photos for marketing and portfolio purposes.',
        requiresWitness: false
      },
      {
        id: '3',
        title: 'Payment Terms Agreement',
        type: 'payment_terms',
        status: 'pending',
        createdDate: new Date('2024-01-20'),
        dueDate: new Date('2024-02-10'),
        documentUrl: '/MoStuff/WeddingGuide.pdf',
        signingUrl: '#',
        description: 'Payment schedule and terms for wedding photography services.',
        requiresWitness: true,
        witnessEmail: 'witness@example.com'
      }
    ];

    setTimeout(() => {
      setContracts(mockContracts);
      setLoading(false);
    }, 1000);
  }, [clientId, job]);

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'signed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'expired':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: Contract['status']) => {
    switch (status) {
      case 'signed':
        return <Check className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const signContract = async (contractId: string) => {
    setSigning(true);
    
    // Simulate API call
    setTimeout(() => {
      setContracts(prev => prev.map(contract => 
        contract.id === contractId 
          ? { ...contract, status: 'signed' as const, signedDate: new Date() }
          : contract
      ));
      setIsSigningMode(false);
      setSelectedContract(null);
      setSigning(false);
    }, 2000);
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Contracts & Documents</h2>
            <p className="text-gray-600">Review and sign your photography agreements</p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Secured with 256-bit encryption</span>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="grid gap-6">
        {contracts.map((contract) => (
          <motion.div
            key={contract.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
                    {getStatusIcon(contract.status)}
                    <span className="capitalize">{contract.status}</span>
                  </div>
                  
                  {contract.requiresWitness && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      <User className="w-3 h-3" />
                      <span>Witness Required</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{contract.title}</h3>
                <p className="text-gray-600 mb-4">{contract.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <p className="font-medium">{contract.createdDate.toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Due Date:</span>
                    <p className="font-medium">{contract.dueDate.toLocaleDateString()}</p>
                  </div>
                  
                  {contract.signedDate && (
                    <div>
                      <span className="text-gray-500">Signed:</span>
                      <p className="font-medium text-green-600">{contract.signedDate.toLocaleDateString()}</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <p className="font-medium capitalize">{contract.type.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-6">
                <button
                  onClick={() => setSelectedContract(contract)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                
                <a
                  href={contract.documentUrl}
                  download
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
                
                {contract.status === 'pending' && (
                  <button
                    onClick={() => {
                      setSelectedContract(contract);
                      setIsSigningMode(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    <Pen className="w-4 h-4" />
                    <span>Sign</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contract Viewer/Signing Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedContract.title}</h3>
                  <p className="text-gray-600">{selectedContract.description}</p>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedContract(null);
                    setIsSigningMode(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {!isSigningMode ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Contract Preview</h4>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        This is a preview of your {selectedContract.title.toLowerCase()}. 
                        The full document contains detailed terms and conditions for your photography services.
                      </p>
                      
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-800 mb-2">Key Terms:</h5>
                        <ul className="text-blue-700 space-y-1">
                          <li>• Photography services for {job.type}</li>
                          <li>• Event date: {job.mainShootDate?.toDate().toLocaleDateString()}</li>
                          <li>• Location: {job.location}</li>
                          <li>• Delivery timeline: 6-8 weeks</li>
                          <li>• Usage rights and licensing terms</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {selectedContract.status === 'pending' && (
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setIsSigningMode(true)}
                        className="flex items-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
                      >
                        <Pen className="w-4 h-4" />
                        <span>Proceed to Sign</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Electronic Signature</h4>
                        <p className="text-yellow-700 text-sm mt-1">
                          By signing below, you agree to the terms and conditions outlined in this contract.
                          Your electronic signature has the same legal effect as a handwritten signature.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name (Type your name as it appears on your ID)
                    </label>
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="Enter your full legal name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Draw Your Signature
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4">
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={150}
                        className="border border-gray-200 rounded cursor-crosshair w-full"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                      <button
                        onClick={clearSignature}
                        className="mt-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Clear Signature
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Signing Date: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setIsSigningMode(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    
                    <button
                      onClick={() => signContract(selectedContract.id)}
                      disabled={!signature.trim() || signingLoading}
                      className="flex items-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {signingLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          <span>Signing...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Sign Contract</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractSigningInterface;
