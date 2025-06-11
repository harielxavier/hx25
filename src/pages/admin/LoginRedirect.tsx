import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to login page immediately
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
