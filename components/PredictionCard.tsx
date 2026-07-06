import Link from "next/link";

function formatMatchDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatMatchTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function PredictionCard({
  homeTeam,
  awayTeam,
  homeLogo,
  awayLogo,
  league,
  matchDate,
  homePercent,
  drawPercent,
  awayPercent,
  predictedScore,
  predictedWinner,
  advice,
}: {
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  league?: string | null;
  matchDate?: string | null;
  homePercent?: string | null;
  drawPercent?: string | null;
  awayPercent?: string | null;
  predictedScore?: string | null;
  predictedWinner?: string | null;
  advice: string;
}) {
  return (
    <div className="prediction-card">
      {(league || matchDate) && (
        <div className="match-meta">
          {league && <h3 className="match-league">🏆 {league}</h3>}
          {matchDate && (
            <p className="match-datetime">
              {formatMatchDate(matchDate)} • {formatMatchTime(matchDate)}
            </p>
          )}
        </div>
      )}

      <div className="teams">
        <div className="team">
          <img src={homeLogo} alt={homeTeam} />
          <span>{homeTeam}</span>
        </div>

        <h2 className="vs">VS</h2>

        <div className="team">
          <img src={awayLogo} alt={awayTeam} />
          <span>{awayTeam}</span>
        </div>
      </div>

      {predictedScore != null && (
        <div className="extra-predictions">
          <strong>⚽ Predicted Score:</strong> {predictedScore}
        </div>
      )}

      {homePercent != null && (
        <div className="prediction-probabilities">
          <div className="probability">
            <p>🏠 Home Win</p>
            <h4>{homePercent}</h4>
          </div>
          <div className="probability">
            <p>🤝 Draw</p>
            <h4>{drawPercent}</h4>
          </div>
          <div className="probability">
            <p>✈️ Away Win</p>
            <h4>{awayPercent}</h4>
          </div>
        </div>
      )}

      {predictedWinner != null && (
        <div className="extra-predictions">
          <strong>🏆 Predicted Winner:</strong> {predictedWinner}
        </div>
      )}

      <div className="advice">
        <strong>💡 Advice:</strong> {advice}
      </div>

      <Link href="/vip" className="vip-btn">
        🔒 Unlock VIP Correct Score
      </Link>
    </div>
  );
}
