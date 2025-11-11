/**
 * Script to import client data from Studio Ninja export
 * This script extracts client information and creates a client database
 */

import fs from 'fs';
import path from 'path';
// REMOVED FIREBASE: import { collection, addDoc // REMOVED FIREBASE
// REMOVED FIREBASE: import { db } from '../firebase/config';

// Path to the import data directory
const IMPORT_DATA_PATH = '/Users/bigmo/Desktop/HarielXavierActive/Import Data/Studio Ninja Leads Export [15 Feb 2025 0308PM]';

// Client interface
interface Client {
  name: string;
  weddingDate: Date;
  importedFrom: string;
  importDate: Date;
  hasQuestionnaire?: boolean;
  questionnaireCount?: number;
  hasContract?: boolean;
  contractCount?: number;
  contractSigned?: boolean;
  hasQuote?: boolean;
  quoteCount?: number;
  packageName?: string;
  status: string;
}

// Function to extract client info from folder name
function extractClientInfo(folderName: string): { name: string; weddingDate: Date; folderName: string } | null {
  // Pattern: DD MMM YYYY - Client Name
  const datePattern = /(\d{2}) ([A-Za-z]{3}) (\d{4}) - (.+)/;
  const match = folderName.match(datePattern);
  
  if (match) {
    const [_, day, month, year, clientName] = match;
    const monthMap: {[key: string]: number} = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    const weddingDate = new Date(parseInt(year), monthMap[month], parseInt(day));
    
    return {
      name: clientName,
      weddingDate,
      folderName
    };
  }
  
  return null;
}

// Function to parse questionnaire data
function parseQuestionnaire(clientFolder: string): { hasQuestionnaire: boolean; questionnaireCount?: number } {
  const questionnairePath = path.join(IMPORT_DATA_PATH, clientFolder, 'questionnaires');
  
  if (fs.existsSync(questionnairePath)) {
    const files = fs.readdirSync(questionnairePath);
    
    if (files.length > 0) {
      // In a real implementation, we would parse the questionnaire files
      // For now, we'll return a placeholder
      return {
        hasQuestionnaire: true,
        questionnaireCount: files.length
      };
    }
  }
  
  return { hasQuestionnaire: false };
}

// Function to parse contract data
function parseContract(clientFolder: string): { hasContract: boolean; contractCount?: number; contractSigned?: boolean } {
  const contractPath = path.join(IMPORT_DATA_PATH, clientFolder, 'contracts');
  
  if (fs.existsSync(contractPath)) {
    const files = fs.readdirSync(contractPath);
    
    if (files.length > 0) {
      // In a real implementation, we would parse the contract files
      // For now, we'll return a placeholder
      return {
        hasContract: true,
        contractCount: files.length,
        contractSigned: true
      };
    }
  }
  
  return { hasContract: false };
}

// Function to parse quote data
function parseQuote(clientFolder: string): { hasQuote: boolean; quoteCount?: number; packageName?: string } {
  const quotePath = path.join(IMPORT_DATA_PATH, clientFolder, 'quotes');
  
  if (fs.existsSync(quotePath)) {
    const files = fs.readdirSync(quotePath);
    
    if (files.length > 0) {
      // In a real implementation, we would parse the quote files
      // For now, we'll return a placeholder
      return {
        hasQuote: true,
        quoteCount: files.length,
        packageName: 'The Timeless' // Default package
      };
    }
  }
  
  return { hasQuote: false };
}

// Function to import client data
async function importClientData(): Promise<{ 
  success: boolean; 
  message: string;
  clients?: Client[];
}> {
  try {
    console.log('Starting client data import...');
    
    // Read the directory
    const folders = fs.readdirSync(IMPORT_DATA_PATH);
    
    // Process each client folder
    const clients: Client[] = [];
    
    for (const folder of folders) {
      const clientInfo = extractClientInfo(folder);
      
      if (clientInfo) {
        // Get additional data
        const questionnaireData = parseQuestionnaire(folder);
        const contractData = parseContract(folder);
        const quoteData = parseQuote(folder);
        
        // Create client object
        const client: Client = {
          name: clientInfo.name,
          weddingDate: clientInfo.weddingDate,
          importedFrom: 'Studio Ninja',
          importDate: new Date(),
          ...questionnaireData,
          ...contractData,
          ...quoteData,
          status: contractData.hasContract && contractData.contractSigned ? 'Booked' : 'Lead'
        };
        
        clients.push(client);
      }
    }
    
    console.log(`Found ${clients.length} clients to import`);
    
    // Save to Firebase
    const savedClients: (Client & { id: string })[] = [];
    
    for (const client of clients) {
      try {
        const docRef = await addDoc(collection(db, 'clients'), client);
        savedClients.push({ id: docRef.id, ...client });
        console.log(`Imported client: ${client.name}`);
      } catch (error: any) {
        console.error(`Error saving client ${client.name}:`, error);
      }
    }
    
    console.log('Client data import completed successfully!');
    return { 
      success: true, 
      message: `Imported ${savedClients.length} clients`,
      clients: savedClients
    };
  } catch (error: any) {
    console.error('Error importing client data:', error);
    return { success: false, message: error.message };
  }
}

// Export the function for use in other files
export default importClientData;

// If this script is run directly, execute the import
if (require.main === module) {
  importClientData()
    .then(result => {
      console.log(result.message);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}
