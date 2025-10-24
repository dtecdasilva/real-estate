import { google } from "googleapis";

export const POST = async (req: Request) => {
  try {
    // Parse FormData from the request
    const formData = await req.formData();
    const fileInput = formData.get("file");

    if (!(fileInput instanceof File)) {
      return new Response("No valid video file selected", { status: 400 });
    }

    const file: File = fileInput;

    // OAuth2 client setup
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
    });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    // Upload video to YouTube
    const res = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: "Property Video #Shorts",       // You can replace with dynamic title
          description: "Check out this property! #Shorts", // Dynamic description
          tags: ["real estate", "Cameroon", "Shorts"]
        },
        status: {
          privacyStatus: "public"
        }
      },
      media: {
        body: file.stream() // streaming works in Vercel serverless
      }
    });

    const videoId = res.data.id;
    const videoLink = `https://youtube.com/shorts/${videoId}`;

    return new Response(JSON.stringify({ videoLink }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: unknown) {
    // Detailed logging for debugging
    if (error instanceof Error) {
      console.error("Upload error:", error.message);
    } else if (typeof error === "object" && error !== null) {
      console.error("Upload error:", error);
    } else {
      console.error("Unknown upload error:", error);
    }

    return new Response("Failed to upload video", { status: 500 });
  }
};
