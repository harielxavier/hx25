// Simple script to test Firebase connections
import { runConnectionTests } from '../utils/firebaseConnectionTest.ts';

console.log('Starting Firebase connection tests...');
console.log('This will test both client-side and Admin SDK connections');
console.log('-----------------------------------------------------------');

try {
  await runConnectionTests();
  console.log('Tests completed!');
} catch (error) {
  console.error('Test script encountered an error:', error);
  process.exit(1);
}
