import { google } from 'googleapis';

export class CalendarIntegration {
  private googleAuth: any;

  constructor(credentials: {
    googleClientId: string;
    googleClientSecret: string;
    googleRedirectUri: string;
  }) {
    this.googleAuth = new google.auth.OAuth2(
      credentials.googleClientId,
      credentials.googleClientSecret,
      credentials.googleRedirectUri
    );
  }

  async syncGoogleCalendar(accessToken: string) {
    this.googleAuth.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: this.googleAuth });
    
    return calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });
  }

  async addEvent(accessToken: string, event: {
    summary: string;
    description?: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
    location?: string;
  }) {
    this.googleAuth.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: this.googleAuth });

    return calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
  }

  async getAvailability(accessToken: string, timeMin: string, timeMax: string) {
    this.googleAuth.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: this.googleAuth });

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        items: [{ id: 'primary' }],
      },
    });

    return response.data.calendars?.primary.busy || [];
  }
}