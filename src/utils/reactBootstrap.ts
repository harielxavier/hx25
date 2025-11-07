/**
 * React Bootstrap Module - CRITICAL LOADING ORDER FIX
 *
 * This module MUST load before any vendor bundles that use React.forwardRef
 * Fixes: "Cannot read properties of undefined (reading 'forwardRef')"
 */

import React from 'react';
import ReactDOM from 'react-dom';

// Aggressively ensure React is globally available IMMEDIATELY
const globalScope = (globalThis as any) || (window as any) || {};

// Set React on ALL possible global objects
globalScope.React = React;
globalScope.ReactDOM = ReactDOM;

// Create a safe global object for lucide-react exports
globalScope.LucideReact = globalScope.LucideReact || {};

if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;

  // Create a safe global object for lucide-react to attach to
  (window as any).LucideReact = (window as any).LucideReact || {};

  // Also create an Activity placeholder to prevent undefined errors
  if (!(window as any).Activity) {
    (window as any).Activity = {};
  }

  // Explicitly expose ALL React methods that vendor bundles might need
  (window as any).forwardRef = React.forwardRef;
  (window as any).createElement = React.createElement;
  (window as any).Component = React.Component;
  (window as any).PureComponent = React.PureComponent;
  (window as any).memo = React.memo;
  (window as any).useEffect = React.useEffect;
  (window as any).useState = React.useState;
  (window as any).useRef = React.useRef;

  // Ensure React object has all methods accessible
  Object.defineProperty(window, 'React', {
    value: React,
    writable: false,
    configurable: false
  });
}

// Console verification (removed in production)
if (process.env.NODE_ENV !== 'production') {
  console.log('✅ React Bootstrap: React globally available', {
    React: !!globalScope.React,
    forwardRef: !!React.forwardRef,
    window: typeof window !== 'undefined'
  });
}

// Export React for explicit imports
export default React;
export { React };

