import { google } from "googleapis";

export const POST = async (req: Request) => {
  try {
    // Expecting a FormData with a video file
    const formData = await req.formData();
    const file = formData.get("file") as any; // File from the form

    if (!file) {
      return new Response("No video file provided", { status: 400 });
    }

    // Read video into buffer
    const videoBuffer = Buffer.from(await file.arrayBuffer());

    // OAuth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
    });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    // Upload video
    const res = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: "Property Video #Shorts",
          description: "Check out this property! #Shorts",
          tags: ["real estate", "Cameroon", "Shorts"]
        },
        status: {
          privacyStatus: "public"
        }
      },
      media: {
        body: videoBuffer
      }
    });

    const videoId = res.data.id;
    const videoLink = `https://youtube.com/shorts/${videoId}`;

    return new Response(JSON.stringify({ videoLink }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to upload video", { status: 500 });
  }
};
