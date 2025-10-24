import { google } from "googleapis";

export async function GET() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
    });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    const response = await youtube.channels.list({
      mine: true,
      part: ["snippet", "contentDetails", "statistics"],
    });

    return new Response(JSON.stringify(response.data, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("YouTube API error:", error?.errors || error);
    return new Response(JSON.stringify(error, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
