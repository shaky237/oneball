import Link from "next/link";
import { getFixtures } from "../lib/football";
import { getAllPredictions } from "../lib/firestoreFixtures";
import PredictionCard from "../components/PredictionCard";

export default async function Home() {
  const [allMatches, storedPredictions] = await Promise.all([
    getFixtures(),
    getAllPredictions(),
  ]);

  const now = new Date();
  const matches = allMatches.filter(
    (m: any) =>
      new Date(m.fixture.date) > now &&
      storedPredictions.has(String(m.fixture.id))
  );

  return (
    <main className="main">
      <div className="hero-backgroung"></div>

      <section className="hero">
        <h1 className="logo">ONEBALL</h1>

        <p className="subtitle">
          Daily Football Predictions & Winning Probabilities
        </p>

        <div className="hero-buttons">
          <a href="#predictions" className="primary-btn">
            Today's Predictions
          </a>

          <Link href="/vip" className="secondary-btn">
            Unlock VIP
          </Link>

          <Link href="/vip/access" className="secondary-btn">
            VIP Premium Access
          </Link>

          <Link href="/vip/correct-score-access" className="secondary-btn">
            VIP Correct Score Access
          </Link>

          <Link href="/about" className="secondary-btn">
            ℹ️ About ONEBALL
          </Link>
        </div>
      </section>

      <section id="predictions" className="section">
        <div className="section-header">
          <h2>Top Predictions</h2>
        </div>

        {matches.map((match: any) => {
          const prediction = storedPredictions.get(
            String(match.fixture.id)
          );

          return (
            <PredictionCard
              key={match.fixture.id}
              homeTeam={match.teams.home.name}
              awayTeam={match.teams.away.name}
              homeLogo={match.teams.home.logo}
              awayLogo={match.teams.away.logo}
              league={match.league?.name || null}
              matchDate={match.fixture?.date || null}
              homePercent={prediction?.homePercent || null}
              drawPercent={prediction?.drawPercent || null}
              awayPercent={prediction?.awayPercent || null}
              advice={
                prediction?.advice || "No prediction yet — check back soon"
              }
            />
          );
        })}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Weekend VIP Games</h2>
        </div>

        <div className="vip-card">
          <h3>Premium Predictions</h3>

          <ul>
            <li>Correct Score Predictions</li>
            <li>HT/FT Predictions</li>
            <li>Weekend Jackpot Tips</li>
          </ul>

          <Link href="/vip" className="primary-btn">
            Join ONEBALL VIP
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>🏆 Browse by League</h2>

          <p>
            Select a competition to view fixtures,
            predictions and league table.
          </p>
        </div>

        <div className="league-grid">

          <div className="league-card">
            🇬🇧 Premier League
          </div>

          <div className="league-card">
            🇪🇸 La Liga
          </div>

          <div className="league-card">
            🇮🇹 Serie A
          </div>

         <div className="league-card">
            🇩🇪 Bundesliga
          </div>

          <div className="league-card">
            🇫🇷 Ligue 1
          </div>

         <div className="league-card">
            🇸🇦 Saudi Pro League
          </div>

          <div className="league-card">
            🏆 UEFA Champions League
          </div>

          <div className="league-card">
            🌍 FIFA World Cup
          </div>

        </div>
      </section>

    </main>
  );
}
