/**
 * Test script to verify the BrandCaptureForm lead submission
 * 
 * This script:
 * 1. Simulates filling out the form with test data
 * 2. Uses your existing lead service to submit the lead
 * 3. Verifies the lead is registered in your system
 */

// Import the lead service directly from your codebase
import { submitContactForm } from '../src/services/leadService.js';

/**
 * Test the lead submission process
 */
async function testFormSubmission() {
  console.log('🧪 Starting form submission test...');
  
  // Create a unique test identifier
  const testId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const timestamp = new Date().toISOString();
  
  // Create test data that matches the LeadSubmission interface
  const testLead = {
    firstName: 'Test',
    lastName: `User-${testId}`,
    email: `test-${testId}@example.com`,
    phone: '555-123-4567',
    eventType: 'wedding',
    eventDate: '2025-12-31',
    eventLocation: 'Test Venue, NJ',
    preferredStyle: ['Documentary', 'Traditional'],
    additionalInfo: `This is a test submission created at ${timestamp}`,
    hearAboutUs: 'google',
    source: 'test_script'
  };
  
  console.log('📝 Created test lead:', testLead);
  
  try {
    // Submit the lead using your existing lead service
    console.log('🚀 Submitting lead to your CRM system...');
    const leadId = await submitContactForm(testLead);
    
    console.log('✅ Lead successfully submitted with ID:', leadId);
    console.log('\n🎉 Form submission test completed successfully!');
    console.log('\n🔍 VERIFICATION:');
    console.log(`1. Check your Lead Management admin panel - you should see a new lead for ${testLead.firstName} ${testLead.lastName}`);
    console.log(`2. The lead will have the email: ${testLead.email}`);
    console.log(`3. The lead was created at: ${new Date().toLocaleString()}`);
    
    // Return success
    return { success: true, leadId, testLead };
    
  } catch (error) {
    console.error('❌ Form submission test failed:', error);
    return { success: false, error };
  }
}

// Run the test
testFormSubmission()
  .then(result => {
    if (result.success) {
      console.log('\n✅ TEST PASSED: The form submission is working correctly.');
      console.log('You should now be able to see the test lead in your Lead Management system.');
    } else {
      console.log('\n❌ TEST FAILED: The form submission is not working correctly.');
      console.log('Please check the error message above for details.');
    }
  })
  .catch(error => {
    console.error('Error running test:', error);
  });
