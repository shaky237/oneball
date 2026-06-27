import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="main">
      <div className="vip-card">
        <h1 className="logo">ABOUT ONEBALL</h1>

        <Image
          src="/oneball-logo.jpeg"
          alt="ONEBALL Logo"
          width={140}
          height={140}
          style={{
            display: "block",
            margin: "20px auto",
          }}
        />

        <h2
          style={{
            textAlign: "center",
            color: "#22c55e",
          }}
        >
          Football Intelligence. Better Decisions.
        </h2>

        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
            lineHeight: "1.8",
            color: "#cbd5e1",
          }}
        >
          ONEBALL is a modern football prediction platform built to help football
          fans make smarter betting decisions using expert analysis, match
          statistics, winning probabilities and premium football insights.
        </p>
      </div>

      <div className="vip-card">
        <h2
          style={{
            color: "#22c55e",
          }}
        >
          Why ONEBALL Was Built
        </h2>

        <ul
          style={{
            marginTop: "20px",
            lineHeight: "2",
            fontSize: "17px",
          }}
        >
          <li>✅ Daily football predictions.</li>
          <li>✅ Winning probability analysis.</li>
          <li>✅ Premium VIP predictions.</li>
          <li>✅ Correct score expert picks.</li>
          <li>✅ Trusted football insights.</li>
          <li>✅ Fast and simple experience.</li>
        </ul>
      </div>

      <div className="vip-card">
        <h2
          style={{
            color: "#22c55e",
            textAlign: "center",
          }}
        >
          Our Inspiration
        </h2>

        <Image
          src="/ronaldo.jpeg"
          alt="Cristiano Ronaldo"
          width={280}
          height={340}
          style={{
            display: "block",
            margin: "20px auto",
            borderRadius: "15px",
          }}
        />

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            lineHeight: "1.8",
          }}
        >
          ONEBALL believes in discipline, consistency and preparation. Every
          prediction is designed to give football fans better information before
          making decisions.
        </p>
      </div>

      <div className="vip-card">
        <h2
          style={{
            color: "#22c55e",
            textAlign: "center",
          }}
        >
          Join the ONEBALL Community
        </h2>

        <div className="community-buttons">
          <a
            href="https://wa.me/447490429453"
            target="_blank"
            className="primary-btn"
          >
            📢 Join ONEBALL Telegram
          </a>

          <a
            href="https://wa.me/447490429453"
            target="_blank"
            className="primary-btn"
          >
            💬 Join ONEBALL Team Of Experts
          </a>

          <a
            href="https://wa.me/447490429453"
            target="_blank"
            className="secondary-btn"
          >
            🤝 Become a ONEBALL Partner
          </a>

          <a
            href="https://wa.me/447490429453"
            target="_blank"
            className="secondary-btn"
          >
            💼 Invest in ONEBALL
          </a>
        </div>
      </div>

<br />

<a
  href="https://wa.me/447490429453"
  target="_blank"
  className="secondary-btn"
>
  🆘 Help & Support
</a>

<br />
<br />



      <div style={{ marginTop: "30px" }}>
        <Link href="/" className="primary-btn">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}