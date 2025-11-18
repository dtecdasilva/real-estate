import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, whatsapp } = await req.json();

    await resend.emails.send({
      from: "Verification Bot <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL as string,
      subject: "New Verification Request",
      html: `
        <h2>New Agent Verification Request</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p>This person has requested verification.</p>
      `,
    });

    return NextResponse.json({ status: "success" });
    } catch (err: unknown) {
    console.error("Email error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error occurred" },
      { status: 500 }
    );
  }
}
