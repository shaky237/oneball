import { NextResponse } from "next/server";
import { getFixtures } from "@/lib/football";

export async function GET() {
  try {
    const fixtures = await getFixtures();
    return NextResponse.json(fixtures);
  } catch (error) {
    console.error("Failed to fetch fixtures:", error);
    return NextResponse.json(
      { error: "Failed to fetch fixtures" },
      { status: 500 }
    );
  }
}
