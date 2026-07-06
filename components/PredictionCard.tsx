import Link from "next/link";
import { formatMatchDate, formatMatchTime } from "../lib/matchTime";

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
        <div className="prediction-row">
          <div className="prediction-col">
            <p className="prediction-label">🏠 Home</p>
            <h4 className="prediction-value">{homePercent}</h4>
          </div>
          <div className="prediction-col">
            <p className="prediction-label">🤝 Draw</p>
            <h4 className="prediction-value">{drawPercent}</h4>
          </div>
          <div className="prediction-col">
            <p className="prediction-label">✈️ Away</p>
            <h4 className="prediction-value">{awayPercent}</h4>
          </div>
        </div>
      )}

      <div className="advice">
        <strong>💡 Advice:</strong> {advice}
      </div>

      {predictedWinner != null && (
        <div className="extra-predictions">
          <strong>🏆 Predicted Winner:</strong> {predictedWinner}
        </div>
      )}

      <Link href="/vip" className="vip-btn">
        🔒 Unlock VIP Correct Score
      </Link>
    </div>
  );
}
