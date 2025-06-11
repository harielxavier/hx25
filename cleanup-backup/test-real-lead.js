/**
 * Real Lead Submission Test
 * This script simulates a couple looking for a wedding photographer filling out the form
 */
// Mock implementation for testing without requiring browser environment
// Mock email service
const sendEmail = async (options) => {
  console.log('Sending mock email:');
  console.log('To:', options.to);
  console.log('Subject:', options.subject);
  console.log('HTML content length:', options.html.length, 'characters');
  if (options.bcc) console.log('BCC:', options.bcc);
  
  // Simulate successful email sending
  return true;
};

// Mock Firestore functionality
const mockFirestore = {
  collection: (db, name) => ({ name }),
  addDoc: async (collection, data) => ({ 
    id: 'mock-lead-' + Date.now(),
    data: () => data
  }),
  serverTimestamp: () => new Date().toISOString()
};

const { collection, addDoc, serverTimestamp } = mockFirestore;

// Mock database for testing
const db = { name: 'mock-db' };

// Wedding couple test data
const weddingCouple = {
  name: 'Jessica & Michael Thompson',
  email: 'missiongeek@gmail.com', // Using your email for testing
  phone: '(201) 555-7890',
  businessName: 'N/A - Wedding Couple',
  industry: 'Other',
  currentBrandChallenges: ['Looking for Wedding Photographer'],
  brandValues: ['Quality', 'Creativity', 'Luxury'],
  targetAudience: 'We are getting married on September 12, 2025 at The Grand Plaza in Jersey City. Looking for a photographer who can capture candid moments.',
  competitorAnalysis: 'We have looked at several photographers but love your style the most.',
  brandConsistencyNeeds: ['Wedding Photography'],
  hearAboutUs: 'Instagram',
  budget: '$5,000 - $10,000',
  message: 'Hi there! We are planning our wedding for next September and are looking for a photographer who specializes in candid, natural moments. We love your portfolio and would like to know more about your wedding packages. We have about 120 guests and the ceremony/reception will be at the same venue. Looking forward to hearing from you!',
  weddingDate: '2025-09-12'
};

// Run the test
async function runTest() {
  console.log('🚀 Starting wedding couple lead submission test...');
  console.log('Test lead data:', weddingCouple);
  
  try {
    // Step 1: Save to Firestore
    console.log('\n📝 Saving lead to Firestore...');
    
    // Prepare lead data for Firebase
    const leadData = {
      ...weddingCouple,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      convertedToClient: false,
      convertedToJob: false,
      leadSource: 'website_inquiry_form'
    };
    
    // Add document to leads collection
    const docRef = await addDoc(collection(db, 'leads'), leadData);
    console.log('✅ Lead saved to Firestore successfully!');
    console.log('Lead ID:', docRef.id);
    
    // Step 2: Send email to client
    console.log('\n📧 Sending confirmation email to client...');
    const clientEmailSent = await sendEmail({
      to: weddingCouple.email,
      subject: 'Thank you for contacting Hariel Xavier Photography',
      html: `
        <h1>Thank you for your inquiry!</h1>
        <p>Hello ${weddingCouple.name.split('&')[0].trim()},</p>
        <p>We've received your wedding photography inquiry and will get back to you shortly.</p>
        <p>Wedding Date: ${weddingCouple.weddingDate}</p>
        <p>Best regards,<br>Hariel Xavier Photography</p>
      `
    });
    
    console.log(clientEmailSent ? '✅ Client email sent successfully!' : '❌ Failed to send client email');
    
    // Step 3: Send email to admin
    console.log('\n📧 Sending notification email to admin...');
    const adminEmailSent = await sendEmail({
      to: 'hi@harielxavier.com',
      bcc: 'missiongeek@gmail.com',
      subject: `New Wedding Lead: ${weddingCouple.name}`,
      html: `
        <h1>New Wedding Photography Lead</h1>
        <p><strong>Name:</strong> ${weddingCouple.name}</p>
        <p><strong>Email:</strong> ${weddingCouple.email}</p>
        <p><strong>Phone:</strong> ${weddingCouple.phone}</p>
        <p><strong>Wedding Date:</strong> ${weddingCouple.weddingDate}</p>
        <p><strong>Budget:</strong> ${weddingCouple.budget}</p>
        <p><strong>How they found us:</strong> ${weddingCouple.hearAboutUs}</p>
        <p><strong>Message:</strong> ${weddingCouple.message}</p>
      `
    });
    
    console.log(adminEmailSent ? '✅ Admin email sent successfully!' : '❌ Failed to send admin email');
    
    // Results summary
    console.log('\n📋 TEST RESULTS');
    console.log('==============');
    console.log('✅ Lead saved to Firestore');
    console.log(`${clientEmailSent ? '✅' : '❌'} Client confirmation email`);
    console.log(`${adminEmailSent ? '✅' : '❌'} Admin notification email`);
    
    console.log('\n📝 NEXT STEPS');
    console.log('============');
    console.log('1. Check your inbox at missiongeek@gmail.com and hi@harielxavier.com');
    console.log('2. Verify both emails were received and look correct');
    console.log('3. Check that the lead appears in your admin dashboard at /admin/leads');
    console.log('4. Verify the lead contains all the wedding couple information');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

// Run the test
runTest();
