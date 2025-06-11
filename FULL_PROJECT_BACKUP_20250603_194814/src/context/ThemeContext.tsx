import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme, PaletteMode } from '@mui/material';

// Define the theme context type
interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
  theme: Theme;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  theme: createTheme()
});

// Hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Custom Theme Provider with Dark Mode Support
 * 
 * Features:
 * - Light/Dark mode toggle with user preference detection
 * - Enhanced dark mode with subtle lighting effects for photography
 * - Persistent theme preference using localStorage
 * - Optimized color palette for photography display
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get initial theme from localStorage or system preference
  const getInitialMode = (): PaletteMode => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      return savedMode;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };
  
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);
  
  // Toggle between light and dark mode
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    
    // Add/remove dark mode class to body for global styling
    if (mode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [mode]);
  
  // Create the theme based on current mode
  const theme = React.useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: mode === 'dark' ? '#90caf9' : '#1976d2',
          light: mode === 'dark' ? '#e3f2fd' : '#42a5f5',
          dark: mode === 'dark' ? '#42a5f5' : '#1565c0',
        },
        secondary: {
          main: mode === 'dark' ? '#ce93d8' : '#9c27b0',
          light: mode === 'dark' ? '#f3e5f5' : '#ba68c8',
          dark: mode === 'dark' ? '#ab47bc' : '#7b1fa2',
        },
        background: {
          default: mode === 'dark' ? '#121212' : '#ffffff',
          paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        },
        text: {
          primary: mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
          secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
        },
        // Custom colors for photography website
        ...(mode === 'dark' && {
          // Enhanced dark mode with subtle lighting effects
          photography: {
            highlight: 'rgba(255, 255, 255, 0.08)',
            glow: '0 0 15px rgba(255, 255, 255, 0.05)',
            accent: '#2d8bbd',
            surface: '#262626',
            border: 'rgba(255, 255, 255, 0.12)',
          },
        }),
        ...(mode === 'light' && {
          photography: {
            highlight: 'rgba(0, 0, 0, 0.04)',
            glow: 'none',
            accent: '#1976d2',
            surface: '#f5f5f5',
            border: 'rgba(0, 0, 0, 0.12)',
          },
        }),
      },
      typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 700,
          fontSize: '2.5rem',
          lineHeight: 1.2,
        },
        h2: {
          fontWeight: 700,
          fontSize: '2rem',
          lineHeight: 1.2,
        },
        h3: {
          fontWeight: 600,
          fontSize: '1.75rem',
          lineHeight: 1.2,
        },
        h4: {
          fontWeight: 600,
          fontSize: '1.5rem',
          lineHeight: 1.2,
        },
        h5: {
          fontWeight: 600,
          fontSize: '1.25rem',
          lineHeight: 1.2,
        },
        h6: {
          fontWeight: 600,
          fontSize: '1rem',
          lineHeight: 1.2,
        },
        body1: {
          fontSize: '1rem',
          lineHeight: 1.5,
        },
        body2: {
          fontSize: '0.875rem',
          lineHeight: 1.5,
        },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              ...(mode === 'dark' && {
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              }),
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 500,
              ...(mode === 'dark' && {
                background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.8), rgba(66, 165, 245, 0.8))',
                '&:hover': {
                  background: 'linear-gradient(45deg, rgba(25, 118, 210, 1), rgba(66, 165, 245, 1))',
                },
              }),
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              ...(mode === 'dark' && {
                background: 'linear-gradient(145deg, #1e1e1e, #262626)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              }),
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              ...(mode === 'dark' && {
                background: 'rgba(18, 18, 18, 0.8)',
                backdropFilter: 'blur(10px)',
              }),
            },
          },
        },
      },
    });
  }, [mode]);
  
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
