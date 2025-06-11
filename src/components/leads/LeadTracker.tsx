import React, { useEffect, useState } from 'react';
import { trackLead } from '../../utils/analytics';

interface LeadTrackerProps {
  formId: string;
  source?: string;
  campaign?: string;
  initialInterest?: string;
  children: React.ReactNode;
}

/**
 * LeadTracker - Tracks form submissions as leads for analytics
 * 
 * Wrap any form with this component to automatically track submissions
 * as leads in your analytics system. It will capture:
 * - Source (where the lead came from)
 * - Campaign (if part of a marketing campaign)
 * - Initial interest (what service they're interested in)
 * - Time to convert (how long they spent on site before converting)
 * - Quality score (calculated based on form completeness and other factors)
 */
const LeadTracker: React.FC<LeadTrackerProps> = ({
  formId,
  source = 'Website',
  campaign = 'Organic',
  initialInterest = 'Photography',
  children
}) => {
  const [firstVisitTime, setFirstVisitTime] = useState<number | null>(null);
  
  useEffect(() => {
    // Check if this is their first visit to this form
    const visitKey = `hxp_first_visit_${formId}`;
    const storedTime = localStorage.getItem(visitKey);
    
    if (!storedTime) {
      const now = Date.now();
      localStorage.setItem(visitKey, now.toString());
      setFirstVisitTime(now);
    } else {
      setFirstVisitTime(parseInt(storedTime, 10));
    }
  }, [formId]);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    // Don't prevent default - let the form submission continue
    
    // Calculate time to convert if we have first visit time
    const timeToConvert = firstVisitTime 
      ? Math.floor((Date.now() - firstVisitTime) / 1000) 
      : 0;
    
    // Track the lead in analytics
    trackLead({
      source,
      campaign,
      conversionPage: window.location.pathname,
      qualityScore: calculateQualityScore(e.target as HTMLFormElement),
      initialInterest,
      timeToConvert
    });
  };
  
  // Calculate a quality score based on form completeness and other factors
  const calculateQualityScore = (form: HTMLFormElement): number => {
    // This is a simple implementation - enhance based on your needs
    let score = 5; // Base score
    
    // Get all form elements
    const elements = Array.from(form.elements) as HTMLInputElement[];
    
    // Count filled fields
    const totalFields = elements.filter(el => 
      el.type !== 'submit' && el.type !== 'button' && el.type !== 'reset'
    ).length;
    
    const filledFields = elements.filter(el => 
      el.type !== 'submit' && el.type !== 'button' && el.type !== 'reset' && el.value.trim() !== ''
    ).length;
    
    // Add points for form completeness (up to 3 points)
    if (totalFields > 0) {
      score += Math.min(3, Math.round((filledFields / totalFields) * 3));
    }
    
    // Add points for referral source (higher quality leads)
    if (source === 'Referral') {
      score += 1;
    }
    
    // Add points for direct traffic (shows intent)
    if (source === 'Direct') {
      score += 0.5;
    }
    
    // Cap at 10
    return Math.min(10, score);
  };
  
  // Clone the child element and add our event handler
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // Get the existing props
      const existingProps = child.props as any;
      
      // Create new props with our onSubmit handler
      return React.cloneElement(child, {
        ...existingProps,
        onSubmit: (e: React.FormEvent) => {
          // Call the original onSubmit if it exists
          if (existingProps.onSubmit) {
            existingProps.onSubmit(e);
          }
          handleFormSubmit(e);
        }
      });
    }
    return child;
  });
  
  return <>{childrenWithProps}</>;
};

export default LeadTracker;
