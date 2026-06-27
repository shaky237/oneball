import { NextResponse } from "next/server";
import { getAdminPayments } from "@/lib/firestorePayments";

export async function GET() {
  try {
    const allPayments = await getAdminPayments();
    return NextResponse.json(allPayments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}