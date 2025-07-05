import { google } from 'googleapis';
import * as fs from 'fs';

// Получи client_id, client_secret, refresh_token через Google Cloud Console (YouTube Data API v3)
const CLIENT_ID = process.env.YT_CLIENT_ID!;
const CLIENT_SECRET = process.env.YT_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.YT_REFRESH_TOKEN!;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob'
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

export async function uploadToYouTube(
  filePath: string,
  title: string,
  description: string,
  tags: string[] = []
): Promise<string> {
  const res = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: { title, description, tags },
      status: { privacyStatus: 'public' }
    },
    media: {
      body: fs.createReadStream(filePath)
    }
  });

  return res.data.id!;
}