"use client";

import { useEffect, useState } from "react";
import MatchInfoModal from "./MatchInfoModal";

export default function MatchInfoButton({
  fixtureId,
  homeTeam,
  awayTeam,
  homeLogo,
  awayLogo,
  homeTeamId,
  awayTeamId,
  leagueId,
  season,
  league,
  matchDate,
  venue,
  referee,
  status,
  elapsed,
  goalsHome,
  goalsAway,
}: {
  fixtureId: number | string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeTeamId?: number | null;
  awayTeamId?: number | null;
  leagueId?: number | null;
  season?: number | null;
  league?: string | null;
  matchDate?: string | null;
  venue?: string | null;
  referee?: string | null;
  status?: string | null;
  elapsed?: number | null;
  goalsHome?: number | null;
  goalsAway?: number | null;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!open) return;
    // Lock background scroll while the modal/sheet is open.
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleOpen() {
    setMounted(true);
    setOpen(true);
  }

  return (
    <>
      <button className="match-info-btn" onClick={handleOpen}>
        📊 Match Info
      </button>

      {mounted && (
        <MatchInfoModal
          open={open}
          onClose={() => setOpen(false)}
          fixtureId={fixtureId}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeLogo={homeLogo}
          awayLogo={awayLogo}
          homeTeamId={homeTeamId}
          awayTeamId={awayTeamId}
          leagueId={leagueId}
          season={season}
          league={league}
          matchDate={matchDate}
          venue={venue}
          referee={referee}
          status={status}
          elapsed={elapsed}
          goalsHome={goalsHome}
          goalsAway={goalsAway}
        />
      )}
    </>
  );
}
