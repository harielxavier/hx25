import React from 'react';
import LeadTracker from './LeadTracker';

interface ContactFormWithTrackingProps {
  formId: string;
  source?: string;
  campaign?: string;
  initialInterest?: string;
  className?: string;
  embedCode?: string;
  fallbackForm?: React.ReactNode;
}

/**
 * ContactFormWithTracking - Wraps Studio Ninja or other embedded forms with lead tracking
 * 
 * This component allows you to:
 * 1. Use your existing Studio Ninja embed code
 * 2. Track all form submissions as leads in your analytics system
 * 3. Capture detailed metrics about lead sources and quality
 * 
 * Usage:
 * <ContactFormWithTracking
 *   formId="contact-wedding"
 *   source="Wedding Page"
 *   campaign="Spring 2025"
 *   initialInterest="Wedding Photography"
 *   embedCode={studioNinjaEmbedCode}
 * />
 */
const ContactFormWithTracking: React.FC<ContactFormWithTrackingProps> = ({
  formId,
  source = 'Website',
  campaign = 'Organic',
  initialInterest = 'Photography',
  className = '',
  embedCode,
  fallbackForm
}) => {
  // If we have an embed code, create a form wrapper around it
  const EmbeddedForm = embedCode ? (
    <form id={formId} className={className} onSubmit={(e) => e.preventDefault()}>
      <div dangerouslySetInnerHTML={{ __html: embedCode }} />
      
      {/* This script intercepts the Studio Ninja form submission */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.addEventListener('DOMContentLoaded', function() {
          // Find the Studio Ninja form inside our wrapper
          const studioNinjaForm = document.querySelector('#${formId} form');
          if (studioNinjaForm) {
            // Store the original submit function
            const originalSubmit = studioNinjaForm.submit;
            
            // Override the submit function
            studioNinjaForm.submit = function() {
              // Trigger our wrapper form's submit event
              const event = new Event('submit', { bubbles: true });
              document.getElementById('${formId}').dispatchEvent(event);
              
              // Call the original submit
              return originalSubmit.apply(this, arguments);
            };
          }
        });
      `}} />
    </form>
  ) : fallbackForm;

  // If we don't have either an embed code or fallback form, show a message
  if (!EmbeddedForm) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        Please provide either an embedCode or fallbackForm to ContactFormWithTracking
      </div>
    );
  }

  // Wrap the form with our lead tracker
  return (
    <LeadTracker
      formId={formId}
      source={source}
      campaign={campaign}
      initialInterest={initialInterest}
    >
      {EmbeddedForm}
    </LeadTracker>
  );
};

export default ContactFormWithTracking;
