/**
 * React Bootstrap Module
 *
 * React 19 best practice: Let the module system handle loading order.
 * Only set global React for legacy libraries that require it.
 */

import React from 'react';
import ReactDOM from 'react-dom';

// Only set global React if absolutely needed for legacy libraries
// This is NOT recommended for new code
if (typeof window !== 'undefined' && !(window as any).React) {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
}

// Export React for explicit imports
export default React;
export { React, ReactDOM };

