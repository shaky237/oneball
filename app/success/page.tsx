import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="main">
      <div className="vip-card">
        <h1 className="logo">
          ✅ Verification Submitted
        </h1>

        <p>
          Thank you for submitting your payment verification.
        </p>

        <br />

        <p>
          Our team is currently checking your payment details.
        </p>

        <br />

        <p>
          Approval usually takes up to 15 minutes.
        </p>

        <br />

        <p>
          Now return to home page After 10 minutes, click VIP Access on the home  and enter the phone number used for payment MTN or orange if you used 
          BTC or USDT enter Transaction ID to check your approval status.
        </p>

<br />
        <p style={{ color: "#22c55e" }}>
        Your payment information is secure. We use the details you provide 
        only for payment verification and VIP activation. Your information is kept
         confidential and protected.
        </p>
      

        <br />

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            className="primary-btn"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}