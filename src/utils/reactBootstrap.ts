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

// Ensure React is available globally for charting libraries
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Export React for explicit imports
export default React;
export { React };

