import { NextRequest, NextResponse } from "next/server";
import {
  getFixtureStatus,
  getFixtureEvents,
  getFixtureLineups,
  getFixtureStatistics,
  getHeadToHead,
  getTeamRecentFixtures,
  getTeamSquad,
  getTeamStatistics,
} from "@/lib/football";

type Section = "form" | "h2h" | "stats" | "players" | "lineups" | "status" | "live";

async function getStatsForTeam(
  fixtureStats: any[] | null,
  teamId: number,
  leagueId: number | null,
  season: number | null
) {
  const fixtureTeamStats = fixtureStats?.find((s) => s.team?.id === teamId);
  if (fixtureTeamStats) {
    return { source: "fixture" as const, statistics: fixtureTeamStats.statistics };
  }

  // Pre-match: no fixture-level stats yet, fall back to season aggregates
  // (goals/clean sheets/cards only — shots/possession/corners/pass accuracy
  // simply aren't available before kickoff, so they're omitted here).
  if (leagueId && season) {
    const seasonStats = await getTeamStatistics(leagueId, season, teamId);
    if (seasonStats?.response) {
      return { source: "season" as const, statistics: seasonStats.response };
    }
  }

  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  const { fixtureId } = await params;
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section") as Section | null;
  const homeTeamId = searchParams.get("homeTeamId");
  const awayTeamId = searchParams.get("awayTeamId");
  const leagueId = searchParams.get("leagueId");
  const season = searchParams.get("season");

  if (!section) {
    return NextResponse.json({ data: null }, { status: 400 });
  }

  try {
    switch (section) {
      case "status": {
        const data = await getFixtureStatus(fixtureId);
        return NextResponse.json({ data });
      }

      case "live": {
        const [status, events, statistics] = await Promise.all([
          getFixtureStatus(fixtureId),
          getFixtureEvents(fixtureId),
          getFixtureStatistics(fixtureId),
        ]);
        return NextResponse.json({ data: { status, events, statistics } });
      }

      case "form": {
        if (!homeTeamId || !awayTeamId) {
          return NextResponse.json({ data: null });
        }
        const [home, away] = await Promise.all([
          getTeamRecentFixtures(homeTeamId),
          getTeamRecentFixtures(awayTeamId),
        ]);
        return NextResponse.json({ data: { home, away } });
      }

      case "h2h": {
        if (!homeTeamId || !awayTeamId) {
          return NextResponse.json({ data: null });
        }
        const data = await getHeadToHead(homeTeamId, awayTeamId);
        return NextResponse.json({ data });
      }

      case "stats": {
        if (!homeTeamId || !awayTeamId) {
          return NextResponse.json({ data: null });
        }
        const fixtureStats = await getFixtureStatistics(fixtureId);
        const leagueIdNum = leagueId ? Number(leagueId) : null;
        const seasonNum = season ? Number(season) : null;
        const [home, away] = await Promise.all([
          getStatsForTeam(fixtureStats, Number(homeTeamId), leagueIdNum, seasonNum),
          getStatsForTeam(fixtureStats, Number(awayTeamId), leagueIdNum, seasonNum),
        ]);
        return NextResponse.json({ data: { home, away } });
      }

      case "players": {
        if (!homeTeamId || !awayTeamId) {
          return NextResponse.json({ data: null });
        }
        const [home, away] = await Promise.all([
          getTeamSquad(homeTeamId),
          getTeamSquad(awayTeamId),
        ]);
        return NextResponse.json({ data: { home, away } });
      }

      case "lineups": {
        const data = await getFixtureLineups(fixtureId);
        return NextResponse.json({ data });
      }

      default:
        return NextResponse.json({ data: null }, { status: 400 });
    }
  } catch (error) {
    console.error(`match-info section "${section}" failed for fixture ${fixtureId}:`, error);
    return NextResponse.json({ data: null });
  }
}
