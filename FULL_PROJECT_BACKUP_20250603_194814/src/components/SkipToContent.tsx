import React from 'react';

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-4 py-2 z-50"
    >
      Skip to main content
    </a>
  );
}