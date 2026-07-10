// Fixture statuses that mean the match has already been played
export const FINISHED_STATUSES = new Set(["FT", "AET", "PEN", "AWD", "WO"]);

// Fixture statuses that mean the match is currently in progress
const LIVE_STATUSES = new Set(["1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT"]);

export function isLiveStatus(short?: string | null): boolean {
  return !!short && LIVE_STATUSES.has(short);
}

export function isFinishedStatus(short?: string | null): boolean {
  return !!short && FINISHED_STATUSES.has(short);
}

// Human-readable label for the live scoreboard ("65'", "HT", "FT"), or null
// when the match hasn't started yet (caller should show "VS" instead).
export function getStatusLabel(
  short?: string | null,
  elapsed?: number | null
): string | null {
  if (!short) return null;
  if (short === "HT") return "HT";
  if (FINISHED_STATUSES.has(short)) return "FT";
  if (LIVE_STATUSES.has(short)) {
    return elapsed != null ? `${elapsed}'` : short;
  }
  return null;
}
