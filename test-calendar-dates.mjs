/**
 * Test script to fetch upcoming wedding dates from Google Calendar
 * This will show your real calendar data for the pricing page integration
 */

import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.windsurf' });

const API_KEY = process.env.VITE_GOOGLE_API_KEY;
const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;

console.log('🔍 Testing Google Calendar Integration...');
console.log('API Key:', API_KEY ? 'Present ✅' : 'Missing ❌');
console.log('Client ID:', CLIENT_ID ? 'Present ✅' : 'Missing ❌');

if (!API_KEY) {
  console.error('❌ Google API Key not found in environment variables');
  process.exit(1);
}

// Initialize Google Calendar API
const calendar = google.calendar({ version: 'v3', auth: API_KEY });

async function fetchUpcomingWeddingDates() {
  try {
    console.log('\n📅 Fetching upcoming events from your calendar...');
    
    // Get events for the next 12 months
    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);
    
    const response = await calendar.events.list({
      calendarId: 'primary', // Your primary calendar
      timeMin: now.toISOString(),
      timeMax: oneYearFromNow.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
      q: 'wedding OR elopement OR photography OR session' // Search for wedding-related events
    });

    const events = response.data.items || [];
    
    console.log(`\n📊 Found ${events.length} upcoming events`);
    
    if (events.length === 0) {
      console.log('\n💡 No events found. This could mean:');
      console.log('   - Your calendar is empty');
      console.log('   - The API key needs calendar access permissions');
      console.log('   - Events don\'t contain wedding-related keywords');
      
      // Let's try without search terms
      console.log('\n🔄 Trying to fetch all events...');
      
      const allEventsResponse = await calendar.events.list({
        calendarId: 'primary',
        timeMin: now.toISOString(),
        maxResults: 20,
        singleEvents: true,
        orderBy: 'startTime'
      });
      
      const allEvents = allEventsResponse.data.items || [];
      console.log(`📋 Found ${allEvents.length} total upcoming events`);
      
      if (allEvents.length > 0) {
        console.log('\n📅 Your upcoming events:');
        allEvents.slice(0, 10).forEach((event, index) => {
          const start = event.start?.dateTime || event.start?.date;
          const date = new Date(start).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          console.log(`   ${index + 1}. ${event.summary || 'Untitled'} - ${date}`);
        });
      }
      
      return allEvents;
    }
    
    // Analyze wedding-related events
    console.log('\n💒 Wedding-related events found:');
    
    const weddingEvents = [];
    const availableDates = [];
    
    events.forEach((event, index) => {
      const start = event.start?.dateTime || event.start?.date;
      const date = new Date(start);
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const isWedding = /wedding|bride|groom|ceremony|reception/i.test(event.summary || '');
      const isPhotography = /photo|shoot|session|engagement/i.test(event.summary || '');
      
      if (isWedding || isPhotography) {
        weddingEvents.push({
          date: formattedDate,
          title: event.summary || 'Untitled',
          type: isWedding ? 'Wedding' : 'Photography Session',
          location: event.location || 'Location TBD'
        });
        
        console.log(`   ${index + 1}. ${event.summary || 'Untitled'} - ${formattedDate}`);
        if (event.location) {
          console.log(`      📍 ${event.location}`);
        }
      }
    });
    
    // Calculate availability insights
    const totalWeekends = getWeekendsInNext12Months();
    const bookedWeekends = weddingEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDay() === 0 || eventDate.getDay() === 6; // Sunday or Saturday
    }).length;
    
    const availableWeekends = totalWeekends - bookedWeekends;
    const bookingPercentage = Math.round((bookedWeekends / totalWeekends) * 100);
    
    console.log('\n📈 BOOKING INSIGHTS FOR YOUR PRICING PAGE:');
    console.log(`   📅 Total weekends in next 12 months: ${totalWeekends}`);
    console.log(`   ✅ Booked weekends: ${bookedWeekends}`);
    console.log(`   🆓 Available weekends: ${availableWeekends}`);
    console.log(`   📊 Booking percentage: ${bookingPercentage}%`);
    
    // Generate scarcity messaging for pricing page
    console.log('\n🎯 SCARCITY MESSAGES FOR YOUR PRICING PAGE:');
    
    if (bookingPercentage > 80) {
      console.log(`   🔥 "Only ${availableWeekends} weekend dates left in 2025!"`);
      console.log(`   ⚡ "Calendar is ${bookingPercentage}% booked - secure your date now!"`);
    } else if (bookingPercentage > 60) {
      console.log(`   📈 "Calendar filling fast - ${bookingPercentage}% of weekends booked!"`);
      console.log(`   ⏰ "Only ${availableWeekends} prime weekend dates remaining!"`);
    } else {
      console.log(`   ✨ "Great availability - ${availableWeekends} weekend dates open!"`);
      console.log(`   📅 "Book now for best date selection!"`);
    }
    
    // Seasonal insights
    const seasonalBookings = analyzeSeasonalBookings(weddingEvents);
    console.log('\n🌸 SEASONAL BOOKING INSIGHTS:');
    Object.entries(seasonalBookings).forEach(([season, count]) => {
      console.log(`   ${getSeasonEmoji(season)} ${season}: ${count} bookings`);
    });
    
    // Next available dates
    console.log('\n📅 NEXT AVAILABLE WEEKEND DATES:');
    const nextAvailableDates = getNextAvailableWeekends(events, 5);
    nextAvailableDates.forEach((date, index) => {
      console.log(`   ${index + 1}. ${date}`);
    });
    
    return {
      totalEvents: events.length,
      weddingEvents,
      availableWeekends,
      bookedWeekends,
      bookingPercentage,
      nextAvailableDates,
      seasonalBookings
    };
    
  } catch (error) {
    console.error('❌ Error fetching calendar data:', error.message);
    
    if (error.message.includes('403')) {
      console.log('\n💡 This is likely a permissions issue. To fix:');
      console.log('   1. Go to Google Cloud Console');
      console.log('   2. Enable Google Calendar API');
      console.log('   3. Make sure your API key has calendar permissions');
      console.log('   4. Or use OAuth2 for full calendar access');
    }
    
    return null;
  }
}

function getWeekendsInNext12Months() {
  const now = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(now.getFullYear() + 1);
  
  let weekends = 0;
  const current = new Date(now);
  
  while (current <= oneYearFromNow) {
    if (current.getDay() === 0 || current.getDay() === 6) { // Sunday or Saturday
      weekends++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return weekends;
}

function analyzeSeasonalBookings(events) {
  const seasons = { Spring: 0, Summer: 0, Fall: 0, Winter: 0 };
  
  events.forEach(event => {
    const date = new Date(event.date);
    const month = date.getMonth() + 1; // 1-12
    
    if (month >= 3 && month <= 5) seasons.Spring++;
    else if (month >= 6 && month <= 8) seasons.Summer++;
    else if (month >= 9 && month <= 11) seasons.Fall++;
    else seasons.Winter++;
  });
  
  return seasons;
}

function getSeasonEmoji(season) {
  const emojis = { Spring: '🌸', Summer: '☀️', Fall: '🍂', Winter: '❄️' };
  return emojis[season] || '📅';
}

function getNextAvailableWeekends(bookedEvents, count = 5) {
  const availableDates = [];
  const now = new Date();
  const current = new Date(now);
  
  // Get list of booked dates
  const bookedDates = bookedEvents.map(event => {
    const date = new Date(event.start?.dateTime || event.start?.date);
    return date.toDateString();
  });
  
  while (availableDates.length < count) {
    // Check if it's a weekend (Saturday or Sunday)
    if (current.getDay() === 0 || current.getDay() === 6) {
      // Check if this date is not booked
      if (!bookedDates.includes(current.toDateString())) {
        availableDates.push(current.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }));
      }
    }
    current.setDate(current.getDate() + 1);
  }
  
  return availableDates;
}

// Run the test
fetchUpcomingWeddingDates()
  .then(result => {
    if (result) {
      console.log('\n✅ Calendar integration test completed successfully!');
      console.log('\n🚀 This data will power your pricing page with:');
      console.log('   📊 Real-time availability');
      console.log('   ⚡ Scarcity messaging');
      console.log('   📅 Instant date checking');
      console.log('   🤖 Sarah AI booking intelligence');
    }
  })
  .catch(error => {
    console.error('❌ Test failed:', error);
  });
