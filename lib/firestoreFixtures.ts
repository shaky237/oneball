import { app } from "./firebase";
// Reads use the REST-based "lite" Firestore build instead of the default one.
// The default build resolves to a gRPC transport under Node/SSR, which can fail
// DNS resolution via a background channel outside this function's try/catch and
// crash the process. The lite build uses plain fetch, so failures always surface
// as a normal rejected promise here.
import { collection, getDocs, getFirestore } from "firebase/firestore/lite";

export type StoredPrediction = {
  homePercent: string;
  drawPercent: string;
  awayPercent: string;
  advice: string;
};

export type PredictionsResult = {
  predictions: Map<string, StoredPrediction>;
  firestoreAvailable: boolean;
};

// Fixtures are entered by hand in the admin dashboard — there is no external
// data source. Shaped to match what PredictionCard/PredictionManager expect.
export type StoredFixture = {
  fixture: {
    id: string;
    date: string;
    venue: string | null;
    referee: string | null;
    status: string | null;
    elapsed: number | null;
  };
  teams: {
    home: { name: string; logo: string; id: number | null };
    away: { name: string; logo: string; id: number | null };
  };
  league: { id: number | null; name: string | null; season: number | null };
  goals: { home: number | null; away: number | null };
};

export type FixturesResult = {
  fixtures: StoredFixture[];
  firestoreAvailable: boolean;
};

const FIRESTORE_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Firestore request timed out after ${ms}ms`)),
      ms
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export async function getAllPredictions(): Promise<PredictionsResult> {
  try {
    const liteDb = getFirestore(app);
    const snapshot = await withTimeout(
      getDocs(collection(liteDb, "predictions")),
      FIRESTORE_TIMEOUT_MS
    );
    const map = new Map<string, StoredPrediction>();
    snapshot.forEach((docSnap) => {
      map.set(docSnap.id, docSnap.data() as StoredPrediction);
    });
    return { predictions: map, firestoreAvailable: true };
  } catch (error) {
    console.error("Firestore unavailable, falling back to empty predictions:", error);
    return { predictions: new Map(), firestoreAvailable: false };
  }
}

export async function getAllFixtures(): Promise<FixturesResult> {
  try {
    const liteDb = getFirestore(app);
    const snapshot = await withTimeout(
      getDocs(collection(liteDb, "fixtures")),
      FIRESTORE_TIMEOUT_MS
    );
    const fixtures: StoredFixture[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data() as any;
      fixtures.push({
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
      });
    });
    fixtures.sort(
      (a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
    );
    return { fixtures, firestoreAvailable: true };
  } catch (error) {
    console.error("Firestore unavailable, falling back to empty fixtures:", error);
    return { fixtures: [], firestoreAvailable: false };
  }
}
