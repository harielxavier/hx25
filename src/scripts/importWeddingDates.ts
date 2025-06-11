/**
 * Script to import wedding dates from Studio Ninja export data
 * This script extracts wedding dates from the folder structure and updates the calendar service
 */

import { createBookingEvent } from '../services/calendarService';
import fs from 'fs';
import path from 'path';

// Path to the import data directory
const IMPORT_DATA_PATH = '/Users/bigmo/Desktop/HarielXavierActive/Import Data/Studio Ninja Leads Export [15 Feb 2025 0308PM]';

// Function to extract date from folder name
function extractDateFromFolderName(folderName: string): Date | null {
  // Pattern: DD MMM YYYY - Client Name
  const datePattern = /(\d{2}) ([A-Za-z]{3}) (\d{4})/;
  const match = folderName.match(datePattern);
  
  if (match) {
    const [_, day, month, year] = match;
    const monthMap: {[key: string]: number} = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    return new Date(parseInt(year), monthMap[month], parseInt(day));
  }
  
  return null;
}

// Function to extract client name from folder name
function extractClientNameFromFolderName(folderName: string): string {
  // Pattern: DD MMM YYYY - Client Name
  const namePattern = /\d{2} [A-Za-z]{3} \d{4} - (.+)/;
  const match = folderName.match(namePattern);
  
  if (match) {
    return match[1];
  }
  
  return 'Wedding Client';
}

// Function to import wedding dates
async function importWeddingDates(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Starting wedding date import...');
    
    // Read the directory
    const folders = fs.readdirSync(IMPORT_DATA_PATH);
    
    // Filter out non-wedding folders (those without dates)
    const weddingFolders = folders.filter(folder => {
      return extractDateFromFolderName(folder) !== null;
    });
    
    console.log(`Found ${weddingFolders.length} wedding folders to import`);
    
    // Process each wedding folder
    for (const folder of weddingFolders) {
      const date = extractDateFromFolderName(folder);
      const clientName = extractClientNameFromFolderName(folder);
      
      if (date) {
        // Skip past dates
        const today = new Date();
        if (date < today) {
          console.log(`Skipping past wedding: ${folder}`);
          continue;
        }
        
        console.log(`Importing wedding: ${clientName} on ${date.toDateString()}`);
        
        // Check if there's a package info in the quotes folder
        let packageName = 'The Timeless';
        const quotesPath = path.join(IMPORT_DATA_PATH, folder, 'quotes');
        
        if (fs.existsSync(quotesPath)) {
          // In a real implementation, we would parse the quote files to determine the package
          // For now, we'll use a default package
          packageName = 'The Timeless';
        }
        
        // Create booking event in calendar
        await createBookingEvent(date, clientName, packageName, `Imported from Studio Ninja`);
      }
    }
    
    console.log('Wedding date import completed successfully!');
    return { success: true, message: `Imported ${weddingFolders.length} wedding dates` };
  } catch (error: any) {
    console.error('Error importing wedding dates:', error);
    return { success: false, message: error.message };
  }
}

// Export the function for use in other files
export default importWeddingDates;

// If this script is run directly, execute the import
if (require.main === module) {
  importWeddingDates()
    .then(result => {
      console.log(result.message);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}
