"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function VipAccess() {
  const [paymentId, setPaymentId] = useState("");
  const router = useRouter();

  async function checkAccess() {
    const querySnapshot = await getDocs(
      collection(db, "payments")
    );

    const payment = querySnapshot.docs.find((doc) => {
      const data = doc.data();

      return (
        String(data.paymentInfo ?? "").trim() ===
        paymentId.trim()
      );
    });

    if (!payment) {
      alert("Payment information not found.");
      return;
    }

    if (payment.data().status === "approved") {
      localStorage.setItem("vipAccess", "true");
      router.push("/vip/games");
    } else {
      alert("Your payment is still pending approval.");
    }
  }

  return (
    <main className="main">
      <div className="vip-card">

        <h1 className="logo">
          VIP Premium Access
        </h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#cbd5e1",
          }}
        >
          Enter the payment information you used when purchasing the
          Premium VIP subscription.
        </p>

        <label>
          Payment Information
        </label>

        <input
          type="text"
          placeholder="Phone Number or Transaction ID"
          value={paymentId}
          onChange={(e) => setPaymentId(e.target.value)}
        />

        <p
          style={{
            marginTop: "10px",
            fontSize: "14px",
          }}
        >
          For MTN Mobile Money or Orange Money, enter the phone number used for payment.
          <br />
          For USDT or Bitcoin, enter your transaction ID (TXID).
        </p>

        <br />

        <button
          className="primary-btn"
          onClick={checkAccess}
        >
          Verify Access
        </button>

      </div>
    </main>
  );
}