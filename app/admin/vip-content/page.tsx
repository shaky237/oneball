"use client";

import AdminGuard from "@/components/AdminGuard";
import VipContentUploader from "@/components/VipContentUploader";
import Link from "next/link";

export default function VipContentAdminPage() {
  return (
    <AdminGuard>
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          padding: "20px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h1 style={{ color: "#00ff88", fontSize: "24px", margin: 0 }}>
              VIP Content
            </h1>
            <Link
              href="/admin"
              style={{
                padding: "10px 20px",
                background: "#1e293b",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                border: "1px solid #334155",
                fontWeight: "bold",
              }}
            >
              ← Back to Admin
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <VipContentUploader
              docId="premiumGames"
              storageFolder="vip-content/premium-games"
              title="Premium Games"
              accentColor="#00ff88"
            />
            <VipContentUploader
              docId="correctScore"
              storageFolder="vip-content/correct-score"
              title="VIP Correct Score"
              accentColor="#ffd700"
            />
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
