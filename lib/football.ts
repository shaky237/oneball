const API_KEY = process.env.API_FOOTBALL_KEY;

// Club leagues that are fetched by the two-days-ahead date
const CLUB_LEAGUE_IDS = new Set([
  2,   // UEFA Champions League
  39,  // Premier League
  61,  // Ligue 1
  135, // Serie A
  140, // La Liga
  307, // Saudi Pro League
]);

const WC_LEAGUE_ID = 1;
const WC_SEASON = 2026;

// Returns "YYYY-MM-DD" for exactly two days from today (UTC)
function getTargetDate(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 2);
  return d.toISOString().split("T")[0];
}

export async function getFixtures() {
  const targetDate = getTargetDate();
  const now = new Date();

  const headers = { "x-apisports-key": API_KEY || "" };
  const opts = { headers, cache: "no-store" as const };

  try {
    // Parallel: club leagues for the target date + all World Cup fixtures this season
    const [clubRes, wcRes] = await Promise.all([
      fetch(
        `https://v3.football.api-sports.io/fixtures?date=${targetDate}`,
        opts
      ),
      fetch(
        `https://v3.football.api-sports.io/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}`,
        opts
      ),
    ]);

    if (!clubRes.ok) console.log(`Club fixtures request failed: ${clubRes.status}`);
    if (!wcRes.ok)   console.log(`World Cup request failed: ${wcRes.status}`);

    const [clubData, wcData] = await Promise.all([
      clubRes.ok ? clubRes.json() : Promise.resolve({ response: [] }),
      wcRes.ok  ? wcRes.json()   : Promise.resolve({ response: [] }),
    ]);

    // Club leagues: only the allowed leagues on the target date
    const clubFixtures = (clubData.response || []).filter(
      (f: any) => CLUB_LEAGUE_IDS.has(f.league.id)
    );

    // World Cup: every fixture that has not kicked off yet
    const wcFixtures = (wcData.response || []).filter(
      (f: any) => new Date(f.fixture.date) > now
    );

    const fixtures = [...clubFixtures, ...wcFixtures].sort(
      (a: any, b: any) =>
        new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
    );

    console.log(
      `Fixtures loaded — club (${targetDate}): ${clubFixtures.length}, ` +
      `World Cup upcoming: ${wcFixtures.length}`
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