// Script to compile the TypeScript template to JavaScript
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

async function compileTemplate() {
  try {
    console.log('Compiling TypeScript template to JavaScript...');
    
    // Create a temporary tsconfig.json file for this compilation
    const tsConfig = {
      compilerOptions: {
        target: "es2020",
        module: "es2020",
        moduleResolution: "node",
        esModuleInterop: true,
        outDir: "./functions/lib",
        strict: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true
      },
      include: ["functions/src/plain-email-template.ts"]
    };
    
    // Write the tsconfig.json file
    await fs.writeFile('temp-tsconfig.json', JSON.stringify(tsConfig, null, 2));
    
    // Run the TypeScript compiler
    exec('npx tsc --project temp-tsconfig.json', async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error compiling TypeScript: ${error.message}`);
        return;
      }
      
      if (stderr) {
        console.error(`TypeScript compiler stderr: ${stderr}`);
      }
      
      console.log('TypeScript compilation successful!');
      
      // Clean up the temporary tsconfig.json file
      await fs.unlink('temp-tsconfig.json');
      
      // Copy the compiled JS file to the root directory for easier importing
      const source = path.join('functions', 'lib', 'plain-email-template.js');
      const destination = path.join('functions', 'src', 'plain-email-template.js');
      
      try {
        const fileContent = await fs.readFile(source, 'utf8');
        await fs.writeFile(destination, fileContent);
        console.log(`Copied compiled JS file to ${destination}`);
      } catch (copyError) {
        console.error(`Error copying compiled JS file: ${copyError.message}`);
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

compileTemplate();
