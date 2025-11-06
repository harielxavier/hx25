/**
 * React Bootstrap Module
 *
 * This module ensures React is available globally for charting libraries
 * that may be bundled separately and need access to React.forwardRef
 *
 * This fixes the error:
 * "Cannot read properties of undefined (reading 'forwardRef')"
 */

import React from 'react';
import ReactDOM from 'react-dom';

// Ensure React and ReactDOM are available globally for all libraries
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;

  // Ensure forwardRef is explicitly available
  if (React.forwardRef) {
    (window as any).forwardRef = React.forwardRef;
  }

  // Debug logging (will be removed by terser in production)
  console.debug('React bootstrap loaded:', {
    React: !!window.React,
    ReactDOM: !!window.ReactDOM,
    forwardRef: !!React.forwardRef
  });
}

// Export React for explicit imports
export default React;
export { React };

