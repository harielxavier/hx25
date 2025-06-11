import { useState } from 'react';

interface GallerySetupHelperProps {
  onSetupComplete?: () => void;
}

export default function GallerySetupHelper({ onSetupComplete }: GallerySetupHelperProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const runSetup = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setError(null);
    setLogs(['Starting gallery setup...']);
    
    try {
      // Override console.log to capture logs
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      
      console.log = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        setLogs(prev => [...prev, message]);
        originalConsoleLog(...args);
      };
      
      console.error = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        setLogs(prev => [...prev, `ERROR: ${message}`]);
        originalConsoleError(...args);
      };
      
      // Gallery setup logic would go here
      console.log('Gallery setup functionality has been removed');
      
      // Restore console functions
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      
      setIsComplete(true);
      setLogs(prev => [...prev, 'Setup completed successfully!']);
      
      if (onSetupComplete) {
        onSetupComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLogs(prev => [...prev, `Error: ${err instanceof Error ? err.message : String(err)}`]);
      console.error('Gallery setup error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">Gallery Setup Helper</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {isComplete && !error && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
          Gallery setup completed successfully!
        </div>
      )}
      
      <button
        onClick={runSetup}
        disabled={isRunning}
        className={`px-4 py-2 rounded ${
          isRunning 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isRunning ? 'Setting up...' : 'Run Gallery Setup'}
      </button>
      
      {logs.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Logs:</h3>
          <div className="bg-gray-100 p-3 rounded max-h-60 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className={log.startsWith('ERROR') ? 'text-red-600' : ''}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
