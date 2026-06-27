"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    async function load() {
      try {
        const [fixturesRes, predictionsRes] = await Promise.all([
          fetch("/api/fixtures"),
          fetch("/api/predictions"),
        ]);

        if (!fixturesRes.ok) {
          throw new Error(`Fixtures fetch failed: ${fixturesRes.status}`);
        }

        const allFixtures: Fixture[] = await fixturesRes.json();
        const storedPredictions: Record<string, PredictionFields> =
          await predictionsRes.json();

        // Show only fixtures from today onwards
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const upcoming = allFixtures.filter(
          (f) => new Date(f.fixture.date) >= todayStart
        );

        setFixtures(upcoming);
        setPredictions(storedPredictions);
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

      {fixtures.length === 0 && (
        <p style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
          No upcoming fixtures found.
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
              {new Date(fixture.fixture.date).toLocaleString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
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

            {/* Save button */}
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
          </div>
        );
      })}
    </div>
  );
}
