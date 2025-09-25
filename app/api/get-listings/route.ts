import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const listingsCol = collection(db, "listings");
    const snapshot = await getDocs(listingsCol);
    const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(listings);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}
