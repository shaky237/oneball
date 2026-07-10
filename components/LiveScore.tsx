"use client";

import { useEffect, useRef, useState } from "react";
import { getStatusLabel, isFinishedStatus, isLiveStatus } from "../lib/liveStatus";

const POLL_MS = 20000;
const POLL_LEAD_MS = 5 * 60 * 1000; // start polling once we're within 5 min of kickoff

type FixtureStatus = {
  status?: string | null;
  elapsed?: number | null;
  goalsHome?: number | null;
  goalsAway?: number | null;
};

export default function LiveScore({
  fixtureId,
  homeTeam,
  awayTeam,
  homeLogo,
  awayLogo,
  matchDate,
  status: initialStatus,
  elapsed: initialElapsed,
  goalsHome: initialGoalsHome,
  goalsAway: initialGoalsAway,
}: {
  fixtureId: number | string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  matchDate?: string | null;
  status?: string | null;
  elapsed?: number | null;
  goalsHome?: number | null;
  goalsAway?: number | null;
}) {
  const [live, setLive] = useState<FixtureStatus>({
    status: initialStatus,
    elapsed: initialElapsed,
    goalsHome: initialGoalsHome,
    goalsAway: initialGoalsAway,
  });
  const finished = useRef(isFinishedStatus(initialStatus));

  useEffect(() => {
    if (finished.current) return;

    const kickoff = matchDate ? new Date(matchDate).getTime() : null;
    const nearOrLive =
      isLiveStatus(initialStatus) ||
      (kickoff != null && kickoff - Date.now() <= POLL_LEAD_MS);

    // Most fixtures are NS well ahead of kickoff — skip polling entirely so
    // the homepage doesn't fire background requests for matches nobody is
    // watching yet.
    if (!nearOrLive) return;

    let cancelled = false;
    const controller = new AbortController();

    async function poll() {
      try {
        const res = await fetch(
          `/api/match-info/${fixtureId}?section=status`,
          { signal: controller.signal }
        );
        const { data } = await res.json();
        if (cancelled || !data) return;

        const nextStatus = data.fixture?.status?.short ?? null;
        setLive({
          status: nextStatus,
          elapsed: data.fixture?.status?.elapsed ?? null,
          goalsHome: data.goals?.home ?? null,
          goalsAway: data.goals?.away ?? null,
        });

        if (isFinishedStatus(nextStatus)) {
          finished.current = true;
          clearInterval(interval);
        }
      } catch {
        // Ignore transient errors — next poll will retry.
      }
    }

    poll();
    const interval = setInterval(poll, POLL_MS);

    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(interval);
    };
  }, [fixtureId, matchDate, initialStatus]);

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
