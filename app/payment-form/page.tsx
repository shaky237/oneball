"use client";

import { useState } from "react";

export default function PaymentForm() {
  const [transactionId, setTransactionId] = useState("");
  const [plan, setPlan] = useState("Premium Predictions");
  const [paymentMethod, setPaymentMethod] = useState("MTN Mobile Money");

  async function handleSubmit() {
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionId,
        plan,
        paymentMethod,
      }),
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = "/success";
    } else {
      alert("Failed to save payment");
    }
  }

  return (
    <main className="main">
      <h1 className="logo">
        PAYMENT VERIFICATION
      </h1>

      <div className="vip-card">

        <label>What did you pay for?</label>

        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        >
          <option>Premium Predictions</option>
          <option>VIP Correct Scores</option>
        </select>

        <br />
        <br />

        <label>Payment Method</label>

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
        >
          <option>MTN Mobile Money</option>
          <option>Orange Money</option>
          <option>USDT (TRC20)</option>
          <option>Bitcoin</option>
        </select>

        <br />
        <br />

        <label>
          Phone Number / Transaction ID
        </label>

        <input
          type="text"
          placeholder="Enter your MoMo number or Bitcoin/USDT transaction ID"
          value={transactionId}
          onChange={(e) =>
            setTransactionId(e.target.value)
          }
        />

        <p
          style={{
            marginTop: "10px",
            fontSize: "14px",
          }}
        >
          For MTN Mobile Money or Orange Money, enter the phone number used for payment. For USDT or Bitcoin, enter your transaction ID (TXID).
        </p>

        <br />

        <button
          className="primary-btn"
          onClick={handleSubmit}
        >
          Submit Verification
        </button>

      </div>
    </main>
  );
}