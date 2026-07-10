import Link from "next/link";
import { formatMatchDate, formatMatchTime } from "../lib/matchTime";
import LiveScore from "./LiveScore";
import MatchInfoButton from "./MatchInfoButton";

export default function PredictionCard({
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
  homePercent,
  drawPercent,
  awayPercent,
  predictedScore,
  predictedWinner,
  advice,
}: {
  fixtureId?: number | string | null;
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

      {fixtureId != null ? (
        <LiveScore
          fixtureId={fixtureId}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homeLogo={homeLogo}
          awayLogo={awayLogo}
          matchDate={matchDate}
          status={status}
          elapsed={elapsed}
          goalsHome={goalsHome}
          goalsAway={goalsAway}
        />
      ) : (
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
      )}

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

      <div className="card-footer">
        <div className="advice">
          <strong>💡 Advice:</strong> {advice}
        </div>

        {fixtureId != null && (
          <MatchInfoButton
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
