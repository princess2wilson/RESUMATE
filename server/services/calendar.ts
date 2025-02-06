import { google } from 'googleapis';
import { format } from 'date-fns';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'  // Using playground for simplicity
);

// Set credentials
oauth2Client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export async function createConsultationEvent(consultation: {
  date: string;
  time: string;
  email: string;
  name: string;
}) {
  const { date, time, email, name } = consultation;
  const startTime = new Date(`${date}T${time}`);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration

  const event = {
    summary: 'Career Consultation Session',
    description: `Career consultation session with ${name}`,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'UTC',
    },
    attendees: [{ email }],
    conferenceData: {
      createRequest: {
        requestId: `consultation-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
      conferenceDataVersion: 1,
    });

    return {
      eventId: response.data.id,
      meetLink: response.data.hangoutLink,
      start: startTime,
      end: endTime,
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Failed to schedule consultation');
  }
}
