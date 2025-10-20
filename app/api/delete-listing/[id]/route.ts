import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
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
