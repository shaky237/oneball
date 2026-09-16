"use client";

import { getStatusLabel, isFinishedStatus } from "../lib/liveStatus";

type FixtureStatus = {
  status?: string | null;
  elapsed?: number | null;
  goalsHome?: number | null;
  goalsAway?: number | null;
};

export default function LiveScore({
  homeTeam,
  awayTeam,
  homeLogo,
  awayLogo,
  status: initialStatus,
  elapsed: initialElapsed,
  goalsHome: initialGoalsHome,
  goalsAway: initialGoalsAway,
}: {
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  status?: string | null;
  elapsed?: number | null;
  goalsHome?: number | null;
  goalsAway?: number | null;
}) {
  // Score/status are whatever the admin entered for this fixture — there is
  // no live data source to poll, so this is static for the page's lifetime.
  const live: FixtureStatus = {
    status: initialStatus,
    elapsed: initialElapsed,
    goalsHome: initialGoalsHome,
    goalsAway: initialGoalsAway,
  };

  const label = getStatusLabel(live.status, live.elapsed);
  const showScoreboard = label != null;

  return (
    <div className="teams">
      <div className="team">
        <img src={homeLogo} alt={homeTeam} />
        <span>{homeTeam}</span>
      </div>

      {showScoreboard ? (
        <div className="live-scoreboard">
          {isFinishedStatus(live.status) ? (
            <span className="ft-badge">FT</span>
          ) : (
            <span className="live-badge">
              <span className="live-dot" />
              LIVE
            </span>
          )}
          <span className="live-score">
            {live.goalsHome ?? 0} - {live.goalsAway ?? 0}
          </span>
          {!isFinishedStatus(live.status) && (
            <span className="live-clock">{label}</span>
          )}
        </div>
      ) : (
        <h2 className="vs">VS</h2>
      )}

      <div className="team">
        <img src={awayLogo} alt={awayTeam} />
        <span>{awayTeam}</span>
      </div>
    </div>
  );
}
