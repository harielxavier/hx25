/**
 * Lead Submission Test
 * This script tests the actual lead recording process and email sending
 */
import { recordLead, getLeads } from './src/lib/api/leads.js';

// Test lead data
const testLead = {
  name: 'Test Client',
  email: 'missiongeek@gmail.com', // Using your email for testing
  phone: '555-987-6543',
  weddingDate: '2025-09-15',
  message: 'This is a test lead submission to verify the system is working correctly. Please ignore this test lead.',
  source: 'website_contact_form',
  status: 'new'
};

// Run the test
async function runTest() {
  console.log('🚀 Starting lead submission test...');
  console.log('Test lead data:', testLead);
  
  try {
    // Record the lead (this will also trigger emails)
    console.log('\n📝 Recording lead...');
    const recordedLead = await recordLead(testLead);
    console.log('✅ Lead recorded successfully!');
    console.log('Lead ID:', recordedLead.id);
    console.log('Created at:', new Date(recordedLead.createdAt).toLocaleString());
    
    if (recordedLead.emailStatus) {
      console.log('\n📧 Email status:');
      console.log('- Admin notification:', recordedLead.emailStatus.adminNotificationSent ? '✅ Sent' : '❌ Failed');
      console.log('- Lead autoresponse:', recordedLead.emailStatus.autoresponseSent ? '✅ Sent' : '❌ Failed');
      console.log('- Sent at:', new Date(recordedLead.emailStatus.sentAt).toLocaleString());
    } else {
      console.log('\n⚠️ Email status not tracked in lead object');
    }
    
    // Verify the lead was stored in the system
    console.log('\n🔍 Verifying lead storage...');
    const allLeads = await getLeads();
    
    if (allLeads.length > 0) {
      console.log(`✅ Found ${allLeads.length} leads in the system`);
      
      // Find our test lead
      const foundLead = allLeads.find(lead => lead.id === recordedLead.id);
      if (foundLead) {
        console.log('✅ Test lead found in the system!');
      } else {
        console.log('❌ Test lead not found in the system');
      }
    } else {
      console.log('❌ No leads found in the system');
    }
    
    console.log('\n📋 TEST RESULTS');
    console.log('==============');
    console.log('✅ Lead recording: Successful');
    if (recordedLead.emailStatus) {
      console.log(`${recordedLead.emailStatus.adminNotificationSent ? '✅' : '❌'} Admin notification email`);
      console.log(`${recordedLead.emailStatus.autoresponseSent ? '✅' : '❌'} Lead autoresponse email`);
    }
    console.log(`${allLeads.length > 0 ? '✅' : '❌'} Lead storage`);
    
    console.log('\n📝 NEXT STEPS');
    console.log('============');
    console.log('1. Check your inbox at missiongeek@gmail.com and hi@harielxavier.com');
    console.log('2. Verify both emails were received and look correct');
    console.log('3. Check that the lead appears in your admin dashboard');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

// Run the test
runTest();
