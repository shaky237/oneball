"use client";

import { useEffect, useRef, useState } from "react";
import { formatMatchDate, formatMatchTime } from "../lib/matchTime";
import { getStatusLabel, isFinishedStatus, isLiveStatus } from "../lib/liveStatus";

type Section = "overview" | "form" | "h2h" | "stats" | "players" | "lineups" | "live";
type SectionState = { status: "idle" | "loading" | "done"; data: any };

const LIVE_POLL_MS = 18000;

const TABS: { id: Section; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "form", label: "Form" },
  { id: "h2h", label: "H2H" },
  { id: "stats", label: "Stats" },
  { id: "players", label: "Players" },
  { id: "lineups", label: "Lineups" },
];

export default function MatchInfoModal({
  open,
  onClose,
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
  status: initialStatus,
  elapsed: initialElapsed,
  goalsHome: initialGoalsHome,
  goalsAway: initialGoalsAway,
}: {
  open: boolean;
  onClose: () => void;
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
  const [activeTab, setActiveTab] = useState<Section>("overview");
  const [sections, setSections] = useState<Record<string, SectionState>>({});
  const [live, setLive] = useState({
    status: initialStatus ?? null,
    elapsed: initialElapsed ?? null,
    goalsHome: initialGoalsHome ?? null,
    goalsAway: initialGoalsAway ?? null,
    events: null as any[] | null,
    statistics: null as any[] | null,
  });

  const query = new URLSearchParams({
    ...(homeTeamId ? { homeTeamId: String(homeTeamId) } : {}),
    ...(awayTeamId ? { awayTeamId: String(awayTeamId) } : {}),
    ...(leagueId ? { leagueId: String(leagueId) } : {}),
    ...(season ? { season: String(season) } : {}),
  }).toString();

  async function fetchSection(section: Section) {
    if (section === "overview") return;
    setSections((prev) => ({ ...prev, [section]: { status: "loading", data: null } }));
    try {
      const res = await fetch(
        `/api/match-info/${fixtureId}?section=${section}${query ? `&${query}` : ""}`
      );
      const { data } = await res.json();
      setSections((prev) => ({ ...prev, [section]: { status: "done", data } }));
    } catch {
      setSections((prev) => ({ ...prev, [section]: { status: "done", data: null } }));
    }
  }

  // Fetch the active tab's data once, the first time it's activated.
  useEffect(() => {
    if (!open) return;
    const current = sections[activeTab];
    if (!current || current.status === "idle") {
      fetchSection(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeTab]);

  // Refresh live status once on open, then keep polling only while the
  // match is actually in progress. Stops immediately when the modal closes.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const controller = new AbortController();
    let interval: ReturnType<typeof setInterval> | undefined;

    async function pollLive() {
      try {
        const res = await fetch(`/api/match-info/${fixtureId}?section=live`, {
          signal: controller.signal,
        });
        const { data } = await res.json();
        if (cancelled || !data) return;

        const f = data.status;
        const nextStatus = f?.fixture?.status?.short ?? null;
        setLive({
          status: nextStatus,
          elapsed: f?.fixture?.status?.elapsed ?? null,
          goalsHome: f?.goals?.home ?? null,
          goalsAway: f?.goals?.away ?? null,
          events: data.events ?? null,
          statistics: data.statistics ?? null,
        });

        if (isLiveStatus(nextStatus) && !interval) {
          interval = setInterval(pollLive, LIVE_POLL_MS);
        }
        if (isFinishedStatus(nextStatus) && interval) {
          clearInterval(interval);
          interval = undefined;
        }
      } catch {
        // ignore, next poll retries
      }
    }

    pollLive();

    return () => {
      cancelled = true;
      controller.abort();
      if (interval) clearInterval(interval);
    };
  }, [open, fixtureId]);

  const statusLabel = getStatusLabel(live.status, live.elapsed);
  const liveTabVisible = isLiveStatus(live.status);
  const tabs = liveTabVisible ? [...TABS, { id: "live" as Section, label: "🔴 Live" }] : TABS;

  return (
    <>
      <div
        className={`match-info-overlay ${open ? "open" : ""}`}
        onClick={onClose}
      />
      <div
        className={`match-info-modal ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Match information"
      >
        <div className="match-info-handle" />

        <div className="match-info-header">
          <div className="match-info-header-teams">
            <div className="match-info-team">
              <img src={homeLogo} alt={homeTeam} />
              <span>{homeTeam}</span>
            </div>

            {statusLabel ? (
              <div className="match-info-scoreline">
                {isFinishedStatus(live.status) ? (
                  <span className="ft-badge">FT</span>
                ) : (
                  <span className="live-badge">
                    <span className="live-dot" />
                    LIVE
                  </span>
                )}
                <strong>
                  {live.goalsHome ?? 0} - {live.goalsAway ?? 0}
                </strong>
                {!isFinishedStatus(live.status) && (
                  <span className="live-clock">{statusLabel}</span>
                )}
              </div>
            ) : (
              <span className="match-info-vs">VS</span>
            )}

            <div className="match-info-team">
              <img src={awayLogo} alt={awayTeam} />
              <span>{awayTeam}</span>
            </div>
          </div>

          <button className="match-info-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="match-info-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`match-info-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="match-info-body">
          {activeTab === "overview" && (
            <OverviewTab
              league={league}
              venue={venue}
              referee={referee}
              matchDate={matchDate}
              statusLabel={statusLabel}
              isFinished={isFinishedStatus(live.status)}
            />
          )}
          {activeTab === "form" && (
            <FormTab
              state={sections.form}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              homeTeamId={homeTeamId}
              awayTeamId={awayTeamId}
            />
          )}
          {activeTab === "h2h" && <H2HTab state={sections.h2h} />}
          {activeTab === "stats" && (
            <StatsTab state={sections.stats} homeTeam={homeTeam} awayTeam={awayTeam} />
          )}
          {activeTab === "players" && (
            <PlayersTab state={sections.players} homeTeam={homeTeam} awayTeam={awayTeam} />
          )}
          {activeTab === "lineups" && <LineupsTab state={sections.lineups} />}
          {activeTab === "live" && (
            <LiveTab events={live.events} statistics={live.statistics} />
          )}
        </div>
      </div>
    </>
  );
}

function Skeleton() {
  return (
    <div className="skeleton-group">
      <div className="skeleton skeleton-line" style={{ width: "70%" }} />
      <div className="skeleton skeleton-line" style={{ width: "90%" }} />
      <div className="skeleton skeleton-line" style={{ width: "60%" }} />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="match-info-empty">{text}</p>;
}

function OverviewTab({
  league,
  venue,
  referee,
  matchDate,
  statusLabel,
  isFinished,
}: {
  league?: string | null;
  venue?: string | null;
  referee?: string | null;
  matchDate?: string | null;
  statusLabel: string | null;
  isFinished: boolean;
}) {
  const rows = [
    { label: "Competition", value: league },
    { label: "Stadium", value: venue },
    { label: "Referee", value: referee },
    {
      label: "Kickoff",
      value: matchDate
        ? `${formatMatchDate(matchDate)} • ${formatMatchTime(matchDate)}`
        : null,
    },
    {
      label: "Status",
      value: isFinished ? "Full Time" : statusLabel ? `Live — ${statusLabel}` : "Not started",
    },
  ].filter((r) => r.value);

  return (
    <div className="match-info-detail-list">
      {rows.map((row) => (
        <div className="match-info-detail-row" key={row.label}>
          <span className="match-info-detail-label">{row.label}</span>
          <span className="match-info-detail-value">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function resultFor(fixture: any, teamId?: number | null): "W" | "D" | "L" | null {
  if (!teamId) return null;
  const isHome = fixture.teams?.home?.id === teamId;
  const side = isHome ? fixture.teams?.home : fixture.teams?.away;
  if (side?.winner === true) return "W";
  if (side?.winner === false) return "L";
  if (fixture.goals?.home != null && fixture.goals?.away != null) return "D";
  return null;
}

function FormColumn({
  teamName,
  teamId,
  fixtures,
}: {
  teamName: string;
  teamId?: number | null;
  fixtures: any[] | null;
}) {
  if (!fixtures?.length) return <Empty text={`No recent form for ${teamName}`} />;

  const tally = { W: 0, D: 0, L: 0 };
  fixtures.forEach((f) => {
    const r = resultFor(f, teamId);
    if (r) tally[r]++;
  });

  return (
    <div className="form-column">
      <h4>{teamName}</h4>
      <div className="form-badges">
        {fixtures.map((f) => {
          const r = resultFor(f, teamId) || "-";
          return (
            <span key={f.fixture?.id} className={`form-badge form-${r}`}>
              {r}
            </span>
          );
        })}
      </div>
      <div className="form-tally">
        <span>{tally.W}W</span>
        <span>{tally.D}D</span>
        <span>{tally.L}L</span>
      </div>
    </div>
  );
}

function FormTab({
  state,
  homeTeam,
  awayTeam,
  homeTeamId,
  awayTeamId,
}: {
  state?: SectionState;
  homeTeam: string;
  awayTeam: string;
  homeTeamId?: number | null;
  awayTeamId?: number | null;
}) {
  if (!state || state.status === "loading") return <Skeleton />;
  if (!state.data) return <Empty text="Team form isn't available right now." />;

  return (
    <div className="form-columns">
      <FormColumn teamName={homeTeam} teamId={homeTeamId} fixtures={state.data.home} />
      <FormColumn teamName={awayTeam} teamId={awayTeamId} fixtures={state.data.away} />
    </div>
  );
}

function H2HTab({ state }: { state?: SectionState }) {
  if (!state || state.status === "loading") return <Skeleton />;
  if (!state.data?.length) return <Empty text="No previous meetings found." />;

  const meetings = state.data.slice(-5).reverse();

  return (
    <div className="h2h-list">
      <p className="match-info-note">Last {meetings.length} meetings</p>
      {meetings.map((m: any) => (
        <div className="h2h-row" key={m.fixture?.id}>
          <span className="h2h-date">{formatMatchDate(m.fixture?.date)}</span>
          <span className="h2h-teams">
            {m.teams?.home?.name} {m.goals?.home ?? "-"} - {m.goals?.away ?? "-"}{" "}
            {m.teams?.away?.name}
          </span>
          <span className="h2h-league">{m.league?.name}</span>
        </div>
      ))}
    </div>
  );
}

const FIXTURE_STAT_ROWS: { key: string; label: string }[] = [
  { key: "Total Shots", label: "Shots" },
  { key: "Shots on Goal", label: "Shots on Target" },
  { key: "Ball Possession", label: "Possession" },
  { key: "Passes %", label: "Pass Accuracy" },
  { key: "Corner Kicks", label: "Corners" },
  { key: "Yellow Cards", label: "Yellow Cards" },
  { key: "Red Cards", label: "Red Cards" },
];

function sumCardBuckets(buckets: any): number {
  if (!buckets) return 0;
  return Object.values(buckets).reduce((sum: number, b: any) => sum + (b?.total || 0), 0);
}

function TeamStatBlock({ teamName, stat }: { teamName: string; stat: any }) {
  if (!stat) return <Empty text={`No statistics available for ${teamName}.`} />;

  if (stat.source === "fixture") {
    const map = new Map(stat.statistics.map((s: any) => [s.type, s.value]));
    const rows = FIXTURE_STAT_ROWS.map((r) => ({ label: r.label, value: map.get(r.key) })).filter(
      (r) => r.value != null
    );
    if (!rows.length) return <Empty text={`No statistics available for ${teamName}.`} />;
    return (
      <div className="stat-block">
        <h4>{teamName}</h4>
        {rows.map((r) => (
          <div className="stat-row" key={r.label}>
            <span>{r.label}</span>
            <strong>{String(r.value)}</strong>
          </div>
        ))}
      </div>
    );
  }

  // source === "season" — pre-match aggregate fallback
  const s = stat.statistics;
  const rows = [
    { label: "Goals Scored", value: s?.goals?.for?.total?.total },
    { label: "Goals Conceded", value: s?.goals?.against?.total?.total },
    { label: "Clean Sheets", value: s?.clean_sheet?.total },
    { label: "Yellow Cards", value: sumCardBuckets(s?.cards?.yellow) || undefined },
    { label: "Red Cards", value: sumCardBuckets(s?.cards?.red) || undefined },
  ].filter((r) => r.value != null);

  if (!rows.length) return <Empty text={`No statistics available for ${teamName}.`} />;

  return (
    <div className="stat-block">
      <h4>{teamName}</h4>
      <p className="match-info-note">Season averages — match stats appear once kickoff happens</p>
      {rows.map((r) => (
        <div className="stat-row" key={r.label}>
          <span>{r.label}</span>
          <strong>{String(r.value)}</strong>
        </div>
      ))}
    </div>
  );
}

function StatsTab({
  state,
  homeTeam,
  awayTeam,
}: {
  state?: SectionState;
  homeTeam: string;
  awayTeam: string;
}) {
  if (!state || state.status === "loading") return <Skeleton />;
  if (!state.data) return <Empty text="Team statistics aren't available right now." />;

  return (
    <div className="stat-blocks">
      <TeamStatBlock teamName={homeTeam} stat={state.data.home} />
      <TeamStatBlock teamName={awayTeam} stat={state.data.away} />
    </div>
  );
}

function PlayerCard({ player }: { player: any }) {
  return (
    <div className="player-card">
      {player.photo ? (
        <img src={player.photo} alt={player.name} />
      ) : (
        <div className="player-photo-fallback">
          {player.number ?? "?"}
        </div>
      )}
      <span className="player-name">{player.name}</span>
      <span className="player-meta">
        {[player.position, player.number != null ? `#${player.number}` : null, player.age ? `${player.age}y` : null]
          .filter(Boolean)
          .join(" • ")}
      </span>
    </div>
  );
}

function PlayersTab({
  state,
  homeTeam,
  awayTeam,
}: {
  state?: SectionState;
  homeTeam: string;
  awayTeam: string;
}) {
  if (!state || state.status === "loading") return <Skeleton />;
  if (!state.data?.home && !state.data?.away)
    return <Empty text="Squad list isn't available right now." />;

  return (
    <div className="players-teams">
      {[
        { team: homeTeam, squad: state.data.home },
        { team: awayTeam, squad: state.data.away },
      ].map(({ team, squad }) =>
        squad?.players?.length ? (
          <div className="players-group" key={team}>
            <h4>{team}</h4>
            <div className="player-grid">
              {squad.players.map((p: any) => (
                <PlayerCard player={p} key={p.id} />
              ))}
            </div>
          </div>
        ) : (
          <div className="players-group" key={team}>
            <h4>{team}</h4>
            <Empty text="Squad list isn't available right now." />
          </div>
        )
      )}
    </div>
  );
}

function LineupTeam({ lineup }: { lineup: any }) {
  return (
    <div className="lineup-team">
      <h4>
        {lineup.team?.name}
        {lineup.formation ? ` — ${lineup.formation}` : ""}
      </h4>
      <div className="lineup-list">
        <p className="match-info-note">Starting XI</p>
        {lineup.startXI?.map((s: any) => (
          <div className="lineup-player" key={s.player?.id}>
            <span className="lineup-number">{s.player?.number}</span>
            <span>{s.player?.name}</span>
            <span className="lineup-pos">{s.player?.pos}</span>
          </div>
        ))}
      </div>
      {lineup.substitutes?.length > 0 && (
        <div className="lineup-list">
          <p className="match-info-note">Bench</p>
          {lineup.substitutes.map((s: any) => (
            <div className="lineup-player" key={s.player?.id}>
              <span className="lineup-number">{s.player?.number}</span>
              <span>{s.player?.name}</span>
              <span className="lineup-pos">{s.player?.pos}</span>
            </div>
          ))}
        </div>
      )}
      {lineup.coach?.name && (
        <p className="match-info-note">Coach: {lineup.coach.name}</p>
      )}
    </div>
  );
}

function LineupsTab({ state }: { state?: SectionState }) {
  if (!state || state.status === "loading") return <Skeleton />;
  if (!state.data?.length)
    return <Empty text="Lineups aren't announced yet — check back closer to kickoff." />;

  return (
    <div className="lineups-teams">
      {state.data.map((lineup: any) => (
        <LineupTeam lineup={lineup} key={lineup.team?.id} />
      ))}
    </div>
  );
}

function LiveTab({
  events,
  statistics,
}: {
  events: any[] | null;
  statistics: any[] | null;
}) {
  const goals = events?.filter((e) => e.type === "Goal") || [];
  const subs = events?.filter((e) => e.type === "subst") || [];

  return (
    <div className="live-tab">
      {statistics?.length ? (
        <div className="stat-blocks">
          {statistics.map((s: any) => (
            <TeamStatBlock
              key={s.team?.id}
              teamName={s.team?.name}
              stat={{ source: "fixture", statistics: s.statistics }}
            />
          ))}
        </div>
      ) : (
        <Empty text="Live statistics aren't available yet." />
      )}

      <div className="live-events">
        <h4>⚽ Goalscorers</h4>
        {goals.length ? (
          goals.map((g, i) => (
            <div className="live-event-row" key={i}>
              <span>{g.time?.elapsed}'</span>
              <span>{g.player?.name}</span>
              <span className="match-info-note">{g.team?.name}</span>
            </div>
          ))
        ) : (
          <Empty text="No goals yet." />
        )}

        <h4>🔄 Substitutions</h4>
        {subs.length ? (
          subs.map((s, i) => (
            <div className="live-event-row" key={i}>
              <span>{s.time?.elapsed}'</span>
              <span>
                {s.player?.name} ↔ {s.assist?.name}
              </span>
              <span className="match-info-note">{s.team?.name}</span>
            </div>
          ))
        ) : (
          <Empty text="No substitutions yet." />
        )}
      </div>
    </div>
  );
}
