import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";

// Fixtures are entered manually through the admin dashboard — there is no
// external football data source. This route just reads/writes the
// Firestore "fixtures" collection.

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "fixtures"));
    const fixtures = snapshot.docs.map((docSnap) => {
      const d = docSnap.data() as any;
      return {
        fixture: {
          id: docSnap.id,
          date: d.matchDate,
          venue: d.venue || null,
          referee: d.referee || null,
          status: d.status || null,
          elapsed: d.elapsed ?? null,
        },
        teams: {
          home: { name: d.homeTeam, logo: d.homeLogo || "", id: d.homeTeamId ?? null },
          away: { name: d.awayTeam, logo: d.awayLogo || "", id: d.awayTeamId ?? null },
        },
        league: {
          id: d.leagueId ?? null,
          name: d.league || null,
          season: d.season ?? null,
        },
        goals: { home: d.goalsHome ?? null, away: d.goalsAway ?? null },
      };
    });
    fixtures.sort(
      (a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
    );
    return NextResponse.json(fixtures);
  } catch (error) {
    console.error("Failed to fetch fixtures:", error);
    return NextResponse.json(
      { error: "Failed to fetch fixtures" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { homeTeam, awayTeam, homeLogo, awayLogo, league, matchDate, venue, referee } = body;

    if (!homeTeam || !awayTeam || !matchDate) {
      return NextResponse.json(
        { error: "homeTeam, awayTeam and matchDate are required" },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "fixtures"), {
      homeTeam,
      awayTeam,
      homeLogo: homeLogo || "",
      awayLogo: awayLogo || "",
      league: league || "",
      matchDate,
      venue: venue || "",
      referee: referee || "",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Failed to create fixture:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
