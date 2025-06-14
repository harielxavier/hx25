import React from 'react';
import { cn } from '../../utils/cn';

interface SimpleDotMatrixProps {
  className?: string;
}

export const SimpleDotMatrix: React.FC<SimpleDotMatrixProps> = ({ className }) => {
  return (
    <div className={cn("absolute inset-0 w-full h-full", className)}>
      <div 
        className="w-full h-full opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          animation: 'dotPulse 4s ease-in-out infinite'
        }}
      />
      <style jsx>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};