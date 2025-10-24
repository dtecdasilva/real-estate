import { google } from "googleapis";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing code parameter", { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Get the token response
  const response = await oauth2Client.getToken(code);
  const tokens = response.tokens;

  if (!tokens.refresh_token) {
    return new Response(
      "❌ No refresh token returned. Try again and make sure you used prompt=consent in the auth URL route.",
      { status: 400 }
    );
  }

  console.log("TOKENS:", tokens);

  return new Response(
    `✅ Your refresh token is: ${tokens.refresh_token}\n\nSave this in your .env file as YOUTUBE_REFRESH_TOKEN.`,
    { status: 200 }
  );
}
