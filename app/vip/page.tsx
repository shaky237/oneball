import Link from "next/link"
export default function VIPPage() {
  return (
    <main className="main">
      <section className="hero">
        <h1 className="logo">VIP PREDICTIONS</h1>

        <p className="subtitle">
          Premium football predictions for VIP members
        </p>

        <div className="vip-card">
          <h2>🔥 Weekend Jackpot Tips</h2>

          <ul>
            <li>✅ Correct Score Predictions</li>
            <li>✅ HT/FT Predictions</li>
            <li>✅ Over/Under Goals</li>
            <li>✅ Both Teams To Score</li>
            <li>✅ Weekend Jackpot Tips</li>
          </ul>

          <Link href="/payment" className="primary-btn">
  Join ONEBALL VIP
</Link>
        </div>
      </section>
    </main>
  );
}