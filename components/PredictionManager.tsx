"use client";

import { useState, useEffect } from "react";
import { formatMatchDate, formatMatchTime } from "../lib/matchTime";

type Fixture = {
  fixture: {
    id: number;
    date: string;
  };
  teams: {
    home: { name: string; logo: string };
    away: { name: string; logo: string };
  };
  league: { name: string };
};

type PredictionFields = {
  homePercent: string;
  drawPercent: string;
  awayPercent: string;
  advice: string;
};

const empty: PredictionFields = {
  homePercent: "",
  drawPercent: "",
  awayPercent: "",
  advice: "",
};

type NewFixtureFields = {
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  league: string;
  matchDate: string;
  venue: string;
  referee: string;
};

const emptyFixture: NewFixtureFields = {
  homeTeam: "",
  awayTeam: "",
  homeLogo: "",
  awayLogo: "",
  league: "",
  matchDate: "",
  venue: "",
  referee: "",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  margin: "0",
  marginBottom: "0",
  marginTop: "0",
  background: "#18233f",
  border: "1px solid #334155",
  borderRadius: "8px",
  color: "white",
  fontSize: "14px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#94a3b8",
  fontSize: "12px",
  fontWeight: "bold",
  marginBottom: "4px",
  marginTop: "0",
};

export default function PredictionManager() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [predictions, setPredictions] = useState<
    Record<string, PredictionFields>
  >({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [newFixture, setNewFixture] = useState<NewFixtureFields>(emptyFixture);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});

  // Fetches fixtures + predictions and refreshes the lists. Used both for
  // the initial load and to refresh after creating a fixture.
  async function refresh(): Promise<void> {
    const [fixturesRes, predictionsRes] = await Promise.all([
      fetch("/api/fixtures"),
      fetch("/api/predictions"),
    ]);

    if (!fixturesRes.ok) {
      throw new Error(`Fixtures fetch failed: ${fixturesRes.status}`);
    }

    const allFixtures: Fixture[] = await fixturesRes.json();
    const storedPredictions: Record<string, PredictionFields> = predictionsRes.ok
      ? await predictionsRes.json()
      : {};

    setFixtures(allFixtures);
    setPredictions(storedPredictions);
  }

  useEffect(() => {
    async function load() {
      try {
        await refresh();
      } catch (err: unknown) {
        setLoadError(
          err instanceof Error ? err.message : "Unknown error loading data"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleNewFixtureChange(field: keyof NewFixtureFields, value: string) {
    setNewFixture((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreateFixture() {
    setCreateError(null);

    if (!newFixture.homeTeam || !newFixture.awayTeam || !newFixture.matchDate) {
      setCreateError("Home team, away team and kickoff date are required.");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/fixtures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFixture),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setNewFixture(emptyFixture);
      await refresh();
    } catch (err: unknown) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create fixture"
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteFixture(fixtureId: string) {
    if (!confirm("Delete this fixture and its prediction?")) return;

    setDeleting((prev) => ({ ...prev, [fixtureId]: true }));
    try {
      const res = await fetch(`/api/fixtures/${fixtureId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setFixtures((prev) => prev.filter((f) => String(f.fixture.id) !== fixtureId));
    } catch (err: unknown) {
      alert(
        `Failed to delete: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setDeleting((prev) => ({ ...prev, [fixtureId]: false }));
    }
  }

  function handleChange(
    fixtureId: string,
    field: keyof PredictionFields,
    value: string
  ) {
    setPredictions((prev) => ({
      ...prev,
      [fixtureId]: {
        ...empty,
        ...prev[fixtureId],
        [field]: value,
      },
    }));
  }

  async function handleSave(fixtureId: string) {
    setSaving((prev) => ({ ...prev, [fixtureId]: true }));
    setSaved((prev) => ({ ...prev, [fixtureId]: false }));

    const data: PredictionFields = {
      ...empty,
      ...predictions[fixtureId],
    };

    try {
      const res = await fetch(`/api/predictions/${fixtureId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setSaved((prev) => ({ ...prev, [fixtureId]: true }));
      setTimeout(() => {
        setSaved((prev) => ({ ...prev, [fixtureId]: false }));
      }, 2500);
    } catch (err: unknown) {
      alert(
        `Failed to save: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setSaving((prev) => ({ ...prev, [fixtureId]: false }));
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "60px", color: "#94a3b8", textAlign: "center" }}>
        Loading fixtures…
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ padding: "60px", color: "#f87171", textAlign: "center" }}>
        Error: {loadError}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#00ff88", fontSize: "28px", marginBottom: "6px" }}>
        Prediction Manager
      </h1>
      <p style={{ color: "#64748b", marginBottom: "30px" }}>
        {fixtures.length} upcoming fixture
        {fixtures.length !== 1 ? "s" : ""}. Enter values and click Save — the
        homepage updates immediately.
      </p>

      <div
        style={{
          background: "#10182b",
          border: "1px solid #1d2b4d",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ color: "white", fontSize: "18px", marginBottom: "16px" }}>
          ➕ Add Fixture
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div>
            <label style={labelStyle}>Home Team *</label>
            <input
              type="text"
              placeholder="e.g. Arsenal"
              value={newFixture.homeTeam}
              onChange={(e) => handleNewFixtureChange("homeTeam", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Away Team *</label>
            <input
              type="text"
              placeholder="e.g. Chelsea"
              value={newFixture.awayTeam}
              onChange={(e) => handleNewFixtureChange("awayTeam", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Home Logo URL</label>
            <input
              type="text"
              placeholder="https://..."
              value={newFixture.homeLogo}
              onChange={(e) => handleNewFixtureChange("homeLogo", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Away Logo URL</label>
            <input
              type="text"
              placeholder="https://..."
              value={newFixture.awayLogo}
              onChange={(e) => handleNewFixtureChange("awayLogo", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>League</label>
            <input
              type="text"
              placeholder="e.g. Premier League"
              value={newFixture.league}
              onChange={(e) => handleNewFixtureChange("league", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Kickoff (WAT) *</label>
            <input
              type="datetime-local"
              value={newFixture.matchDate}
              onChange={(e) => handleNewFixtureChange("matchDate", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Venue</label>
            <input
              type="text"
              placeholder="e.g. Emirates Stadium"
              value={newFixture.venue}
              onChange={(e) => handleNewFixtureChange("venue", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Referee</label>
            <input
              type="text"
              placeholder="e.g. Michael Oliver"
              value={newFixture.referee}
              onChange={(e) => handleNewFixtureChange("referee", e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {createError && (
          <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "12px" }}>
            {createError}
          </p>
        )}

        <button
          onClick={handleCreateFixture}
          disabled={creating}
          style={{
            padding: "10px 28px",
            background: "#00ff88",
            color: "black",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: creating ? "not-allowed" : "pointer",
            opacity: creating ? 0.6 : 1,
            fontSize: "14px",
          }}
        >
          {creating ? "Creating…" : "Create Fixture"}
        </button>
      </div>

      {fixtures.length === 0 && (
        <p style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
          No fixtures yet — add one above.
        </p>
      )}

      {fixtures.map((fixture) => {
        const id = String(fixture.fixture.id);
        const pred: PredictionFields = { ...empty, ...predictions[id] };
        const isSaving = saving[id] ?? false;
        const isSaved = saved[id] ?? false;

        return (
          <div
            key={id}
            style={{
              background: "#10182b",
              border: "1px solid #1d2b4d",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "18px",
            }}
          >
            {/* Match header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "8px",
              }}
            >
              <img
                src={fixture.teams.home.logo}
                alt={fixture.teams.home.name}
                width={32}
                height={32}
                style={{ objectFit: "contain" }}
              />
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                {fixture.teams.home.name}
              </span>
              <span style={{ color: "#22c55e", fontWeight: "bold" }}>VS</span>
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                {fixture.teams.away.name}
              </span>
              <img
                src={fixture.teams.away.logo}
                alt={fixture.teams.away.name}
                width={32}
                height={32}
                style={{ objectFit: "contain" }}
              />
            </div>

            <p
              style={{
                color: "#475569",
                fontSize: "12px",
                marginBottom: "18px",
              }}
            >
              {fixture.league.name}&nbsp;·&nbsp;
              {formatMatchDate(fixture.fixture.date)}&nbsp;
              {formatMatchTime(fixture.fixture.date)}
            </p>

            {/* Percentage inputs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label style={labelStyle}>Home Win %</label>
                <input
                  type="text"
                  placeholder="e.g. 55%"
                  value={pred.homePercent}
                  onChange={(e) =>
                    handleChange(id, "homePercent", e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Draw %</label>
                <input
                  type="text"
                  placeholder="e.g. 25%"
                  value={pred.drawPercent}
                  onChange={(e) =>
                    handleChange(id, "drawPercent", e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Away Win %</label>
                <input
                  type="text"
                  placeholder="e.g. 20%"
                  value={pred.awayPercent}
                  onChange={(e) =>
                    handleChange(id, "awayPercent", e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Advice */}
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Advice</label>
              <textarea
                placeholder="e.g. Back the home team — strong home record this season"
                value={pred.advice}
                rows={2}
                onChange={(e) => handleChange(id, "advice", e.target.value)}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "64px",
                }}
              />
            </div>

            {/* Save / Delete buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleSave(id)}
                disabled={isSaving}
                style={{
                  padding: "10px 28px",
                  background: isSaved ? "#22c55e" : "#00ff88",
                  color: "black",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  opacity: isSaving ? 0.6 : 1,
                  fontSize: "14px",
                  transition: "background 0.2s",
                }}
              >
                {isSaving ? "Saving…" : isSaved ? "✓ Saved!" : "Save Prediction"}
              </button>

              <button
                onClick={() => handleDeleteFixture(id)}
                disabled={deleting[id] ?? false}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  color: "#f87171",
                  border: "1px solid #f87171",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: (deleting[id] ?? false) ? "not-allowed" : "pointer",
                  opacity: (deleting[id] ?? false) ? 0.6 : 1,
                  fontSize: "14px",
                }}
              >
                {(deleting[id] ?? false) ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
