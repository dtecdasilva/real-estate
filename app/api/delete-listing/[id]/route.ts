import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(
  req: Request,
  context: any // 👈 fixes the typing issue
) {
  try {
    const id = context.params.id;
    await deleteDoc(doc(db, "listings", id));
    return new Response(JSON.stringify({ message: "Listing deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return new Response(JSON.stringify({ error: "Failed to delete listing" }), {
      status: 500,
    });
  }
}
