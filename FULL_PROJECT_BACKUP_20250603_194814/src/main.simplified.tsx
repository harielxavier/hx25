import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import './index.css';

// Add global error handler for better debugging
window.addEventListener('error', (event) => {
  console.error('GLOBAL ERROR CAUGHT:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('UNHANDLED PROMISE REJECTION:', event.reason);
});

// Simple initialization function
function initApp() {
  console.log('Initializing application...');
  
  // Get the root element
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }
  
  try {
    console.log('Creating React root');
    const root = createRoot(rootElement);
    
    // Render the application
    root.render(
      <StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>
    );
    
    console.log('React app rendered successfully');
  } catch (error) {
    console.error('ERROR RENDERING REACT APP:', error);
    
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

// Initialize the application
initApp();
