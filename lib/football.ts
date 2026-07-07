const API_KEY = process.env.API_FOOTBALL_KEY;

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

// Fixture statuses that mean the match has already been played
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN", "AWD", "WO"]);

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