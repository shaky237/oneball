import { NextRequest, NextResponse } from "next/server";

// Match Info detail (form, head-to-head, statistics, players, lineups, live
// score) previously came from an external Football API. That integration
// has been removed and nothing replaces it, so every section reports "no
// data" — the UI already renders a graceful empty state for that case.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  if (!section) {
    return NextResponse.json({ data: null }, { status: 400 });
  }

  if (section === "live") {
    return NextResponse.json({ data: { status: null, events: null, statistics: null } });
  }

  return NextResponse.json({ data: null });
}
