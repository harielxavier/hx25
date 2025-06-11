/**
 * Type definitions for email module
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export function sendEmail(options: EmailOptions): Promise<boolean>;
export function verifyEmailConnection(): Promise<boolean>;

export default {
  sendEmail,
  verifyEmailConnection
};
