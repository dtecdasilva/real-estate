// app/api/flutterwave/redirect/route.ts

import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const flutterwaveRes = await fetch("https://api.flutterwave.cloud/developersandbox/charges", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY || ""}`, // fallback to avoid undefined
        "Content-Type": "application/json",
        "X-Trace-Id": uuidv4(), // generate a unique trace ID
        "X-Scenario-Key": "scenario:auth_redirect",
      },
      body: JSON.stringify(body),
    });

    const data = await flutterwaveRes.json();

    return new Response(JSON.stringify(data), {
      status: flutterwaveRes.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Flutterwave error:", error);

    return new Response(
      JSON.stringify({ error: "An error occurred while connecting to Flutterwave." }),
      { status: 500 }
    );
  }
}
