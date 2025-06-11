import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

// Import security bootstrap and logger
import { initializeSecurity } from './utils/securityBootstrap';
import logger from './utils/logger';

// Import the Firebase configuration
import './firebase/config';

// Initialize security features
try {
  initializeSecurity();
  logger.info('Security features initialized successfully');
} catch (error) {
  logger.error('Failed to initialize security features:', error);
  // Display a friendly error message in development
  if (!import.meta.env.PROD) {
    alert('Security configuration error: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

logger.log('Application initializing');

// Add global error handler for better debugging
window.addEventListener('error', (event) => {
  logger.error('GLOBAL ERROR CAUGHT:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('UNHANDLED PROMISE REJECTION:', event.reason);
});

// Get the root element
const rootElement = document.getElementById('root');

logger.debug('Root element found:', rootElement);

if (!rootElement) {
  logger.error('Root element not found!');
} else {
  try {
    logger.debug('Creating React root');
    const root = createRoot(rootElement);
    
    logger.debug('Rendering React application');
    root.render(
      <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>
    );
    
    logger.info('Application rendered successfully');
  } catch (error) {
    logger.error('ERROR RENDERING REACT APP:', error);
    
    // Fallback rendering if React fails
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h1>Error Loading Application</h1>
        <p>There was a problem loading the application:</p>
        <pre style="background: #f8f8f8; padding: 10px; border-radius: 4px; overflow: auto;">${errorMessage}</pre>
        <button onclick="window.location.reload()">Refresh Page</button>
        <div style="margin-top: 20px; color: #666;">
          <p>If this error persists, please check the browser console for additional errors.</p>
        </div>
      </div>
    `;
  }
}
