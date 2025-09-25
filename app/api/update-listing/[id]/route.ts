import { NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // make sure you have firebase initialized

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();

    const listingRef = doc(db, "listings", id);
    await updateDoc(listingRef, body);

    return NextResponse.json({ success: true, id, ...body });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
