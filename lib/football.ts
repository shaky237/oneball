import { FINISHED_STATUSES } from "./liveStatus";

const API_KEY = process.env.API_FOOTBALL_KEY;
const API_BASE = "https://v3.football.api-sports.io";

// Shared fetch helper for the Match Info endpoints below. Unlike the
// no-store fetches used by getFixtures() etc., these use Next's Data Cache
// (`next: { revalidate }`) so concurrent users share one upstream request
// per URL within the revalidate window instead of each hitting api-sports.io
// directly — the rate limit on this API key is limited. Never throws: on
// any failure it returns null so callers can hide that section gracefully
// instead of surfacing an error to the user.
async function apiFootballGet(path: string, revalidateSeconds = 30) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "x-apisports-key": API_KEY || "" },
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`api-football request failed for ${path}:`, error);
    return null;
  }
}

// Club leagues shown in the "Browse by League" section
const CLUB_LEAGUE_IDS = new Set([
  2,   // UEFA Champions League
  39,  // Premier League
  61,  // Ligue 1
  78,  // Bundesliga
  135, // Serie A
  140, // La Liga
  307, // Saudi Pro League
]);

const WC_LEAGUE_ID = 1;
const WC_SEASON = 2026;

// Lagos has no DST, so it's always a fixed UTC+1 offset.
const WAT_TIMEZONE = "Africa/Lagos";
const WAT_UTC_OFFSET = "+01:00";

// How many days ahead of today to include (0 = today only, 2 = today + next 2 days)
const WINDOW_DAYS = 2;

// Returns "YYYY-MM-DD" for `offsetDays` from today, in WAT
function getWATDateString(offsetDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: WAT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function isWithinWindow(fixture: any, windowStart: Date, windowEnd: Date): boolean {
  const kickoff = new Date(fixture.fixture.date);
  return kickoff >= windowStart && kickoff <= windowEnd;
}

function isUnfinished(fixture: any): boolean {
  return !FINISHED_STATUSES.has(fixture.fixture?.status?.short);
}

export async function getFixtures() {
  const headers = { "x-apisports-key": API_KEY || "" };
  const opts = { headers, cache: "no-store" as const };

  // The 3 calendar dates (WAT) to cover: today, today+1, today+2
  const dateStrings = Array.from({ length: WINDOW_DAYS + 1 }, (_, i) =>
    getWATDateString(i)
  );
  const windowStart = new Date(`${dateStrings[0]}T00:00:00${WAT_UTC_OFFSET}`);
  const windowEnd = new Date(
    `${dateStrings[dateStrings.length - 1]}T23:59:59${WAT_UTC_OFFSET}`
  );

  try {
    // Parallel: club leagues for each date in the window + all World Cup fixtures this season
    const [clubResponses, wcRes] = await Promise.all([
      Promise.all(
        dateStrings.map((date) =>
          fetch(
            `https://v3.football.api-sports.io/fixtures?date=${date}&timezone=${WAT_TIMEZONE}`,
            opts
          )
        )
      ),
      fetch(
        `https://v3.football.api-sports.io/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}&timezone=${WAT_TIMEZONE}`,
        opts
      ),
    ]);

    const clubDataList = await Promise.all(
      clubResponses.map((res, i) => {
        if (!res.ok) {
          console.log(`Club fixtures request failed for ${dateStrings[i]}: ${res.status}`);
          return Promise.resolve({ response: [] });
        }
        return res.json();
      })
    );

    if (!wcRes.ok) console.log(`World Cup request failed: ${wcRes.status}`);
    const wcData = wcRes.ok ? await wcRes.json() : { response: [] };

    // Club leagues: only the allowed leagues, deduped in case a date range overlaps
    const clubFixturesById = new Map<number, any>();
    for (const data of clubDataList) {
      for (const f of data.response || []) {
        if (CLUB_LEAGUE_IDS.has(f.league.id)) {
          clubFixturesById.set(f.fixture.id, f);
        }
      }
    }

    const allFixtures = [...clubFixturesById.values(), ...(wcData.response || [])];

    // Keep only fixtures within the next-2-days window that haven't already finished
    const fixtures = allFixtures
      .filter((f: any) => isWithinWindow(f, windowStart, windowEnd) && isUnfinished(f))
      .sort(
        (a: any, b: any) =>
          new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
      );

    console.log(
      `Fixtures loaded — window ${dateStrings[0]}..${dateStrings[dateStrings.length - 1]}: ${fixtures.length}`
    );

    return fixtures;
  } catch (error) {
    console.error("Error loading fixtures:", error);
    return [];
  }
}

export async function getStandings(
  league: number,
  season: number
) {
  const response = await fetch(
    `https://v3.football.api-sports.io/standings?league=${league}&season=${season}`,
    {
      headers: {
        "x-apisports-key": API_KEY || "",
      },
      cache: "no-store",
    }
  );

  return response.json();
}

export async function getPredictions(
  fixture: number
) {
  const response = await fetch(
    `https://v3.football.api-sports.io/predictions?fixture=${fixture}`,
    {
      headers: {
        "x-apisports-key": API_KEY || "",
      },
      cache: "no-store",
    }
  );

  return response.json();
}

export async function getTopScorers(
  league: number,
  season: number
) {
  const response = await fetch(
    `https://v3.football.api-sports.io/players/topscorers?league=${league}&season=${season}`,
    {
      headers: {
        "x-apisports-key": API_KEY || "",
      },
      cache: "no-store",
    }
  );

  return response.json();
}

export async function getTopAssists(
  league: number,
  season: number
) {
  const response = await fetch(
    `https://v3.football.api-sports.io/players/topassists?league=${league}&season=${season}`,
    {
      headers: {
        "x-apisports-key": API_KEY || "",
      },
      cache: "no-store",
    }
  );

  return response.json();
}

export async function getTeamStatistics(
  league: number,
  season: number,
  team: number
) {
  const response = await fetch(
    `https://v3.football.api-sports.io/teams/statistics?league=${league}&season=${season}&team=${team}`,
    {
      headers: {
        "x-apisports-key": API_KEY || "",
      },
      cache: "no-store",
    }
  );

  return response.json();
}

// --- Match Info endpoints (fetched only when a user opens the Match Info modal) ---

// Single-fixture lookup, used for the lightweight live-score poll.
export async function getFixtureStatus(fixtureId: number | string) {
  const data = await apiFootballGet(`/fixtures?id=${fixtureId}`, 15);
  return data?.response?.[0] || null;
}

export async function getFixtureEvents(fixtureId: number | string) {
  const data = await apiFootballGet(`/fixtures/events?fixture=${fixtureId}`, 15);
  return data?.response || null;
}

export async function getFixtureLineups(fixtureId: number | string) {
  const data = await apiFootballGet(`/fixtures/lineups?fixture=${fixtureId}`, 60);
  return data?.response?.length ? data.response : null;
}

// Per-match shots/possession/corners/cards/pass accuracy. Empty until the
// fixture has kicked off — that's real API-Football behavior, not a bug.
export async function getFixtureStatistics(fixtureId: number | string) {
  const data = await apiFootballGet(`/fixtures/statistics?fixture=${fixtureId}`, 15);
  return data?.response?.length ? data.response : null;
}

export async function getHeadToHead(
  homeTeamId: number | string,
  awayTeamId: number | string,
  last = 5
) {
  const data = await apiFootballGet(
    `/fixtures/headtohead?h2h=${homeTeamId}-${awayTeamId}&last=${last}`,
    300
  );
  return data?.response || null;
}

export async function getTeamRecentFixtures(teamId: number | string, last = 5) {
  const data = await apiFootballGet(`/fixtures?team=${teamId}&last=${last}`, 300);
  return data?.response || null;
}

// Name/age/number/position/photo — this endpoint has no nationality field.
export async function getTeamSquad(teamId: number | string) {
  const data = await apiFootballGet(`/players/squads?team=${teamId}`, 300);
  return data?.response?.[0] || null;
}