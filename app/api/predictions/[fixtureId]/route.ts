import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  try {
    const { fixtureId } = await params;
    const body = await req.json();

    const { homePercent, drawPercent, awayPercent, advice } = body;

    await setDoc(doc(db, "predictions", fixtureId), {
      homePercent: homePercent ?? "",
      drawPercent: drawPercent ?? "",
      awayPercent: awayPercent ?? "",
      advice: advice ?? "",
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save prediction:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
