import React from 'react';

interface CalendlyEmbedProps {
  url: string;
  styles?: React.CSSProperties;
}

export default function CalendlyEmbed({ url, styles }: CalendlyEmbedProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Schedule a Session</h2>
      <div className="calendly-embed-wrapper" style={{ minHeight: '700px', ...styles }}>
        <iframe
          src={url}
          width="100%"
          height="700"
          frameBorder="0"
          title="Schedule a Session"
        />
      </div>
    </div>
  );
}