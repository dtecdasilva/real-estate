import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

interface RouteParams {
  params: { id: string };
}

export async function DELETE(
  _request: Request,
  context: RouteParams
) {
  try {
    const { id } = context.params;
    const ref = doc(db, "listings", id);
    await deleteDoc(ref);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}
