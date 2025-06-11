/**
 * Main script to import all data from Studio Ninja export
 * This script orchestrates the import of wedding dates and client data
 */

import importWeddingDates from './importWeddingDates';
import importClientData from './importClientData';
import fs from 'fs';
import path from 'path';

// Path to the import data directory
const IMPORT_DATA_PATH = '/Users/bigmo/Desktop/HarielXavierActive/Import Data';

// Result interfaces
interface ImportResult {
  success: boolean;
  message: string;
  [key: string]: any;
}

// Function to check if the import data directory exists
function checkImportDataDirectory(): boolean {
  if (!fs.existsSync(IMPORT_DATA_PATH)) {
    throw new Error(`Import data directory not found: ${IMPORT_DATA_PATH}`);
  }
  
  console.log('Import data directory found!');
  
  // Check if Studio Ninja export folder exists
  const studioNinjaPath = path.join(IMPORT_DATA_PATH, 'Studio Ninja Leads Export [15 Feb 2025 0308PM]');
  if (!fs.existsSync(studioNinjaPath)) {
    throw new Error(`Studio Ninja export folder not found: ${studioNinjaPath}`);
  }
  
  console.log('Studio Ninja export folder found!');
  return true;
}

// Function to import all data
async function importAllData(): Promise<ImportResult> {
  try {
    console.log('Starting full data import process...');
    
    // Check if import data directory exists
    checkImportDataDirectory();
    
    // Import wedding dates
    console.log('\n=== IMPORTING WEDDING DATES ===');
    const weddingDatesResult = await importWeddingDates();
    console.log(`Wedding dates import result: ${weddingDatesResult.message}`);
    
    // Import client data
    console.log('\n=== IMPORTING CLIENT DATA ===');
    const clientDataResult = await importClientData();
    console.log(`Client data import result: ${clientDataResult.message}`);
    
    // Return combined results
    return {
      success: weddingDatesResult.success && clientDataResult.success,
      weddingDates: weddingDatesResult,
      clientData: clientDataResult,
      message: `Import completed. Wedding dates: ${weddingDatesResult.message}. Client data: ${clientDataResult.message}`
    };
  } catch (error: any) {
    console.error('Error during full data import:', error);
    return { success: false, message: error.message };
  }
}

// Export the function for use in other files
export default importAllData;

// If this script is run directly, execute the import
if (require.main === module) {
  importAllData()
    .then(result => {
      console.log('\n=== IMPORT SUMMARY ===');
      console.log(result.message);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unhandled error during import:', error);
      process.exit(1);
    });
}
