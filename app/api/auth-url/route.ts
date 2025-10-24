import { google } from "googleapis";

export async function GET() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI // e.g. https://shelterspace.vercel.app/api/callback
  );

  const scopes = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly"
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent", // ensures refresh_token is returned
  });

  return Response.redirect(authUrl);
}
