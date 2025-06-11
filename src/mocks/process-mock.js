// Mock implementation of the Node.js process object for browser environments
export default {
  env: {
    // Default environment variables
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: 'service_default',
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: 'template_default',
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: '',
    // Add any other environment variables needed by the application
  }
};
