/**
 * Sarah AI Avatar Component
 * Beautiful champagne rose themed avatar for Sarah, our AI wedding expert
 */

import React from 'react';

interface SarahAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

const SarahAvatar: React.FC<SarahAvatarProps> = ({ 
  size = 'md', 
  className = '',
  animated = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} ${animated ? 'animate-pulse' : ''}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="champagneRose" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4C2A1" />
            <stop offset="50%" stopColor="#E8B4B8" />
            <stop offset="100%" stopColor="#C8969D" />
          </linearGradient>
          
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="50%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#CD853F" />
          </linearGradient>
          
          <radialGradient id="faceGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FAF7F2" />
            <stop offset="70%" stopColor="#F5E6D3" />
            <stop offset="100%" stopColor="#E8B4B8" />
          </radialGradient>
          
          <linearGradient id="roseAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB6C1" />
            <stop offset="100%" stopColor="#FFC0CB" />
          </linearGradient>
        </defs>

        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#champagneRose)"
          stroke="#C8969D"
          strokeWidth="2"
          opacity="0.9"
        />

        {/* Hair */}
        <path
          d="M20 35 Q25 15, 50 20 Q75 15, 80 35 Q85 45, 75 55 Q70 45, 50 50 Q30 45, 25 55 Q15 45, 20 35"
          fill="url(#hairGradient)"
          opacity="0.8"
        />

        {/* Face */}
        <ellipse
          cx="50"
          cy="55"
          rx="22"
          ry="25"
          fill="url(#faceGlow)"
          stroke="#E8B4B8"
          strokeWidth="1"
          opacity="0.9"
        />

        {/* Eyes */}
        <circle cx="42" cy="48" r="2" fill="#4A4A4A" />
        <circle cx="58" cy="48" r="2" fill="#4A4A4A" />
        <circle cx="42.5" cy="47.5" r="0.8" fill="#FFFFFF" />
        <circle cx="58.5" cy="47.5" r="0.8" fill="#FFFFFF" />

        {/* Eyebrows */}
        <path d="M38 44 Q42 42, 46 44" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M54 44 Q58 42, 62 44" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <path d="M50 52 Q49 54, 50 56" stroke="#E8B4B8" strokeWidth="1" fill="none" strokeLinecap="round" />

        {/* Smile */}
        <path
          d="M44 62 Q50 68, 56 62"
          stroke="#C8969D"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Rose Accent - Small decorative rose */}
        <g transform="translate(70, 25) scale(0.3)">
          <circle cx="0" cy="0" r="8" fill="url(#roseAccent)" opacity="0.7" />
          <path
            d="M-4 -2 Q0 -6, 4 -2 Q6 2, 0 4 Q-6 2, -4 -2"
            fill="#FFB6C1"
            opacity="0.8"
          />
          <circle cx="0" cy="0" r="2" fill="#FFC0CB" />
        </g>

        {/* Sparkle Effects */}
        <g opacity="0.6">
          <circle cx="25" cy="30" r="1" fill="#F5E6D3">
            {animated && (
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle cx="75" cy="70" r="1.5" fill="#F4C2A1">
            {animated && (
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur="2.5s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle cx="30" cy="75" r="1" fill="#E8B4B8">
            {animated && (
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="3s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>

        {/* Subtle glow effect */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="url(#champagneRose)"
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

export default SarahAvatar;
