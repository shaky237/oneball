import Link from "next/link";

export default function PredictionCard({
  homeTeam,
  awayTeam,
  homeLogo,
  awayLogo,
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
  homePercent?: string | null;
  drawPercent?: string | null;
  awayPercent?: string | null;
  predictedScore?: string | null;
  predictedWinner?: string | null;
  advice: string;
}) {
  return (
    <div className="prediction-card">
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

      <div className="probabilities">
        {predictedScore != null && (
          <div>
            <strong>⚽ Predicted Score:</strong> {predictedScore}
          </div>
        )}

        {homePercent != null && (
          <>
            <div>🏠 Home Win: {homePercent}</div>
            <div>🤝 Draw: {drawPercent}</div>
            <div>✈️ Away Win: {awayPercent}</div>
          </>
        )}

        <hr style={{ margin: "15px 0" }} />

        {predictedWinner != null && (
          <div>
            <strong>🏆 Predicted Winner:</strong> {predictedWinner}
          </div>
        )}

        <div style={{ marginTop: "10px" }}>
          <strong>💡 Advice:</strong> {advice}
        </div>
      </div>

      <Link href="/vip" className="vip-btn">
        🔒 Unlock VIP Correct Score
      </Link>
    </div>
  );
}