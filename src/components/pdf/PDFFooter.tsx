import React from 'react';

interface PDFFooterProps {
  websiteUrl?: string;
  includeDate?: boolean;
}

const PDFFooter: React.FC<PDFFooterProps> = ({ 
  websiteUrl = 'harielxavierphotography.com',
  includeDate = true 
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="pdf-footer" style={{ 
      padding: '15px 20px',
      borderTop: '1px solid #e2e2e2',
      marginTop: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '11px',
      color: '#888'
    }}>
      <div>
        {includeDate && <span>Generated on {currentDate}</span>}
      </div>
      <div>
        <span>{websiteUrl}</span>
      </div>
      <div>
        <span>© {new Date().getFullYear()} Hariel Xavier Photography</span>
      </div>
    </div>
  );
};

export default PDFFooter;
