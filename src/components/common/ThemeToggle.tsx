import React from 'react';
import { IconButton, Tooltip, Box, useTheme } from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

/**
 * ThemeToggle Component
 * 
 * A modern theme toggle with micro-interactions for switching between light and dark modes.
 * Features:
 * - Smooth animations during theme transitions
 * - Accessible keyboard controls
 * - Visual feedback on hover and click
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'medium',
  showLabel = false 
}) => {
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();
  
  // Icon sizes based on the size prop
  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };
  
  // Animation variants for the icon container
  const containerVariants = {
    initial: { 
      rotate: 0 
    },
    animate: { 
      rotate: mode === 'light' ? 0 : 180,
      transition: { 
        type: 'spring', 
        stiffness: 200, 
        damping: 10 
      }
    }
  };
  
  // Animation variants for the icon
  const iconVariants = {
    initial: { 
      scale: 0.8, 
      opacity: 0 
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.1, 
        duration: 0.2 
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { 
        duration: 0.1 
      }
    }
  };
  
  return (
    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <Box 
        sx={{ 
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <IconButton
          onClick={toggleTheme}
          aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.05)',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)',
            },
            transition: 'all 0.3s ease',
            borderRadius: '50%',
            width: size === 'small' ? 32 : size === 'medium' ? 40 : 48,
            height: size === 'small' ? 32 : size === 'medium' ? 40 : 48,
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {mode === 'light' ? (
              <motion.div
                key="sun"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Sun size={iconSizes[size]} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Moon size={iconSizes[size]} />
              </motion.div>
            )}
          </motion.div>
        </IconButton>
        
        {showLabel && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: theme.palette.text.secondary
            }}
          >
            {mode === 'light' ? 'Light' : 'Dark'}
          </motion.span>
        )}
      </Box>
    </Tooltip>
  );
};

export default ThemeToggle;
