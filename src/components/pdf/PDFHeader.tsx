import React from 'react';

interface PDFHeaderProps {
  title: string;
  subtitle?: string;
  logoUrl?: string;
}

const PDFHeader: React.FC<PDFHeaderProps> = ({ title, subtitle, logoUrl }) => {
  // Default logo path - update this with your actual logo path
  const defaultLogoUrl = '/logo.svg';
  
  return (
    <div className="pdf-header" style={{ 
      padding: '20px',
      borderBottom: '1px solid #e2e2e2',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div className="pdf-header-logo" style={{ maxWidth: '150px' }}>
        <img 
          src={logoUrl || defaultLogoUrl} 
          alt="Hariel Xavier Photography" 
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
      <div className="pdf-header-text" style={{ textAlign: 'right' }}>
        <h1 style={{ 
          fontSize: '24px',
          fontWeight: 'normal',
          margin: '0 0 5px 0',
          color: '#000'
        }}>{title}</h1>
        {subtitle && (
          <p style={{ 
            fontSize: '14px',
            margin: 0,
            color: '#666'
          }}>{subtitle}</p>
        )}
        <p style={{ 
          fontSize: '12px',
          margin: '5px 0 0 0',
          color: '#888'
        }}>
          Hariel Xavier Photography | Hi@HarielXavier.com | (862) 290-4349
        </p>
      </div>
    </div>
  );
};

export default PDFHeader;
