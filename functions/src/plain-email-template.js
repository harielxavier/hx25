/**
 * Creates a plain thank you email template for client inquiries
 * @param name Client's name
 * @param email Client's email address
 * @param eventType Type of event (wedding, portrait, etc.)
 * @param eventDate Date of the event if provided
 * @param isDateAvailable Boolean indicating if the requested date is available
 * @returns HTML email template
 */
export const createPlainThankYouEmailTemplate = (name, email, eventType = 'wedding', eventDate, isDateAvailable) => {
    // Format the event type for display
    const formattedEventTypeDisplay = eventType === 'other' ?
        'Photography Services' :
        eventType.charAt(0).toUpperCase() + eventType.slice(1) + ' Photography';
    // Determine availability message
    let availabilityMessage = '';
    if (eventDate && isDateAvailable !== undefined) {
        if (isDateAvailable) {
            availabilityMessage = `I'm currently available for your wedding on ${eventDate}, and I'd love to learn more about what you're envisioning.`;
        }
        else {
            availabilityMessage = `I'm currently booked on ${eventDate}. I'd love to recommend some talented photographer colleagues who might be available. Alternatively, if your date is flexible, let me know and we can check other dates.`;
        }
    }
    else {
        availabilityMessage = "I'd love to learn more about what you're envisioning for your wedding day.";
    }
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Inquiry | Hariel Xavier Photography</title>
    </head>
    <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; color: #333333; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://harielxavier.com/MoStuff/black.png" alt="Hariel Xavier Photography" width="200" style="max-width: 100%;">
        </div>
        
        <p style="margin-bottom: 15px;">Hi ${name.split(' ')[0]},</p>
        
        <p style="margin-bottom: 15px;">Congratulations on your engagement — and thank you for reaching out to Hariel Xavier Photography. This is such an incredible chapter in your lives, and I'm truly honored to be considered as the one to document it.</p>
        
        <p style="margin-bottom: 15px;">What I love most about this work is getting to know each couple and telling their story in a way that feels real, emotional, and true to who they are. Your wedding isn't just a day — it's a collection of moments, glances, laughter, and love that deserves to be remembered exactly as it felt.</p>
        
        <p style="margin-bottom: 15px;">${availabilityMessage} What parts of the day are you most excited about? What do you want your photos to remind you of years from now?</p>
        
        <p style="margin-bottom: 15px;">Attached, you'll find my wedding collections and pricing to help you get started. You can also take a look at some recent stories I've had the honor of capturing on <a href="https://www.instagram.com/harielxaviermedia/" style="color: #000000; text-decoration: underline;">Instagram</a>.</p>
        
        <p style="margin-bottom: 25px;">Feel free to reply with any questions — I'd love to hear from you and connect further.</p>
        
        <p style="margin-bottom: 5px;">Warmly,</p>
        <p style="margin-bottom: 5px;">Mauricio Fernandez</p>
        <p style="margin-bottom: 5px;">Hariel Xavier Photography</p>
        <p style="margin-bottom: 5px;">Phone: (862) 355-3502</p>
        <p style="margin-bottom: 5px;">Email: Hi@HarielXavier.com</p>
        <p style="margin-bottom: 25px;">Instagram: @harielxaviermedia</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #999999;">
          <p>© ${new Date().getFullYear()} Hariel Xavier Photography. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
