export const sanitizeImageUrl = (url: string): string => {
  try {
    return url;
  } catch {
    return '/placeholder-image.jpg';
  }
};

export const validateCSPHeaders = (headers: Headers) => {
  const cspHeader = headers.get('Content-Security-Policy');
  const requiredDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: firebasestorage.googleapis.com"
  ];

  if (!cspHeader || !requiredDirectives.every(d => cspHeader.includes(d))) {
    throw new Error('Invalid Content Security Policy configuration');
  }
};
