"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function CorrectScoreAccess() {
  const [paymentInfo, setPaymentInfo] = useState("");
  const router = useRouter();

  async function verifyAccess() {
    if (!paymentInfo.trim()) {
      alert("Please enter your phone number or transaction ID.");
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, "correctScorePayments"));

      const match = snapshot.docs.find((doc) => {
        const data = doc.data();

        return (
          data.paymentInfo === paymentInfo.trim() &&
          data.plan === "VIP Correct Scores" &&
          data.status === "approved"
        );
      });

      if (match) {
        router.push("/vip/correct-score");
      } else {
        alert("Payment not found or approval is still pending.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="main">
      <div className="vip-card">

        <h1 className="logo">
          VIP Correct Score Access
        </h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#cbd5e1",
          }}
        >
          Enter the payment information you used when purchasing the
          Correct Score VIP subscription.
        </p>

        <label>
          Payment Information
        </label>

        <input
          type="text"
          placeholder="Phone number or Transaction ID"
          value={paymentInfo}
          onChange={(e) => setPaymentInfo(e.target.value)}
        />

        <p
          style={{
            marginTop: "10px",
            fontSize: "14px",
          }}
        >
          For MTN Mobile Money or Orange Money, enter the phone number used for payment.
          For USDT or Bitcoin, enter your transaction ID (TXID).
        </p>

        <br />

        <button
          className="primary-btn"
          onClick={verifyAccess}
        >
          Verify Access
        </button>

      </div>
    </main>
  );
}