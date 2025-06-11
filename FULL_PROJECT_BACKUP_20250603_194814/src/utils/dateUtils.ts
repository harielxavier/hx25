/**
 * Date utilities for formatting and comparing dates
 * Used throughout the client gallery system
 */

/**
 * Format a date to a human-readable string
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
): string => {
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Format a date with time
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculate days remaining until a deadline
 * @param deadline - Deadline date
 * @returns Number of days remaining (negative if passed)
 */
export const getDaysRemaining = (deadline: Date): number => {
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if a date is in the past
 * @param date - Date to check
 * @returns Boolean indicating if date is in the past
 */
export const isDatePassed = (date: Date): boolean => {
  const now = new Date();
  return date.getTime() < now.getTime();
};

/**
 * Get a relative time string (e.g., "2 days ago", "in 3 days")
 * @param date - Date to compare
 * @returns Relative time string
 */
export const getRelativeTimeString = (date: Date): string => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays === -1) {
    return 'Yesterday';
  } else if (diffDays > 1) {
    return `In ${diffDays} days`;
  } else {
    return `${Math.abs(diffDays)} days ago`;
  }
};

/**
 * Format a deadline with appropriate styling information
 * @param deadline - Deadline date
 * @returns Object with formatted string and status
 */
export const formatDeadline = (deadline: Date): { 
  text: string; 
  status: 'normal' | 'warning' | 'danger' | 'expired';
} => {
  const daysRemaining = getDaysRemaining(deadline);
  
  if (daysRemaining < 0) {
    return {
      text: `Expired ${Math.abs(daysRemaining)} days ago`,
      status: 'expired'
    };
  } else if (daysRemaining === 0) {
    return {
      text: 'Due today',
      status: 'danger'
    };
  } else if (daysRemaining <= 3) {
    return {
      text: `${daysRemaining} days remaining`,
      status: 'warning'
    };
  } else {
    return {
      text: `${daysRemaining} days remaining`,
      status: 'normal'
    };
  }
};

/**
 * Add days to a date
 * @param date - Starting date
 * @param days - Number of days to add
 * @returns New date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get expiration date based on current date and expiration period
 * @param expirationDays - Number of days until expiration
 * @returns Expiration date
 */
export const getExpirationDate = (expirationDays: number): Date => {
  return addDays(new Date(), expirationDays);
};

export default {
  formatDate,
  formatDateTime,
  getDaysRemaining,
  isDatePassed,
  getRelativeTimeString,
  formatDeadline,
  addDays,
  getExpirationDate
};
