import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  try {
    const { fixtureId } = await params;
    await deleteDoc(doc(db, "fixtures", fixtureId));
    await deleteDoc(doc(db, "predictions", fixtureId)).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete fixture:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
