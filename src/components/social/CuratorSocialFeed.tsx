import React, { useEffect } from 'react';

interface CuratorSocialFeedProps {
  feedId?: string;
  className?: string;
}

const CuratorSocialFeed: React.FC<CuratorSocialFeedProps> = ({
  feedId = 'f9d2afdf-f60e-4050-97d7-5b52c7ffaeb3',
  className = ''
}) => {
  // Temporarily disable Curator.io feed to prevent 403 errors
  // Instagram access token needs to be refreshed in Curator.io dashboard
  return (
    <div className={`curator-social-feed ${className}`}>
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <div className="text-gray-600 mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Feed Temporarily Unavailable</h3>
        <p className="text-gray-600">
          Our Instagram feed is being updated. Please check back soon or follow us on social media for the latest updates.
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <a
            href="https://instagram.com/harirelxavier"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            View on Instagram
          </a>
        </div>
      </div>
    </div>
  );

  // Original code disabled to prevent 403 errors:
  /*
  useEffect(() => {
    // Load Curator.io script
    const loadScript = () => {
      const script = document.createElement('script');
      script.async = true;
      script.charset = 'UTF-8';
      script.src = `https://cdn.curator.io/published/${feedId}.js`;

      // Add the script to the document
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }

      // Clean up function
      return () => {
        // Try to find and remove the script
        const curatorScript = document.querySelector(`script[src*="${feedId}"]`);
        if (curatorScript && curatorScript.parentNode) {
          curatorScript.parentNode.removeChild(curatorScript);
        }
      };
    };

    // Only load the script if we're in the browser
    if (typeof window !== 'undefined') {
      return loadScript();
    }
  }, [feedId]);

  // Add CSS to hide the attribution
  useEffect(() => {
    // Create a style element to hide the Curator.io attribution
    const style = document.createElement('style');
    style.textContent = `
      .crt-logo, .crt-tag, a[href="https://curator.io"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        width: 0 !important;
        position: absolute !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
      }
    `;
    document.head.appendChild(style);

    // Clean up function
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={`curator-social-feed ${className}`}>
      <div id="curator-feed-default-feed-layout">
        <a href="https://curator.io" target="_blank" rel="noopener noreferrer" className="crt-logo crt-tag" style={{ display: 'none' }}>
          Powered by Curator.io
        </a>
      </div>
    </div>
  );
  */
};

export default CuratorSocialFeed;
