import React, { useEffect } from 'react';

interface CuratorSocialFeedProps {
  feedId?: string;
  className?: string;
}

const CuratorSocialFeed: React.FC<CuratorSocialFeedProps> = ({ 
  feedId = 'f9d2afdf-f60e-4050-97d7-5b52c7ffaeb3',
  className = '' 
}) => {
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
};

export default CuratorSocialFeed;
