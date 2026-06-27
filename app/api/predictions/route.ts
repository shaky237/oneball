import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "predictions"));
    const predictions: Record<string, unknown> = {};
    snapshot.forEach((docSnap) => {
      predictions[docSnap.id] = docSnap.data();
    });
    return NextResponse.json(predictions);
  } catch (error) {
    console.error("Failed to fetch predictions:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
