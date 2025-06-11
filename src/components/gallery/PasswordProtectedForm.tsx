import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface PasswordProtectedFormProps {
  gallery: string;
  onSubmit: (password: string) => void;
  error: string | null;
  loading?: boolean;
}

const PasswordProtectedForm: React.FC<PasswordProtectedFormProps> = ({
  gallery,
  onSubmit,
  error,
  loading = false
}) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center mb-6">
        <div className="p-3 bg-gray-100 rounded-full mb-4">
          <Lock size={24} />
        </div>
        <h1 className="text-2xl font-serif text-center">Password Protected Gallery</h1>
        <p className="text-gray-600 text-center mt-2">{gallery}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Enter the gallery password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Password"
            required
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !password.trim() || loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting || loading ? 'Verifying...' : 'Enter Gallery'}
        </button>
      </form>
      
      <p className="text-sm text-gray-500 mt-6 text-center">
        If you don't have the password, please contact the photographer.
      </p>
    </div>
  );
};

export default PasswordProtectedForm;
