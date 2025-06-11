// Script to build the Firebase Cloud Functions
import { exec } from 'child_process';

function buildFunctions() {
  console.log('Building Firebase Cloud Functions...');
  
  // Change to the functions directory and run the build command
  exec('cd functions && npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error building functions: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`Build stderr: ${stderr}`);
    }
    
    console.log(stdout);
    console.log('Firebase Cloud Functions built successfully!');
  });
}

buildFunctions();
