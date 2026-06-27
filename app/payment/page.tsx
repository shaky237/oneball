import Link from "next/link";
import Image from "next/image";
import CopyButton from "@/components/copyButton";

export default function PaymentPage() {
  return (
    <main className="main">
      <h1 className="logo">ONEBALL VIP PAYMENT</h1>

      <div className="vip-card">

        <h2>Choose Your VIP Plan</h2>

        <div
          style={{
            background: "#111827",
            padding: "18px",
            borderRadius: "10px",
            border: "1px solid #22c55e",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "#22c55e" }}>
            Premium Predictions
          </h3>

          <p
            style={{
              fontSize: "26px",
              fontWeight: "bold",
            }}
          >
            $12 / Month
          </p>

          <p>
            Daily football predictions with expert match analysis.
          </p>
        </div>

        <div
          style={{
            background: "#111827",
            padding: "18px",
            borderRadius: "10px",
            border: "1px solid gold",
            marginBottom: "30px",
          }}
        >
          <h3 style={{ color: "gold" }}>
            Correct Score VIP
          </h3>

          <p
            style={{
              fontSize: "26px",
              fontWeight: "bold",
            }}
          >
            $25 / Month
          </p>

          <p>
            Correct score predictions from trusted sources, analyzed by our team of experts.
          </p>
        </div>

        <h3 style={{ marginTop: "30px" }}>
          Choose Your Payment Method
        </h3>

        {/* MTN Mobile Money */}

        <div className="payment-card">
          <Image
            src="/mtn-logo.jpeg"
            alt="MTN Mobile Money"
            width={70}
            height={70}
          />

          <h4>MTN Mobile Money</h4>

          <p>
            Contact our payment agent to receive the current MTN Mobile Money payment number.
          </p>

          <a
            href="https://wa.me/447490429453?text=Hello%20ONEBALL,%20I%20want%20to%20pay%20using%20MTN%20Mobile%20Money."
            target="_blank"
            rel="noopener noreferrer"
            className="primary-btn"
          >
            Contact Agent
          </a>
        </div>

        {/* Orange Money */}

        <div className="payment-card">
          <Image
            src="/orange-logo.jpeg"
            alt="Orange Money"
            width={70}
            height={70}
          />

          <h4>Orange Money</h4>

          <p>
            Contact our payment agent to receive the current Orange Money payment number.
          </p>

          <a
            href="https://wa.me/447490429453?text=Hello%20ONEBALL,%20I%20want%20to%20pay%20using%20Orange%20Money."
            target="_blank"
            rel="noopener noreferrer"
            className="primary-btn"
          >
            Contact Agent
          </a>
        </div>

        {/* USDT */}

        <div className="payment-card">
          <Image
            src="/usdt-logo.jpeg"
            alt="USDT"
            width={70}
            height={70}
          />

          <h4>USDT (TRC20)</h4>

          <p>
            Wallet: TMnrBLnft4i7RnsVUFLF8KfzbevXhJtTH8
          </p>

          <CopyButton text="TMnrBLnft4i7RnsVUFLF8KfzbevXhJtTH8" />

          <br />
          <br />

          <Image
            src="/usdt-qr.jpeg"
            alt="USDT QR Code"
            width={180}
            height={180}
          />
        </div>

        {/* Bitcoin */}

        <div className="payment-card">
          <Image
            src="/bitcoin-logo.jpeg"
            alt="Bitcoin"
            width={70}
            height={70}
          />

          <h4>Bitcoin</h4>

          <p>
            Wallet: 15Qojnqz8j9DRqq6Ds2uytoh4zxbXsSK5V
          </p>

          <CopyButton text="15Qojnqz8j9DRqq6Ds2uytoh4zxbXsSK5V" />

          <br />
          <br />

          <Image
            src="/bitcoin-qr.jpeg"
            alt="Bitcoin QR Code"
            width={180}
            height={180}
          />
        </div>

        <h3 style={{ marginTop: "35px" }}>
          How It Works
        </h3>

        <p>1. Choose your preferred payment method.</p>
        <p>2. For MTN or Orange Money, click Contact Agent.</p>
        <p>3. For USDT or Bitcoin, send payment to the wallet above.</p>
        <p>4. Click "I Have Paid".</p>
        <p>5. Submit your payment information for verification.</p>
        <p>6. Wait for admin approval.</p>

        <br />

        <Link
          href="/payment-form"
          className="primary-btn"
        >
          I Have Paid
        </Link>

      </div>
    </main>
  );
}